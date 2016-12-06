import { Question } from './question/question';

export class PollElement {
    question: Question;
    // TODO : pie chart

    constructor() {
        this.question = new Question();
    }
}