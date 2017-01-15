import {
    Component, OnInit, Input, Output, EventEmitter,
    OnChanges
} from '@angular/core';
import {Question} from "../../models/question";

@Component({
    selector: 'question-view',
    templateUrl: 'question-view.component.html',
    styleUrls: ['question-view.component.css']
})
export class QuestionViewComponent implements OnInit, OnChanges {

    @Input() question: Question;
    @Output() onChecked = new EventEmitter();
    questionIsClosed = false;
    displayCloseHint = false;
    displayOpenHint = false;
    isVoteUp = false;
    isVoteDown = false;

    constructor() { }

    ngOnInit() {
    }

    ngOnChanges() {
        let c = 'A';
        for (let answer of this.question.answers) {
            answer.letter = c;
            c = this.nextChar(c);
        }
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
    }

    nextChar(c) {
        return String.fromCharCode(c.charCodeAt(0) + 1);
    }

    clickP() {
        console.log("clickeddd");
    }

    voteUp() {
        if (!this.isVoteUp) {
            this.isVoteUp = true;
            this.isVoteDown = false;
            console.log("vote up");
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
            this.isVoteUp = false;
            this.isVoteDown = true;
            console.log("vote down");
        }
    }

    getVoteDownStyle() {
        if (this.isVoteDown)
            return "#d9534f";
        else
            return "#d0d0d0";
    }

    openQuestion() {
        this.questionIsClosed = false;
        this.displayOpenHint = false;
    }

    closeQuestion() {
        this.questionIsClosed = true;
        this.displayCloseHint = false;
    }
}
