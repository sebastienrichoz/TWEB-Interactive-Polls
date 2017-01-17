import { Injectable } from '@angular/core';
import {UtilityService} from "./utility-service";
import {Http, RequestOptions, Headers} from "@angular/http";
import {PollroomCreationDTO} from "../models/pollroom-creation-dto";
import {Pollroom} from "../models/pollroom";
import {Question} from "../models/question";
import {QuestionCreationDTO} from "../models/question-creation-dto";

@Injectable()
export class PollroomService {

    private base = "/api/v1/pollrooms/";

    constructor(private http: Http, private utility: UtilityService) { }

    private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
    private options = new RequestOptions({ headers: this.headers });

    patchRoom(pollroom_id: number, status: string) {
        return this.http.patch(this.base + pollroom_id + "/", JSON.stringify(status), this.options)
            .toPromise()
            .then(this.utility.extractData)
            .catch(this.utility.handleError);
    }

    createPollroom(pollCreationDTO: PollroomCreationDTO): Promise<Pollroom> {
        return this.http.post(this.base, JSON.stringify(pollCreationDTO), this.options)
            .toPromise()
            .then(this.utility.extractData)
            .catch(this.utility.handleError);
    }

    joinPollroom(pollroom_id: string): Promise<Pollroom> {
        return this.http.get(this.base + pollroom_id + "/")
            .toPromise()
            .then(this.utility.extractData)
            .catch(this.utility.handleError);
    }

    addQuestion(pollroom_id: number, question: QuestionCreationDTO): Promise<Question> {
        return this.http.post(this.base + pollroom_id + "/questions/", JSON.stringify(question), this.options)
            .toPromise()
            .then(this.utility.extractData)
            .catch(this.utility.handleError);
    }

    patchQuestion(question: any): Promise<Question> {
        return this.http.patch(this.base + "questions/" + question.id, JSON.stringify(question), this.options)
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

}
