export class QuestionCreationDTO {
    pollroom: string;
    title: string;
    answers: string[] = [];

    constructor(pollroom: string, title: string, answers: string[]) {
        this.pollroom = pollroom;
        this.title = title;
        this.answers = answers;
    }
}