import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';

import { GlobalStatsComponent } from './global-stats/global-stats.component';
import { BarchartComponent } from './barchart/barchart.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        DashboardComponent,
        GlobalStatsComponent,
        BarchartComponent
    ]
})
export class DashboardModule { }
