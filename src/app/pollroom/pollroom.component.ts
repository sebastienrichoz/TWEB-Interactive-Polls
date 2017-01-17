import {
    Component, OnInit, Input, NgZone,
    ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import {Question, Answer} from "../models/question";
import {Subscription} from "rxjs";
import {HomeService} from "../services/home.service";
import {Pollroom} from "../models/pollroom";
import {Router, ActivatedRoute} from "@angular/router";
import * as io from "socket.io-client";

@Component({
    selector: 'app-pollroom',
    templateUrl: './pollroom.component.html',
    styleUrls: ['./pollroom.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PollroomComponent implements OnInit {

    private nbAnswers: number;
    private nbTotalAnswers: number;
    private pollroom: Pollroom = new Pollroom();
    private editingQuestion: Question;
    private socket: any = undefined;

    private subscription = new Subscription();


    constructor(private homeService: HomeService,
                private router: Router) {

        let r11 = new Answer(1, 'A framework');
        let r12 = new Answer(2, 'A node package');
        let r13 = new Answer(3, 'A language');
        let q1 = new Question(1, "What's Angular2 ?", r11, r12, r13);

        let r21 = new Answer(4, 'Amazing!');
        let r22 = new Answer(5, 'Hard to learn');
        let r24 = new Answer(7, 'Never tried that');
        let q2 = new Question(2, "How is Angular2 for you ?", r21, r22, r24);

        let r31 = new Answer(8, 'Angular1');
        let r32 = new Answer(9, 'Angular2');
        let r33 = new Answer(10, 'None of them !');
        let q3 = new Question(3, "Do you prefer Angular1 or Angular2 ?", r31, r32, r33);

        this.pollroom.questions.push(q1);
        this.pollroom.questions.push(q2);
        this.pollroom.questions.push(q3);

        this.nbAnswers = 0;
        this.nbTotalAnswers = 0;
    }

    ngOnInit() {
        if (localStorage.getItem("pollak_sessionid") === null)
            this.router.navigate(['./']);

        // Listen for pollroom join
        this.subscription = this.homeService.pollroomSelected$.subscribe(
            pollroom => {
                console.log(pollroom);
                this.pollroom = pollroom;
                this.nbTotalAnswers = this.pollroom.questions.length;

                this.socket = io("http://localhost:3001/");
                this.socket.emit('connection');

                this.socket.on('hello', (data) => {
                    console.log(data);
                    this.socket.emit('join', { room: pollroom.identifier });
                });

            },
            error => console.log(error)
        );
    }

    leavePollroom() {
        console.log("leave pollroom");
        this.socket.disconnect();
    }

    answerGiven(question: Question, answer: Answer) {
        // TODO : socket.io
        console.log(question.title + " " + answer.label);
    }

    onQuestionPublished(question: Question) {
        this.pollroom.questions.unshift(question);
    }

    editQuestion(question: Question) {
        for (let q of this.pollroom.questions)
            if (q.id !== question.id && q.status === 'pending')
                q.status = 'opened';

        this.editingQuestion = question;
    }

    updateQuestion(question: Question) {
        for (let q of this.pollroom.questions)
            if (question.id === q.id)
                q = question;
    }

    cancelEditing(question: Question) {
        for (let q of this.pollroom.questions)
            if (question.id === q.id)
                q.status = 'open';
    }
}
