import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera/ngx';
import {ActionSheetController, LoadingController, ModalController, NavParams, Platform, ToastController} from '@ionic/angular';
import {File} from '@ionic-native/file/ngx';
import {HttpClient} from '@angular/common/http';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {Storage} from '@ionic/storage';
import {FilePath} from '@ionic-native/file-path/ngx';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

const STORAGE_KEY = 'my_images';

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
    @Input() image: string;

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
        });
    }

    async dismiss() {
        const result = this.photoForm.value;

        await this.modalController.dismiss(result);
    }

}
