export class Answer {
    label: string;

    constructor() {
        this.label = '';
    }
}

export class Question {
    label: string;
    answers: Answer[] = new Array(2);

    constructor() {
        this.label = '';
        this.answers.fill(new Answer(), 0, 2);
    }

    addAnswer(answer: Answer) {
        this.answers.push(answer);
    }

    removeAnswer(answer: Answer) {
        let index = this.answers.indexOf(answer, 0);
        if (index > -1)
            this.answers.splice(index, 1);
    }
}