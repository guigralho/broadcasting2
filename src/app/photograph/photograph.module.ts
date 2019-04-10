import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PhotographPage } from './photograph.page';

const routes: Routes = [
  {
    path: '',
    component: PhotographPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: PhotographPage }]),
    ReactiveFormsModule
  ],
  declarations: [PhotographPage]
})
export class PhotographPageModule {}
