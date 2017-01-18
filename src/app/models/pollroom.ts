import {Question} from "./question";
export class Pollroom {
    id: number;
    name: string;
    identifier: string;
    status: string;
    questions: Question[] = [];
    nb_participants: number;
    creator: string;
    created_at: string;

    constructor() {
        this.id = 0;
        this.name = "No name";
        this.status = "open";
        this.nb_participants = 0;
        this.creator = "";
        this.identifier = "No identifier";
        this.created_at = "";
    }
}