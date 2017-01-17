import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule, XSRFStrategy, Request} from '@angular/http';
import { RouterModule } from '@angular/router';

// External libraries
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { UUID } from 'angular2-uuid';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { PollroomComponent } from './pollroom/pollroom.component';
import { QuestionCreatorComponent } from './pollroom/question-creator/question-creator.component';
import { QuestionViewComponent } from './pollroom/question-view/question-view.component';

// Services
import {HomeService} from "./services/home.service";
import {PollroomService} from "./services/pollroom.service";


// Pipes
import { ThousandSeparatorPipe } from './pipes/thousand-separator.pipe';
import { PollroomStatsComponent } from './pollroom/pollroom-stats/pollroom-stats.component';
import { ResponseViewComponent } from './pollroom/question-view/response-view/response-view.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import {UtilityService} from "./services/utility-service";
import { NegativeSignPipe } from './pipes/negative-sign.pipe';


export class MyXSRFStrategy {
    configureRequest(req: Request) {
        if (!req.headers.has('X-Session-ID'))
            req.headers.append('X-Session-ID', localStorage.getItem("pollak_sessionid"));
    }
}

// roots
const routing = RouterModule.forRoot([
    { path: '',      component: HomeComponent },
    { path: 'pollroom', component: PollroomComponent }
]);

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AboutComponent,
        ThousandSeparatorPipe,
        PollroomComponent,
        QuestionCreatorComponent,
        QuestionViewComponent,
        PollroomStatsComponent,
        ResponseViewComponent,
        TimeAgoPipe,
        NegativeSignPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        ModalModule.forRoot(),
        BootstrapModalModule,
        ToastModule,
        routing
    ],
    providers: [
        HomeService,
        UtilityService,
        PollroomService,
        { provide: XSRFStrategy, useFactory: () => new MyXSRFStrategy() }
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
