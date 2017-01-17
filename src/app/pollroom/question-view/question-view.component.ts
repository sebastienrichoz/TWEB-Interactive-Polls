import {
    Component, OnInit, Input, Output, EventEmitter,
    OnChanges, trigger, state, style, transition, animate
} from '@angular/core';
import {Question} from "../../models/question";
import {TimeAgoPipe} from "../../pipes/time-ago.pipe";
import {PollroomService} from "../../services/pollroom.service";
import {ToastsManager} from "ng2-toastr";

@Component({
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
    @Input() pollroomIdentifier;
    @Output() onChecked = new EventEmitter();
    @Output() onQuestionEdit = new EventEmitter();
    @Output() onQuestionEditForm = new EventEmitter();


    questionCreationDate: Date = new Date;
    questionIsClosed = false;
    displayCloseHint = false;
    displayOpenHint = false;
    isVoteUp = false;
    isVoteDown = false;
    isEditing = false;

    constructor(private pollroomService: PollroomService,
                public toastr: ToastsManager) { }

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

    answerGiven(question, answer) {
        console.log("answerGiven()");
        console.log(question);
        console.log(answer);
    }

    check(e, questionId, answerId) {
        let newEvent = {_event: e, question_id: questionId, answer_id: answerId};
        console.log(newEvent);
        this.onChecked.emit(newEvent);

        if (e.target.checked)
            this.pollroomService.checkAnswer(answerId).then(
                res => {
                    this.socket.emit('answerChecked', {room: this.pollroomIdentifier, answer_id: answerId});
                    // console.log(res);
                },
                error => this.toastr.error(error)
            );
        else
            this.pollroomService.uncheckAnswer(answerId).then(
                res => {
                    this.socket.emit('answerUnchecked', {room: this.pollroomIdentifier, answer_id: answerId});
                    // console.log(res)
                },
                error => this.toastr.error(error)
            );
    }

    nextChar(c) {
        return String.fromCharCode(c.charCodeAt(0) + 1);
    }

    clickP() {
        console.log("clickeddd");
    }

    editQuestion(question: Question) {
        if (this.question.status === 'closed')
            this.toastr.warning("You are editing a closed question", "Be careful");

        this.question.status = 'pending';
        this.onQuestionEdit.emit(question);
        this.onQuestionEditForm.emit(question);
    }

    voteUp() {
        if (!this.isVoteUp) {
            this.socket.emit('voteUp', { room: this.pollroomIdentifier, question_id: this.question.id });
            this.isVoteUp = true;
            this.isVoteDown = false;
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
            this.socket.emit('voteDown', { room: this.pollroomIdentifier, question_id: this.question.id });
            this.isVoteUp = false;
            this.isVoteDown = true;
        }
    }

    getVoteDownStyle() {
        if (this.isVoteDown)
            return "#d9534f";
        else
            return "#d0d0d0";
    }

    openQuestion() {
        this.socket.emit('openQuestion', { room: this.pollroomIdentifier, question_id: this.question.id });
        this.question.status = 'open';
        this.questionIsClosed = false;
        this.displayOpenHint = false;
    }

    closeQuestion() {
        this.socket.emit('closeQuestion', { room: this.pollroomIdentifier, question_id: this.question.id });
        this.question.status = 'closed';
        this.questionIsClosed = true;
        this.displayCloseHint = false;
    }
}
