import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, XSRFStrategy, Request } from '@angular/http';

// External libraries
import { ToastModule } from 'ng2-toastr/ng2-toastr';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
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
import {AppRoutingModule} from "./app-routing.module";


export class MyXSRFStrategy {
    configureRequest(req: Request) {
        if (!req.headers.has('X-Session-ID'))
            req.headers.append('X-Session-ID', localStorage.getItem("pollak_sessionid"));
    }
}

export function myFactory() {
    return new MyXSRFStrategy();
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        PollroomComponent,
        PollroomStatsComponent,
        QuestionViewComponent,
        ResponseViewComponent,
        QuestionCreatorComponent,
        TimeAgoPipe,
        NegativeSignPipe,
        ThousandSeparatorPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        ToastModule,
        AppRoutingModule
    ],
    providers: [
        HomeService,
        UtilityService,
        PollroomService,
        { provide: XSRFStrategy, useFactory: myFactory }
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
