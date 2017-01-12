import {Question} from "../question";

export class PollElement {
    question: Question;
    // TODO : pie chart

    constructor(question: Question) {
        this.question = question;
    }
}