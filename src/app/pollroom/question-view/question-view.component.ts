import {
    Component, OnInit, Input, Output, EventEmitter,
    OnChanges, trigger, state, style, transition, animate
} from '@angular/core';
import {Question} from "../../models/question";
import {TimeAgoPipe} from "../../pipes/time-ago.pipe";
import {PollroomService} from "../../services/pollroom.service";
import {QuestionUpdateStatusDTO} from "../../models/question-update-status-dto";


@Component({
    moduleId: module.id,
    selector: 'question-view',
    templateUrl: 'question-view.component.html',
    styleUrls: ['question-view.component.css'],
    animations: [
        trigger('comeInOut', [
            state('in', style({opacity: 1, transform: 'translateX(0)'})),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(0) scale(0)'
                }),
                animate(200)
            ])
        ])
    ]
})
export class QuestionViewComponent implements OnInit, OnChanges {

    @Input() question: Question;
    @Input() nbParticipants: number;
    @Input() socket;
    @Input() pollroom;
    @Input() totalAllUsersAnswer;
    @Output() onChecked = new EventEmitter();
    @Output() onQuestionEdit = new EventEmitter();
    @Output() onQuestionEditForm = new EventEmitter();
    @Input() user;

    questionCreationDate: Date = new Date;
    questionIsClosed = false;
    displayCloseHint = false;
    displayOpenHint = false;
    isVoteUp = false;
    isVoteDown = false;
    isEditing = false;

    constructor(private pollroomService: PollroomService) { }

    ngOnInit() {

    }

    ngOnChanges() {
        console.log("QuestionViewComponent changes detected");
        let c = 'A';
        for (let answer of this.question.answers) {
            answer.letter = c;
            c = this.nextChar(c);
        }
        this.questionCreationDate = new Date(this.question.created_at);
        this.questionIsClosed = this.question.status === "closed";
    }

    check(e, questionId, answerId) {
        let newEvent = {_event: e, question_id: questionId, answer_id: answerId};
        console.log(newEvent);
        this.onChecked.emit(newEvent);

        if (e.target.checked)
            this.pollroomService.checkAnswer(answerId).then(
                res => {
                    // console.log(res);
                },
                error => console.log(error)
            );
        else
            this.pollroomService.uncheckAnswer(answerId).then(
                res => {
                    // console.log(res)
                },
                error => console.log(error)
            );
    }

    nextChar(c) {
        return String.fromCharCode(c.charCodeAt(0) + 1);
    }

    editQuestion() {
        let previousStatus = this.question.status;
        this.question.status = 'pending';
        let dto = new QuestionUpdateStatusDTO(this.question.id, this.question.status);
        this.pollroomService.patchQuestion(dto).then(
            res => {
                this.socket.emit('editingQuestion', {room: this.pollroom.identifier, question_id: this.question.id});
                this.onQuestionEdit.emit(this.question);
                this.onQuestionEditForm.emit(this.question);
            },
            error => this.question.status = previousStatus
        );
    }

    voteUp() {
        if (!this.isVoteUp) {
            this.pollroomService.voteUp(this.question.id).then(
                res => {
                    this.socket.emit('voteUp', { room: this.pollroom.identifier, question_id: this.question.id });
                    if (this.isVoteDown)
                        this.socket.emit('cancelVoteDown', { room: this.pollroom.identifier, question_id: this.question.id });
                    this.isVoteUp = true;
                    this.isVoteDown = false;
                },
                error => console.log(error)
            )
        }
    }

    getVoteUpStyle() {
        if (this.isVoteUp)
            return "#5cb85c";
        else
            return "#d0d0d0";
    }

    voteDown() {
        if (!this.isVoteDown) {
            this.pollroomService.voteDown(this.question.id).then(
                res => {
                    this.socket.emit('voteDown', { room: this.pollroom.identifier, question_id: this.question.id });
                    if (this.isVoteUp)
                        this.socket.emit('cancelVoteUp', { room: this.pollroom.identifier, question_id: this.question.id });
                    this.isVoteUp = false;
                    this.isVoteDown = true;
                },
                error => console.log(error)
            );
        }
    }

    getVoteDownStyle() {
        if (this.isVoteDown)
            return "#d9534f";
        else
            return "#d0d0d0";
    }

    openQuestion() {
        this.question.status = 'open';
        let dto = new QuestionUpdateStatusDTO(this.question.id, this.question.status);
        this.pollroomService.patchQuestion(dto).then(
            res => this.socket.emit('openQuestion', { room: this.pollroom.identifier, question_id: this.question.id }),
            error => console.log(error)
        );
        this.questionIsClosed = false;
        this.displayOpenHint = false;
    }

    closeQuestion() {
        let previousStatus = this.question.status;
        this.question.status = 'closed';
        let dto = new QuestionUpdateStatusDTO(this.question.id, this.question.status);
        this.pollroomService.patchQuestion(dto).then(
            res => {
                this.socket.emit('closeQuestion', { room: this.pollroom.identifier, question_id: this.question.id });
                this.questionIsClosed = true;
                this.displayCloseHint = false;
            },
            error => this.question.status = previousStatus
        );
    }
}
