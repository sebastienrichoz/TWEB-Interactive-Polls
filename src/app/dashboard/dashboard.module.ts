import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GlobalStatsComponent } from './global-stats/global-stats.component';
import { BarchartComponent } from './barchart/barchart.component';
import { NG2D3Module } from 'ng2d3';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NG2D3Module
    ],
    declarations: [
        DashboardComponent,
        GlobalStatsComponent,
        BarchartComponent
    ]
})
export class DashboardModule { }
