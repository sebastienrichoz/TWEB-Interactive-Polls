export class Answer {
    id: number;
    label: string;
    letter: string;

    constructor(id: number, label: string) {
        this.id = id;
        this.label = label;
    }
}

export class Question {
    id: number;
    label: string;
    answers: Answer[] = [];

    constructor(id: number, label: string, ...answers: Answer[]) {
        this.id = id;
        this.label = label;
        // Important : push 2 times. DON'T DO THIS : fill(new Answer(), 0, 2)
        // because when user delete first answer, it will delete the second one
        answers.forEach(a => this.answers.push(a));
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