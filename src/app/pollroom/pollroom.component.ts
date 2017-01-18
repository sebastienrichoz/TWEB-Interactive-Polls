import {
    Component, OnInit, ChangeDetectionStrategy, OnDestroy
} from '@angular/core';
import {Question, Answer} from "../models/question";
import {HomeService} from "../services/home.service";
import {Pollroom} from "../models/pollroom";
import {ActivatedRoute, Params, Router} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import * as io from "socket.io-client";
import { environment } from '../../environments/environment';

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

        this.socket = io(environment.SOCKETIO_URL);

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
                    q.id = data.question.id;
                    q.title = data.question.title;
                    q.answers = [];
                    data.question.answers.forEach(ans => {
                        let a = new Answer(ans.id, ans.label);
                        a.is_answered = ans.is_answered;
                        a.nb_responses = ans.nb_responses;
                        a.letter = ans.letter;
                        q.answers.push(a);
                    });
                    q.nb_participants = data.question.nb_participants;
                    q.nb_positives_votes = data.question.nb_positives_votes;
                    q.nb_negatives_votes = data.question.nb_negatives_votes;
                    q.status = 'open';
                    q.created_at = data.question.created_at;

                    let c = 'A';
                    for (let answer of q.answers) {
                        answer.letter = c;
                        c = this.nextChar(c);
                    }

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

    nextChar(c) {
        return String.fromCharCode(c.charCodeAt(0) + 1);
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
