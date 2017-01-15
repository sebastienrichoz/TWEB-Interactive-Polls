export class Answer {
    id: number;
    label: string;
    is_answered: boolean;
    nb_responses: number;
    letter: string;

    constructor(id: number, label: string) {
        this.id = id;
        this.label = label;
        this.is_answered = false;
        this.nb_responses = 0;
        this.letter = 'A';
    }
}

export class Question {
    id: number;
    title: string;
    answers: Answer[] = [];
    nb_positive_votes: number;
    nb_negative_votes: number;
    nb_responses: number;
    status: string;
    created_at: string;

    constructor(id: number, title: string, ...answers: Answer[]) {
        this.id = id;
        this.title = title;
        // Important : push 2 times. DON'T DO THIS : fill(new Answer(), 0, 2)
        // because when user delete first answer, it will delete the second one
        answers.forEach(a => this.answers.push(a));
        this.nb_positive_votes = 0;
        this.nb_negative_votes = 0;
        this.nb_responses = 0;
        this.created_at = (new Date()).toISOString();
        this.status = 'open';
    }

    addAnswer(answer: Answer) {
        this.answers.push(answer);
    }

    removeAnswer(answer: Answer) {
        let index = this.answers.indexOf(answer, 0);
        if (index > -1)
            this.answers.splice(index, 1);
    }

    clone(q: Question) {
        this.id = q.id;
        this.title = q.title;
        this.answers = [];
        q.answers.forEach(ans => {
            let a = new Answer(ans.id, ans.label);
            a.is_answered = ans.is_answered;
            a.nb_responses = ans.nb_responses;
            a.letter = ans.letter;
            this.answers.push(a);
        });
        this.nb_responses = q.nb_responses;
        this.nb_positive_votes = q.nb_positive_votes;
        this.nb_negative_votes = q.nb_negative_votes;
        this.status = q.status;
        this.created_at = q.created_at;
    }
}