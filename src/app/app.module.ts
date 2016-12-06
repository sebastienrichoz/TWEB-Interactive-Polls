import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

import { DataService } from './services/data.service';
import {HomeService} from "./services/home.service";

import { ToastComponent } from './shared/toast/toast.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { DashboardComponent } from './dashboard/dashboard.component';

import { ThousandSeparatorPipe } from './pipes/thousand-separator.pipe';

// External libraries
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { PollcreatorComponent } from './pollcreator/pollcreator.component';
import { PollroomComponent } from './pollroom/pollroom.component';
import { QuestionComponent } from './pollcreator/question/question.component';
import { PieChartComponent } from './shared/pie-chart/pie-chart.component';

// roots
const routing = RouterModule.forRoot([
    { path: '',      component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'pollcreator', component: PollcreatorComponent },
    { path: 'pollroom', component: PollroomComponent }
]);

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AboutComponent,
        ToastComponent,
        ThousandSeparatorPipe,
        PollcreatorComponent,
        PollroomComponent,
        QuestionComponent,
        PieChartComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        DashboardModule,
        ModalModule.forRoot(),
        BootstrapModalModule,
        ChartsModule,
        routing
    ],
    providers: [
        DataService,
        HomeService,
        ToastComponent
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
