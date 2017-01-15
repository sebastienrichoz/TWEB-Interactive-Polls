export class QuestionCreationDTO {
    title: string;
    answers: string[] = [];

    constructor(title: string, answers: string[]) {
        this.title = title;
        this.answers = answers;
    }
}