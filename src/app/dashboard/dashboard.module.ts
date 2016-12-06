import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GlobalStatsComponent } from './global-stats/global-stats.component';
import { BarchartComponent } from './barchart/barchart.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        DashboardComponent,
        GlobalStatsComponent,
        BarchartComponent
    ]
})
export class DashboardModule { }
