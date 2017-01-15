import {Component, OnInit, Output, Input} from '@angular/core';

@Component({
    selector: 'pollroom-stats',
    templateUrl: 'pollroom-stats.component.html',
    styleUrls: ['pollroom-stats.component.css']
})
export class PollroomStatsComponent implements OnInit {

    private questionsChecked: Map<number, number> = new Map();
    private nbAnswers: number;
    @Input() private nbTotalAnswers: number;

    constructor() { }

    ngOnInit() {
        this.nbAnswers = 0;
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
