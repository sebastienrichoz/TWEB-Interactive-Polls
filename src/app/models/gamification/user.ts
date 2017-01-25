import {Level} from "./level";
import {Badge} from "./badge";

export class User {
    user_id: number;
    points: number;
    level: Level;
    badges: Badge[];
    eventtypesIdAndCount: any;

    constructor() {
        this.user_id = 0;
        this.points = 0;
        this.level = new Level();
        this.badges = [];
        this.eventtypesIdAndCount = "";
    }

    clone(user) {
        this.user_id = user.user_id;
        this.points = user.points;
        let level: Level = new Level;
        level.id = user.level.id;
        level.points = user.level.points;
        level.name = user.level.name;
        this.level = level;
        user.badges.map(b => this.badges.push(b));
    }
}