import {Component, Input, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-edit-photograph',
    templateUrl: './edit-photograph.page.html',
    styleUrls: ['./edit-photograph.page.scss'],
})
export class EditPhotographPage implements OnInit {

    photoForm: FormGroup;
    @Input() timestamp: string;
    @Input() event: string;
    @Input() photographer: string;
    @Input() code: string;
    @Input() name: string;
    @Input() img: string;
    @Input() phone: string;
    @Input() congregation: string;
    @Input() observation: string;
    @Input() photoDate: string;

    constructor(
        private modalController: ModalController,
        private navParams: NavParams,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {}

    ionViewWillEnter() {
        this.photoForm = this.formBuilder.group({
            'code': [this.code, Validators.required],
            'name': [this.name, Validators.required],
            'event': [this.event, Validators.required],
            'photographer': [this.photographer],
            'timestamp': [this.timestamp],
            'phone': [this.phone],
            'congregation': [this.congregation],
            'observation': [this.observation],
            'photoDate': [this.photoDate],
        });
    }

    async dismiss() {
        const result = this.photoForm.value;

        await this.modalController.dismiss(result);
    }

}
