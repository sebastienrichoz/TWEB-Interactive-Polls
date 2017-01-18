import { Injectable } from '@angular/core';
import {UtilityService} from "./utility-service";
import {Http, RequestOptions, Headers} from "@angular/http";
import {PollroomCreationDTO} from "../models/pollroom-creation-dto";
import {Pollroom} from "../models/pollroom";
import {Question} from "../models/question";
import {QuestionCreationDTO} from "../models/question-creation-dto";
import {QuestionUpdateDTO} from "../models/question-update-dto";

@Injectable()
export class PollroomService {

    private base = "/api/v1/";

    constructor(private http: Http, private utility: UtilityService) { }

    private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
    private options = new RequestOptions({ headers: this.headers });

    patchRoom(pollroom_id: number, status: any) {
        return this.http.patch(this.base + "pollrooms/" + pollroom_id + "/", JSON.stringify(status), this.options)
            .toPromise()
            .then(this.utility.extractData)
            .catch(this.utility.handleError);
    }

    addQuestion(pollroom_id: number, question: QuestionCreationDTO): Promise<Question> {
        return this.http.post(this.base + "questions/", JSON.stringify(question), this.options) // todo rajouter pollroom id dans model
            .toPromise()
            .then(this.utility.extractData)
            .catch(this.utility.handleError);
    }

    patchQuestion(question: QuestionUpdateDTO): Promise<Question> {
        return this.http.patch(this.base + "questions/" + question.id + "/", JSON.stringify(question), this.options)
            .toPromise()
            .then(this.utility.extractData)
            .catch(this.utility.handleError);
    }

    checkAnswer(answer_id: number): Promise<any> {
        return this.http.post(this.base + "answers/" + answer_id + "/check/", {}, this.options)
            .toPromise()
            .catch(this.utility.handleError);
    }

    uncheckAnswer(answer_id: number): Promise<any> {
        return this.http.post(this.base + "answers/" + answer_id + "/uncheck/", {}, this.options)
            .toPromise()
            .catch(this.utility.handleError);
    }

    voteUp(question_id: number): Promise<any> {
        return this.http.post(this.base + "questions/" + question_id + "/voteup/", {}, this.options)
            .toPromise()
            .catch(this.utility.handleError);
    }

    voteDown(question_id: number): Promise<any> {
        return this.http.post(this.base + "questions/" + question_id + "/votedown/", {}, this.options)
            .toPromise()
            .catch(this.utility.handleError);
    }
}
