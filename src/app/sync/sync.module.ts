import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SyncPage } from './sync.page';

const routes: Routes = [
  {
    path: '',
    component: SyncPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: SyncPage }])
  ],
  declarations: [SyncPage]
})
export class SyncPageModule {}
