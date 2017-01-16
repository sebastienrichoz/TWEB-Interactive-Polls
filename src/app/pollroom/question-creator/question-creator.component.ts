import {
    Component, OnInit, style, animate, transition,
    state, trigger, Input, EventEmitter, Output
} from '@angular/core';

import { Question, Answer } from '../../models/question';
import {ToastsManager} from "ng2-toastr";
import {PollroomService} from "../../services/pollroom.service";
import {QuestionCreationDTO} from "../../models/question-creation-dto";

@Component({
    selector: 'question-creator',
    templateUrl: 'question-creator.component.html',
    styleUrls: ['question-creator.component.css'],
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
        ]),
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
export class QuestionCreatorComponent implements OnInit {

    @Input() question: Question;
    originalQuestion: Question; // in case of question editing
    @Output() onPublish = new EventEmitter<Question>();
    @Output() onUpdate = new EventEmitter<Question>();
    @Output() onUpdateCanceled = new EventEmitter();
    @Input() pollroomId;

    private published: boolean = false;
    private isFocus = false;
    private isEditing = false;

    private MIN_ANSWER = 2;
    private MAX_ANSWER = 10;

    constructor(public toastr: ToastsManager,
                private pollroomService: PollroomService) { }

    ngOnInit() {
        this.initQuestion();
    }

    // Publish the created question
    publish() {
        let verifications = this.questionVerifications();

        if (verifications.error_message) {
            this.toastr.error(verifications.error_message);
        } else {
            let questionCreationDTO = new QuestionCreationDTO(
                this.question.title.trim(), verifications.answers);
            this.pollroomService.addQuestion(this.pollroomId, questionCreationDTO).then(
                question => {
                    console.log("question published:");
                    console.log(question);
                    this.onPublish.emit(question);
                    this.toastr.success("Question published");
                    this.hideFullQuestion();
                    this.initQuestion();
                },
                error => this.toastr.error(error, "Error")
            );
        }
    }

    update() {
        let verifications = this.questionVerifications();

        if (verifications.error_message) {
            this.toastr.error(verifications.error_message);
        } else {
            let questionCreationDTO = new QuestionCreationDTO(
                this.question.title.trim(), verifications.answers);
            this.pollroomService.patchQuestion(questionCreationDTO).then(
                question => {
                    this.onUpdate.emit(question);
                    this.toastr.success("Question updated");
                    this.initQuestion();
                    this.hideFullQuestion();
                },
                error => this.toastr.error(error, "Error")
            );
        }
    }

    questionVerifications() {
        let errorMessage: string;

        let answers: string[] = [];
        for (let answer of this.question.answers)
            if (answer.label && answer.label.trim())
                answers.push(answer.label.trim());

        if (answers.length < 2)
            errorMessage = "Min. 2 answers required";

        if (!(this.question.title && this.question.title.trim()))
            errorMessage = "No title for your question";

        return {error_message: errorMessage, answers: answers};
    }

    editQuestion(question: Question) {
        this.originalQuestion = question;
        this.question.clone(question);
        this.displayFullQuestion();
    }

    addAnswer() {
        let size = this.question.answers.length;

        if (size < this.MAX_ANSWER)
            this.question.addAnswer(new Answer(size+1, ''));
        else
            this.toastr.error("Max. " + this.MAX_ANSWER + " answers");
    }

    removeAnswer(answer: Answer) {
        if (this.question.answers.length > 2)
            this.question.removeAnswer(answer);
        else
            this.toastr.error("Min. " + this.MIN_ANSWER + " answers");
    }

    displayFullQuestion() {
        this.isFocus = true;
    }

    hideFullQuestion() {
        this.isFocus = false;
    }

    displayOrHideFullQuestion() {
        this.isFocus = !this.isFocus;
        if (this.question.status === 'pending') {
            this.originalQuestion.status = 'open';
            this.onUpdateCanceled.emit(this.originalQuestion);
            this.initQuestion();
        }
    }

    initQuestion() {
        this.question = new Question(-1, '');
        this.question.addAnswer(new Answer(-1, ''));
        this.question.addAnswer(new Answer(-1, ''));
    }
}
