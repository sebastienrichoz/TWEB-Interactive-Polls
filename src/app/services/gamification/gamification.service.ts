import { Injectable } from '@angular/core';
import {Http} from "@angular/http";

import {UtilityService} from "../utility-service";
import {User} from "../../models/gamification/user";
import {Level} from "../../models/gamification/level";

@Injectable()
export class GamificationService {

    constructor(private http: Http, private utility: UtilityService) { }

    // getUser(user_id: string): Promise<User> {
    //
    // }
    //
    // getLevel(level_id: number): Promise<Level> {
    //
    // }
    //
    // getLeaderboard(): Promise<User[]> {
    //
    // }

}
