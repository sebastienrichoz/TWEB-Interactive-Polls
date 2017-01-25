export class Eventtype {
    id: number;
    name: string;
    points: number;
    constructor() {
        this.id = 0;
        this.name = "";
        this.points = 0;
    }
}

export class Achievement {
    count: number;
    user_count: number;
    eventtype: Eventtype;
    id: number;
    name: string;
    constructor() {
        this.count = 0;
        this.eventtype = new Eventtype;
        this.id = 0;
        this.name = "";
        this.user_count = 0;
    }
}

export class Badge {

    achievements: Achievement[];
    description: string;
    id: number;
    name: string;
    acquired: boolean;

    constructor() {
        this.achievements = [];
        this.description = "";
        this.id = 0;
        this.name = "";
        this.acquired = false;
    }
}