import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SyncPage } from './sync.page';
import {EditPhotographPageModule} from '../edit-photograph/edit-photograph.module';

const routes: Routes = [
  {
    path: '',
    component: SyncPage
  }
];

@NgModule({
  declarations: [SyncPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    EditPhotographPageModule
  ]
})
export class SyncPageModule {}
