import {QuestionUpdateStatusDTO} from "./question-update-status-dto";

export class QuestionUpdateInfosDTO extends QuestionUpdateStatusDTO {
    title: string;
    answers: string[] = [];

    constructor(id: number, status: string, title: string, answers: string[]) {
        super(id, status);
        this.title = title;
        this.answers = answers;
    }
}
