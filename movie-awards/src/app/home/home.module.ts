import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.route';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListComponent } from './list/list.component';
import { ComponentsModule } from '../shared/components/components.module';
import { YearsWithWinnersComponent } from './dashboard/tables/years-with-winners/years-with-winners.component';
import { IntervalBtWinsComponent } from './dashboard/tables/interval-bt-wins/interval-bt-wins.component';
import { TopStudiosComponent } from './dashboard/tables/top-studios/top-studios.component';
import { WinnerByYearsComponent } from './dashboard/tables/winner-by-years/winner-by-years.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    ListComponent,
    YearsWithWinnersComponent,
    IntervalBtWinsComponent,
    TopStudiosComponent,
    WinnerByYearsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HomeRoutingModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: []
})
export class HomeModule { }
