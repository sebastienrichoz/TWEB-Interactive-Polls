import {Component, OnInit, Output, Input} from '@angular/core';
import {Pollroom} from "../../models/pollroom";
import {PollroomService} from "../../services/pollroom.service";
import {HomeService} from "../../services/home.service";
import {QuestionUpdateStatusDTO} from "../../models/question-update-status-dto";


@Component({
    moduleId: module.id,
    selector: 'pollroom-stats',
    templateUrl: 'pollroom-stats.component.html',
    styleUrls: ['pollroom-stats.component.css']
})
export class PollroomStatsComponent implements OnInit {

    private questionsChecked: Map<number, number> = new Map();
    private nbAnswers: number;
    displayCloseRoomInfo = false;
    @Input() private nbTotalAnswers: number;
    @Input() private pollroom: Pollroom;
    @Input() socket;
    @Input() totalAllUsersAnswer;
    @Input() user;

    constructor(private pollroomService: PollroomService,
                private homeService: HomeService) { }

    ngOnInit() {
        this.nbAnswers = 0;
    }

    ngOnChanges() {
        console.log("pollroom changes detected in PollroomStatsComponent");
    }

    patchRoom(status: string) {
        this.pollroomService.patchRoom(this.pollroom.id, {status: status}).then(
            pollroom => {
                this.socket.emit('closePollroom', { room: this.pollroom.identifier });

                // close all questions
                this.pollroom.questions.forEach(q => {
                    q.status = 'closed';
                    let dto = new QuestionUpdateStatusDTO(q.id, q.status);
                    this.pollroomService.patchQuestion(dto);
                });

                this.displayCloseRoomInfo = true;
                this.homeService.selectPollroom(pollroom);
                console.log("pollroom " + pollroom.status);
            },
            error => console.log(error, "Error")
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
                this.socket.emit('answerChecked', {room: this.pollroom.identifier, answer_id: answerId});
                this.questionsChecked.set(questionId, 1);
            } else {
                this.questionsChecked.set(questionId, nbAnswers + 1);
            }
        } else {
            if (nbAnswers === 1) {
                this.questionsChecked.set(questionId, 0);
                this.nbAnswers--;
                this.socket.emit('answerUnchecked', {room: this.pollroom.identifier, answer_id: answerId});
            } else {
                this.questionsChecked.set(questionId, nbAnswers - 1);
            }
        }
    }

}
