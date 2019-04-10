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
        });
    }

    ngOnInit() {}

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
            quality: 100,
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

            const newArr = {name: name, code: this.photoForm.value.code, fullName: this.photoForm.value.name};
            if (!arr) {
                const newImages = [newArr];
                this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
            } else {
                arr.push(newArr);
                this.storage.set(STORAGE_KEY, JSON.stringify(arr));
            }

            /*const filePath = this.file.dataDirectory + name;
            this.pictureTaken = this.pathForImage(filePath);*/

            this.photoForm.reset();

            this.router.navigateByUrl('/tabs/sync');
        });
    }

}
