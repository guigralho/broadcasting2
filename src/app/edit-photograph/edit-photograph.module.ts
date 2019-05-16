import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditPhotographPage } from './edit-photograph.page';

@NgModule({
  declarations: [EditPhotographPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
  entryComponents: [EditPhotographPage]
})
export class EditPhotographPageModule {}
