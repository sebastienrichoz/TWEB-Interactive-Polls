import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// External libraries
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { NG2D3Module } from 'ng2d3';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { PollroomComponent } from './pollroom/pollroom.component';
import { QuestionCreatorComponent } from './pollroom/question-creator/question-creator.component';
import { QuestionViewComponent } from './pollroom/question-view/question-view.component';

// Services
import { DataService } from './services/data.service';
import {HomeService} from "./services/home.service";
import {DashboardService} from "./services/dashboard.service";

// Pipes
import { ThousandSeparatorPipe } from './pipes/thousand-separator.pipe';
import { PollroomStatsComponent } from './pollroom/pollroom-stats/pollroom-stats.component';
import { ResponseViewComponent } from './pollroom/question-view/response-view/response-view.component';


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
        ResponseViewComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        ModalModule.forRoot(),
        BootstrapModalModule,
        ChartsModule,
        NG2D3Module,
        ToastModule,
        routing
    ],
    providers: [
        DataService,
        HomeService,
        DashboardService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
