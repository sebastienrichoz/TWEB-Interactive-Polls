import {
    Component, OnInit, ChangeDetectionStrategy, OnDestroy
} from '@angular/core';
import {Question, Answer} from "../models/question";
import {HomeService} from "../services/home.service";
import {Pollroom} from "../models/pollroom";
import {ActivatedRoute, Params, Router} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import * as io from "socket.io-client";


@Component({
    moduleId: module.id,
    selector: 'app-pollroom',
    templateUrl: './pollroom.component.html',
    styleUrls: ['./pollroom.component.css']
})
export class PollroomComponent implements OnInit, OnDestroy {

    private nbAnswers: number;
    private pollroom: Pollroom = new Pollroom;
    private editingQuestion: Question;
    private socket: any = undefined;
    private user: any;

    // private subscription = new Subscription();

    constructor(private homeService: HomeService,
                private router: Router,
                private route: ActivatedRoute) {
        /*
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
        */
        this.socket = io("http://localhost:3001/");

        this.manageSocket();

        this.nbAnswers = 0;
    }


    ngOnInit() {
        if (localStorage.getItem("pollak_sessionid") === null)
            this.router.navigate(['./']);

        this.route.params
            .switchMap((params: Params) => this.homeService.getPollroom(params['identifier']))
            .subscribe(pollroom => {
                this.pollroom = pollroom;

                console.log(pollroom);

                this.user = localStorage.getItem("pollak_sessionid");

                this.socket.emit('connection');
                this.socket.on('hello', () => {
                    this.socket.emit('join', { room: this.pollroom.identifier });
                });

                this.nbAnswers = 0;
                this.pollroom.questions.forEach(q => this.nbAnswers += q.nb_participants);
            },
            error => console.log(error));
    }

    manageSocket() {

        this.socket.on('participantArrived', () => {
            this.pollroom.nb_participants++;
        });

        this.socket.on('participantLeft', () => {
            this.pollroom.nb_participants--;
        });

        this.socket.on('newQuestion', (data) => {
            this.pollroom.questions.push(data.question);
            console.log(this.pollroom);
        });

        this.socket.on('editingQuestion', (data) => {

            console.log("editingQuestion");
            console.log(data);
            for (let q of this.pollroom.questions)
                if (q.id === data.question_id) {
                    q.status = 'pending';
                    break;
                }
        });

        this.socket.on('updateQuestion', (data) => {
            console.log("updateQuestion");
            console.log(data);
            for (let q of this.pollroom.questions)
                if (q.id === data.question.id) {
                    q.clone(data.question);
                    break;
                }
        });

        this.socket.on('abortEditingQuestion', (data) => {
            console.log("abortEditingQuestion");
            console.log(data);
            for (let q of this.pollroom.questions)
                if (q.id === data.question_id) {
                    q.status = 'open';
                    break;
                }
        });

        this.socket.on('closeQuestion', (data) => {
            console.log("closeQuestion");
            console.log(data);
            for (let q of this.pollroom.questions)
                if (q.id === data.question_id) {
                    q.status = 'closed';
                    break;
                }
        });

        this.socket.on('voteUp', (data) => {
            for (let q of this.pollroom.questions)
                if (q.id === data.question_id) {
                    q.nb_positives_votes++;
                    break;
                }
        });

        this.socket.on('cancelVoteUp', (data) => {
            for (let q of this.pollroom.questions)
                if (q.id === data.question_id) {
                    q.nb_positives_votes--;
                    break;
                }
        });

        this.socket.on('voteDown', (data) => {
            console.log("voteDown");
            console.log(data);
            for (let q of this.pollroom.questions)
                if (q.id === data.question_id) {
                    q.nb_negatives_votes++;
                    break;
                }
        });

        this.socket.on('cancelVoteDown', (data) => {
            for (let q of this.pollroom.questions)
                if (q.id === data.question_id) {
                    q.nb_negatives_votes--;
                    break;
                }
        });

        this.socket.on('answerChecked', (data) => {
            this.nbAnswers++;
            let leave = false;
            for (let q of this.pollroom.questions) {
                for (let a of q.answers) {
                    if (a.id === data.answer_id) {
                        a.nb_responses++;
                        q.nb_participants++;
                        leave = true;
                        break;
                    }
                }
                if (leave) break;
            }
        });

        this.socket.on('answerUnchecked', (data) => {
            this.nbAnswers--;
            let leave = false;
            for (let q of this.pollroom.questions) {
                for (let a of q.answers) {
                    if (a.id === data.answer_id) {
                        a.nb_responses++;
                        q.nb_participants--;
                        leave = true;
                        break;
                    }
                }
                if (leave) break;
            }
        });

        this.socket.on('closePollroom', () => {
            console.log("closePollroom");
            this.pollroom.status = 'closed';
            this.pollroom.questions.forEach(q => q.status = 'closed');
        });
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
            if (q.status === 'pending' && q.id !== question.id) {
                q.status = 'open';
                this.socket.emit('updateQuestion', {room: this.pollroom.identifier, question: q});
                break;
            }

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

    ngOnDestroy() {
        console.log("destroy");
        this.socket.emit('bye', {room: this.pollroom.identifier});
        this.socket.disconnect();
    }
}
