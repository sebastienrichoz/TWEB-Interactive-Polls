import {
    Component,
    OnInit,
    trigger,
    state,
    style,
    transition,
    animate,
    ViewContainerRef
} from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import {Overlay} from 'angular2-modal';
import {Modal} from 'angular2-modal/plugins/bootstrap';

import { HomeService } from '../services/home.service';
import {ToastsManager} from "ng2-toastr";
import {Router} from "@angular/router";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
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
        ])
    ]
})
export class HomeComponent implements OnInit {

    public brandName = "Pollak";

    // TODO : get these 3 stats from DB
    private nbRoomCreated = 2031;
    private nbQuestionAsked = 56378;
    private nbAnswer = 212986;

    private visibleRegisterForm = false;
    private visibleLoginForm = false;

    private cats = [];
    private isLoading = true;

    private cat = {};
    private isEditing = false;

    private registerForm: FormGroup;
    private registerName = new FormControl("", Validators.required);
    private registerPass = new FormControl("", Validators.required);
    private registerConfirmedPass = new FormControl("", Validators.required);

    private loginForm: FormGroup;
    private loginName = new FormControl("", Validators.required);
    private loginPass = new FormControl("", Validators.required);

    constructor(private homeService: HomeService,
                public toastr: ToastsManager,
                private formBuilder: FormBuilder,
                overlay: Overlay,
                vcRef: ViewContainerRef,
                public modal: Modal,
                private router: Router) {
        overlay.defaultViewContainer = vcRef;
    }

    ngOnInit() {
        // this.getStats();

        this.registerForm = this.formBuilder.group({
            registerName: this.registerName,
            registerPass: this.registerPass,
            registerConfirmedPass: this.registerConfirmedPass
        });

        this.loginForm = this.formBuilder.group({
            loginName: this.loginName,
            loginPass: this.loginPass
        });
    }

    openRegisterForm() {
        this.visibleRegisterForm = !this.visibleRegisterForm;
        this.visibleLoginForm = false;
        this.registerForm.reset();
    }

    openLoginForm() {
        this.visibleLoginForm = !this.visibleLoginForm;
        this.visibleRegisterForm = false;
        this.loginForm.reset();
    }

    // getStats() {
    //     this.homeService.getStats().subscribe(
    //         data => this.cats = data,
    //         error => console.log(error),
    //         () => this.isLoading = false
    //     );
    // }

    register() {
        console.log("register " + this.registerName.value + " " + this.registerPass.value + " " + this.registerConfirmedPass.value);

        if (this.registerPass.value !== this.registerConfirmedPass.value) {
            this.toastr.error("Passwords don't match", "Register failed");

            this.registerPass.reset();
            this.registerConfirmedPass.reset();
        } else {
            this.toastr.success("Please login now", "Register succeed");
            this.homeService.register(this.registerForm.value).subscribe(
                res => {
                    var newUser = res.json();
                    this.visibleRegisterForm = false;
                    this.visibleLoginForm = true;
                    this.toastr.success("Please login now", "Register succeed");
                },
                error => console.log(error)
            );
        }
    }

    login() {
        console.log("login " + this.loginName.value + " " + this.loginPass.value);
        this.toastr.success("Redirecting to dashboard", "Login succeed");
        // TODO : for preview only
        this.router.navigate(['./dashboard']);

        this.homeService.register(this.registerForm.value).subscribe(
            res => {
                var newUser = res.json();
                this.visibleRegisterForm = false;
                this.visibleLoginForm = true;
                this.toastr.success("Redirecting to dashboard", "Login succeed");
            },
            error => console.log(error)
        );
    }

    openPollroomModal() {
        this.modal.alert()
            .size('lg')
            .showClose(true)
            .body(require('./home.modal-pollroom.html'))
            .open();
    }

    openQuestionsModal() {
        this.modal.alert()
            .size('lg')
            .showClose(true)
            .body(require('./home.modal-questions.html'))
            .open();
    }

    openAnswersModal() {
        this.modal.alert()
            .size('lg')
            .showClose(true)
            .body(require('./home.modal-answers.html'))
            .open();
    }

    openStatisticsModal() {
        this.modal.alert()
            .size('lg')
            .showClose(true)
            .body(require('./home.modal-statistics.html'))
            .open();
    }

    /*
    addCat() {
        this.dataService.addCat(this.addCatForm.value).subscribe(
            res => {
                var newCat = res.json();
                this.cats.push(newCat);
                this.addCatForm.reset();
                this.toast.setMessage("item added successfully.", "success");
            },
            error => console.log(error)
        );
    }
    */

    enableEditing(cat) {
        this.isEditing = true;
        this.cat = cat;
    }

    cancelEditing() {
        this.isEditing = false;
        this.cat = {};
        // this.toast.setMessage("item editing cancelled.", "warning");
        // reload the cats to reset the editing
        //this.getCats();
    }

    editCat(cat) {
        this.homeService.editCat(cat).subscribe(
            res => {
                this.isEditing = false;
                this.cat = cat;
                // this.toast.setMessage("item edited successfully.", "success");
            },
            error => console.log(error)
        );
    }

    deleteCat(cat) {
        if(window.confirm("Are you sure you want to permanently delete this item?")) {
            this.homeService.deleteCat(cat).subscribe(
                res => {
                    var pos = this.cats.map(cat => { return cat._id }).indexOf(cat._id);
                    this.cats.splice(pos, 1);
                    // this.toast.setMessage("item deleted successfully.", "success");
                },
                error => console.log(error)
            );
        }
    }

}
