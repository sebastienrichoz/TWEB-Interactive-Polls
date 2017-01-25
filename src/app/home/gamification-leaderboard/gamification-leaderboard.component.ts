import { Component, OnInit } from '@angular/core';
import {GamificationService} from "../../services/gamification/gamification.service";
import {User} from "../../models/gamification/user";

@Component({
    selector: 'gamification-leaderboard',
    templateUrl: 'gamification-leaderboard.component.html',
    styleUrls: ['gamification-leaderboard.component.css']
})
export class GamificationLeaderboardComponent implements OnInit {

    leaderboard: User[] = [];
    user: User = new User;
    rank: number = 1;

    constructor(private gamificationService: GamificationService) { }

    ngOnInit() {
    }

    setUser(user) {
        this.user = user;

        this.gamificationService.getLeaderboard().then(
            leaderboard => {
                leaderboard.map(
                    user => {
                        this.leaderboard.push(user);
                        if (user.user_id === this.user.user_id)
                            this.rank = this.leaderboard.length;
                    });
            },
            err => console.log(err)
        )
    }

}
