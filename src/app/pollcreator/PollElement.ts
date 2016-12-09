import { Question } from './question/question';

export class PollElement {
    question: Question;
    // TODO : pie chart

    constructor(question: Question) {
        this.question = question;
    }
}