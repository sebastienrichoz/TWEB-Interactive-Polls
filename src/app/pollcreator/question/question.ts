export class Answer {
    label: string;

    constructor() {
        this.label = '';
    }
}

export class Question {
    label: string;
    answers: Answer[] = [];

    constructor() {
        this.label = '';
        // Important : push 2 times. DON'T DO THIS : fill(new Answer(), 0, 2)
        // because when user delete first answer, it will delete the second one
        this.answers.push(new Answer());
        this.answers.push(new Answer());
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