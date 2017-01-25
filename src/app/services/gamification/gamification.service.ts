import { Injectable } from '@angular/core';
import {Http} from "@angular/http";

import {UtilityService} from "../utility-service";
import {User} from "../../models/gamification/user";
import {Level} from "../../models/gamification/level";
import {Badge, Eventtype} from "../../models/gamification/badge";

@Injectable()
export class GamificationService {

    constructor(private http: Http, private utility: UtilityService) { }

    getUser(): Promise<User> {
        return this.http.get('/api/v1/gamification/user/')
            .toPromise()
            .then(this.utility.extractData)
            .catch(this.utility.handleError);
    }

    getLevels(): Promise<Level[]> {
        return this.http.get('/api/v1/gamification/levels/')
            .toPromise()
            .then(this.utility.extractData)
            .catch(this.utility.handleError);
    }

    getLeaderboard(): Promise<any> {
        return this.http.get('/api/v1/gamification/leaderboards/')
            .toPromise()
            .then(this.utility.extractData)
            .catch(this.utility.handleError);
    }

    getBadges(): Promise<Badge[]> {
        return this.http.get('/api/v1/gamification/badges/')
            .toPromise()
            .then(this.utility.extractData)
            .catch(this.utility.handleError);
    }

    getEventtypes(): Promise<Eventtype[]> {
        return this.http.get('/api/v1/gamification/eventtypes/')
            .toPromise()
            .then(this.utility.extractData)
            .catch(this.utility.handleError);
    }

}
