import {
    Component,
    OnInit,
    trigger,
    state,
    style,
    transition,
    animate
} from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import { UUID } from 'angular2-uuid';

import { HomeService } from '../services/home.service';
import {Router} from "@angular/router";
import {PollroomCreationDTO} from "../models/pollroom-creation-dto";
import {Pollroom} from "../models/pollroom";

@Component({
    moduleId: module.id,
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    animations: [
        trigger('flyInOut', [
            state('in', style({opacity: 1, transform: 'translateX(0)'})),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(-100%)'
                }),
                animate('0.2s ease-in')
            ]),
            transition('* => void', [
                animate('0.2s 10 ease-out', style({
                    opacity: 0,
                    transform: 'translateX(100%)'
                }))
            ])
        ])
    ]
})
export class HomeComponent implements OnInit {

    public brandName = "Pollak";

    private nbRoomCreated = 0;
    private nbQuestionAsked = 0;
    private nbAnswer = 0;

    private pollroomsCreated: Pollroom[] = [];
    private pollroomsJoined: Pollroom[] = [];
    private selectedJoinedPoll;
    private selectedCreatedPoll;

    // forms
    private newPollForm: FormGroup;
    private pollName = new FormControl("", Validators.required);

    private joinPollForm: FormGroup;
    private pollRoomNumber = new FormControl("", Validators.required);

    constructor(private homeService: HomeService,
                private formBuilder: FormBuilder,
                private router: Router) { }

    ngOnInit() {
        if (localStorage.getItem("pollak_sessionid") === null) {
            let uuid = UUID.UUID();
            localStorage.setItem("pollak_sessionid", uuid);
        }

        this.getStats();

        this.getPollrooms();

        this.newPollForm = this.formBuilder.group({
            pollName: this.pollName
        });

        this.joinPollForm = this.formBuilder.group({
            pollRoomNumber: this.pollRoomNumber
        });
    }

    joinPollroom(pollroomIdentifier) {
        console.log("join pollroom " + pollroomIdentifier);
        if (pollroomIdentifier) {
            this.homeService.joinPollroom(pollroomIdentifier).then(
                pollroom => {
                    console.log("Pollroom '" + pollroom.identifier + "' joined");

                    // Navigate to pollroom
                    this.router.navigate(['/pollroom', pollroom.identifier]);
                },
                error => console.log(error)
            );
        } else {
            console.log("Blank pollroom identifier");
        }
    }

    joinJoinedPoll() {
        if (this.selectedJoinedPoll !== '-1') {
            this.joinPollroom(this.selectedJoinedPoll);
        }
    }

    joinCreatedPoll() {
        if (this.selectedCreatedPoll !== '-1') {
            this.joinPollroom(this.selectedCreatedPoll);
        }
    }

    createPollroom() {
        let pollroomName = this.pollName.value.trim();
        if (pollroomName) {
            let pollroomCreationDTO = new PollroomCreationDTO(pollroomName);
            console.log(pollroomCreationDTO);
            this.homeService.createPollroom(pollroomCreationDTO).then(
                pollroom => {
                    console.log("Pollroom '" + pollroom.identifier + "'created");

                    // Navigate to pollroom
                    console.log("before navigate to pollroom/identifier");
                    this.router.navigate(['/pollroom', pollroom.identifier]).then(
                        res => {
                            console.log("res");
                            console.log(res);},
                        error => {
                            console.log("error");
                            console.log(error);
                        }
                    );
                    console.log("after navigate to pollroom/identifier");
                },
                error => console.log(error, "Error")
            );
        } else {
            console.log("Blank pollroom name");
        }
    }

    getPollrooms() {
        if (localStorage.getItem("pollak_sessionid") !== null) {
            this.homeService.getPollrooms().then(
                pollrooms => {
                    this.pollroomsCreated = pollrooms.pollrooms_created;
                    this.pollroomsJoined = pollrooms.pollrooms_joined;
                },
                error => {
                    // bad x-session-id, generate a new session id
                    let uuid = UUID.UUID();
                    localStorage.setItem("pollak_sessionid", uuid);
                }
            );
        }
    }

    getStats() {
        this.homeService.getStats().then(
            stats => {
                this.nbRoomCreated = stats.nb_pollrooms;
                this.nbQuestionAsked = stats.nb_questions;
                this.nbAnswer = stats.nb_answers;
            },
            error => console.log(error)
        );
    }
}
