import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera/ngx';
import {ActionSheetController, LoadingController, Platform, ToastController} from '@ionic/angular';
import {File} from '@ionic-native/file/ngx';
import {HttpClient} from '@angular/common/http';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {Storage} from '@ionic/storage';
import {FilePath} from '@ionic-native/file-path/ngx';

import {finalize} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

const STORAGE_KEY = 'my_images';

@Component({
    selector: 'app-photograph',
    templateUrl: './photograph.page.html',
    styleUrls: ['./photograph.page.scss'],
})
export class PhotographPage implements OnInit {

    images = [];
    pictureTaken = '';
    photoForm: FormGroup;
    event: string;
    photographer: string;
    code: string;
    photoDate: string;

    constructor(
        private camera: Camera,
        private file: File,
        private http: HttpClient,
        private webview: WebView,
        private actionSheetController: ActionSheetController,
        private toastController: ToastController,
        private storage: Storage,
        private platform: Platform,
        private loadingController: LoadingController,
        private ref: ChangeDetectorRef,
        private filePath: FilePath,
        private formBuilder: FormBuilder,
        private router: Router
    ) {
        this.photoForm = this.formBuilder.group({
            'code': ['', Validators.required],
            'name': ['', Validators.required],
            'event': ['', Validators.required],
            'photographer': [''],
            'phone': [''],
            'congregation': [''],
            'observation': [''],
            'photoDate': [''],
        });
    }

    ngOnInit() {}

    ionViewWillEnter() {
        this.event = '';
        this.photographer = '';
        this.code = '';
        this.storage.get('photograph_info').then(info => {
            this.event = info.event;
            this.photographer = info.name;

            this.code = this.photographer.substring(0, 3).toUpperCase() + '-' + Math.random().toString(36).substring(7).toUpperCase();
        });

        const today = new Date();
        const date = today.getDate() + '/' + this.pad((today.getMonth() + 1), 2, '') + '/' + today.getFullYear();
        const time = today.getHours() + ':' + this.pad(today.getMinutes(), 2, '') + ':' + this.pad(today.getSeconds(), 2, '');
        this.photoDate = date + ' ' + time;
    }

    pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    pathForImage(img) {
        if (img === null) {
            return '';
        } else {
            return this.webview.convertFileSrc(img);
        }
    }

    async presentToast(text) {
        const toast = await this.toastController.create({
            message: text,
            position: 'bottom',
            duration: 3000
        });
        toast.present();
    }

    async selectImage() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Select Image source',
            buttons: [
                {
                    text: 'Load from Library',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        await actionSheet.present();
    }

    takePicture(sourceType: PictureSourceType) {
        const options: CameraOptions = {
            quality: 25,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        this.camera.getPicture(options).then(imagePath => {
            if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
                this.filePath.resolveNativePath(imagePath)
                    .then(filePath => {
                        const correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                        const currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                    });
            } else {
                const currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                const correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            }
        });

    }

    createFileName() {
        const d = new Date(),
            n = d.getTime(),
            newFileName = n + '.jpg';
        return newFileName;
    }

    copyFileToLocalDir(namePath, currentName, newFileName) {
        this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
            this.updateStoredImages(newFileName);
        }, error => {
            this.presentToast('Error while storing file.');
        });
    }

    updateStoredImages(name) {
        this.storage.get(STORAGE_KEY).then(images => {
            const arr = JSON.parse(images);

            const newArr = {
                timestamp: new Date().getTime(),
                name: name,
                event: this.event,
                photographer: this.photographer,
                code: this.photoForm.value.code,
                phone: this.photoForm.value.phone,
                congregation: this.photoForm.value.congregation,
                fullName: this.photoForm.value.name,
                observation: this.photoForm.value.observation,
                photoDate: this.photoForm.value.photoDate,
            };

            if (!arr) {
                const newImages = [newArr];
                this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
            } else {
                arr.push(newArr);
                this.storage.set(STORAGE_KEY, JSON.stringify(arr));
            }

            const filePath = this.file.dataDirectory + name;
            this.pictureTaken = this.pathForImage(filePath);

            this.photoForm.reset();
            this.router.navigateByUrl('/tabs/sync');
        });
    }

}
