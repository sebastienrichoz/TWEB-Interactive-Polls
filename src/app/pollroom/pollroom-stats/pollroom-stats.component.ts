import {Component, OnInit, Output, Input} from '@angular/core';
import {Pollroom} from "../../models/pollroom";
import {PollroomService} from "../../services/pollroom.service";
import {HomeService} from "../../services/home.service";
import {ToastsManager} from "ng2-toastr";

@Component({
    selector: 'pollroom-stats',
    templateUrl: 'pollroom-stats.component.html',
    styleUrls: ['pollroom-stats.component.css']
})
export class PollroomStatsComponent implements OnInit {

    private questionsChecked: Map<number, number> = new Map();
    private nbAnswers: number;
    private pollroomTotalAnswers: number;
    displayCloseRoomInfo = false;
    displayOpenRoomInfo = false;
    @Input() private nbTotalAnswers: number;
    @Input() private pollroom: Pollroom;
    @Input() socket;

    constructor(private pollroomService: PollroomService,
                private homeService: HomeService,
                public toastr: ToastsManager) { }

    ngOnInit() {
        this.nbAnswers = 0;
        this.pollroomTotalAnswers = 0;
    }

    ngOnChanges() {
        console.log("pollroom changes detected in PollroomStatsComponent");

        for (let question of this.pollroom.questions)
            this.pollroomTotalAnswers += question.nb_responses;
    }

    patchRoom(status: string) {
        this.pollroomService.patchRoom(this.pollroom.id, status).then(
            pollroom => {
                this.socket.emit('closePollroom', { room: this.pollroom.identifier, pollroom_id: this.pollroom.id });
                this.displayCloseRoomInfo = status !== "closed";
                this.displayOpenRoomInfo = !this.displayCloseRoomInfo;
                this.homeService.selectPollroom(pollroom);
                this.toastr.success("pollroom " + pollroom.status);
            },
            error => this.toastr.error(error, "Error")
        );
    }

    onChecked(event) {
        console.log(event);
        let e = event._event;
        let questionId = event.question_id;
        let answerId = event.answer_id;
        console.log("question id: " + questionId + ", answer id: " + answerId);
        let nbAnswers = this.questionsChecked.get(questionId);
        if(e.target.checked) {
            if (nbAnswers === undefined || nbAnswers === 0) {
                this.nbAnswers++;
                this.questionsChecked.set(questionId, 1);
            } else {
                this.questionsChecked.set(questionId, nbAnswers + 1);
            }
        } else {
            if (nbAnswers === 1) {
                this.questionsChecked.set(questionId, 0);
                this.nbAnswers--;
            } else {
                this.questionsChecked.set(questionId, nbAnswers - 1);
            }
        }
    }

}
