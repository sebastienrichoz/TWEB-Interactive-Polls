import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {GamificationService} from "../../services/gamification/gamification.service";
import {User} from "../../models/gamification/user";
import {Level} from "../../models/gamification/level";
import {Badge} from "../../models/gamification/badge";

@Component({
    selector: 'gamification-user',
    templateUrl: './gamification-user.component.html',
    styleUrls: ['./gamification-user.component.css']
})
export class GamificationUserComponent implements OnInit {

    private user: User = new User;
    nextLevel: Level = new Level();
    @Output() emitUser: EventEmitter<User> = new EventEmitter<User>();
    badges: Badge[] = [];

    constructor(private gamificationService: GamificationService) { }

    ngOnInit() {
        this.gamificationService.getUser().then(
            user => {
                this.user = user;
                this.emitUser.emit(this.user);
                this.gamificationService.getLevels().then(
                    levels => this.defineNextLevel(levels),
                    err => console.log(err)
                );

                this.setBadges();
            },
            err => console.log(err)
        );
    }

    defineNextLevel(levels: Level[]) {
        // Get max level
        let maxLevel: Level = new Level();
        maxLevel.points = 0;
        levels.map(level => {
            if (maxLevel.points < level.points)
                maxLevel = level;
        });

        this.nextLevel = maxLevel;
        let currentPoints: number;
        levels.map(level => {
            currentPoints = +level.points - +this.user.points;
            if (currentPoints >= 0 && currentPoints < this.nextLevel.points - this.user.level.points) {
                this.nextLevel = level;
            }
        });
    }

    setBadges() {
        // Get badges
        this.gamificationService.getBadges().then(
            badges => {
                this.badges = badges;

                this.gamificationService.getEventtypes().then(
                    eventtypes => {
                        // Associate user progression to badges
                        this.badges.forEach(badge => {
                           badge.achievements.forEach(a => {
                               a.user_count = 0;
                           })
                        });

                        for (let property in this.user.eventtypesIdAndCount) {

                            if (this.user.eventtypesIdAndCount.hasOwnProperty(property)) {
                                this.badges.map(badge => {
                                    let countAcquire = 0;

                                    for (let achievement of badge.achievements) {
                                        if (achievement.eventtype.id === +property) {
                                            achievement.user_count = this.user.eventtypesIdAndCount[property] > achievement.count ? achievement.count : this.user.eventtypesIdAndCount[property];

                                            if (achievement.user_count === achievement.count) {
                                                countAcquire++;
                                            }
                                        }
                                    }

                                    if (countAcquire === badge.achievements.length)
                                        badge.acquired = true;
                                });
                            }
                        }
                    },
                    err => console.log(err)
                );
            },
            err => console.log(err)
        );
    }

}
