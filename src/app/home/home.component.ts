import {
    Component,
    OnInit,
    trigger,
    state,
    style,
    transition,
    animate,
    ViewContainerRef
} from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import {Overlay} from 'angular2-modal';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import { UUID } from 'angular2-uuid';
import * as io from "socket.io-client";

import { HomeService } from '../services/home.service';
import {ToastsManager} from "ng2-toastr";
import {Router} from "@angular/router";
import {PollroomCreationDTO} from "../models/pollroom-creation-dto";
import {Pollroom} from "../models/pollroom";

@Component({
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

    // TODO : get these 3 stats from DB
    private nbRoomCreated = 2031;
    private nbQuestionAsked = 56378;
    private nbAnswer = 212986;

    // forms
    private newPollForm: FormGroup;
    private pollName = new FormControl("", Validators.required);

    private joinPollForm: FormGroup;
    private pollRoomNumber = new FormControl("", Validators.required);

    constructor(private homeService: HomeService,
                public toastr: ToastsManager,
                private formBuilder: FormBuilder,
                overlay: Overlay,
                vcRef: ViewContainerRef,
                public modal: Modal,
                private router: Router) {
        overlay.defaultViewContainer = vcRef;
    }

    ngOnInit() {
        if (localStorage.getItem("pollak_sessionid") === null) {
            let uuid = UUID.UUID();
            localStorage.setItem("pollak_sessionid", uuid);
        }
        // this.getStats();
        this.newPollForm = this.formBuilder.group({
            pollName: this.pollName
        });

        this.joinPollForm = this.formBuilder.group({
            pollRoomNumber: this.pollRoomNumber
        });
    }

    joinPollroom() {
        let pollroomId = this.pollRoomNumber.value.trim();

        if (pollroomId) {
            this.homeService.joinPollroom(pollroomId).then(
                pollroom => {
                    let joinedPollroom: Pollroom = pollroom;
                    this.toastr.success("Pollroom '" + joinedPollroom.id + "' joined");

                    // Navigate to pollroom
                    this.router.navigate(['./pollroom']).then(
                        res => this.homeService.selectPollroom(joinedPollroom)
                    );
                },
                error => this.toastr.error(error)
            );
        } else {
            this.toastr.error("Blank pollroom number");
        }
    }

    createPollroom() {
        let pollroomName = this.pollName.value.trim();
        if (pollroomName) {
            let pollroomCreationDTO = new PollroomCreationDTO(pollroomName);
            console.log(pollroomCreationDTO);
            this.homeService.createPollroom(pollroomCreationDTO).then(
                pollroom => {
                    let currentPollroom: Pollroom = pollroom;
                    this.toastr.success("Pollroom '" + currentPollroom.id + "'created");

                    // Navigate to pollroom
                    this.router.navigate(['./pollroom']).then(
                        res => this.homeService.selectPollroom(currentPollroom)
                    );
                },
                error => this.toastr.error(error, "Error")
            );
        } else {
            this.toastr.error("Blank pollroom name");
        }
    }

    // getStats() {
    //     this.homeService.getStats().subscribe(
    //         data => this.cats = data,
    //         error => console.log(error),
    //         () => this.isLoading = false
    //     );
    // }

    openPollroomModal() {
        this.modal.alert()
            .size('lg')
            .showClose(true)
            .body(require('./home.modal-pollroom.html'))
            .open();
    }

    openQuestionsModal() {
        this.modal.alert()
            .size('lg')
            .showClose(true)
            .body(require('./home.modal-questions.html'))
            .open();
    }

    openAnswersModal() {
        this.modal.alert()
            .size('lg')
            .showClose(true)
            .body(require('./home.modal-answers.html'))
            .open();
    }

    openStatisticsModal() {
        this.modal.alert()
            .size('lg')
            .showClose(true)
            .body(require('./home.modal-statistics.html'))
            .open();
    }
}
