import {QuestionUpdateDTO} from "./question-update-dto";

export class QuestionUpdateStatusDTO extends QuestionUpdateDTO {
    status: string;

    constructor(id: number, status: string) {
        super(id);
        this.status = status;
    }
}
