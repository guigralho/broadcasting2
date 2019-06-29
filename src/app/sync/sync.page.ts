import {Component, OnInit} from '@angular/core';
import {Camera} from '@ionic-native/camera/ngx';
import {ActionSheetController, LoadingController, ModalController, Platform, ToastController} from '@ionic/angular';
import {File, FileEntry} from '@ionic-native/file/ngx';
import {HttpClient} from '@angular/common/http';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {Storage} from '@ionic/storage';
import {finalize} from 'rxjs/operators';
import {Router} from '@angular/router';
import {EditPhotographPage} from '../edit-photograph/edit-photograph.page';

const STORAGE_KEY = 'my_images';

@Component({
    selector: 'app-sync',
    templateUrl: './sync.page.html',
    styleUrls: ['./sync.page.scss'],
})
export class SyncPage implements OnInit {

    images = [];

    constructor(
        public router: Router,
        private camera: Camera,
        private file: File,
        private http: HttpClient,
        private webview: WebView,
        private actionSheetController: ActionSheetController,
        private toastController: ToastController,
        private modalController: ModalController,
        private storage: Storage,
        private platform: Platform,
        private loadingController: LoadingController
    ) { }

    ngOnInit() {
        this.platform.ready().then(() => {
            this.loadStoredImages();
        });
    }

    async editPhoto(photo) {
        const modal =
            await this.modalController.create({
                component: EditPhotographPage,
                componentProps: {
                    timestamp: photo.timestamp,
                    photoDate: photo.photoDate,
                    name: photo.fullName,
                    code: photo.code,
                    photographer: photo.photographer,
                    event: photo.event,
                    phone: photo.phone,
                    congregation: photo.congregation,
                    img: photo.path,
                    observation: photo.observation,
                }
            });

        modal.onDidDismiss().then(result => {
            if (result !== null) {
                const editedImage = result.data;

                this.storage.get(STORAGE_KEY).then(images => {
                    const arr = JSON.parse(images);
                    arr.find(item => item.timestamp == editedImage.timestamp).fullName = editedImage.name;
                    arr.find(item => item.timestamp == editedImage.timestamp).photographer = editedImage.photographer;
                    arr.find(item => item.timestamp == editedImage.timestamp).phone = editedImage.phone;
                    arr.find(item => item.timestamp == editedImage.timestamp).congregation = editedImage.congregation;
                    arr.find(item => item.timestamp == editedImage.timestamp).observation = editedImage.observation;

                    this.storage.remove(STORAGE_KEY);
                    this.storage.set(STORAGE_KEY, JSON.stringify(arr));

                    this.loadStoredImages();
                });


            }
        });

        return await modal.present();
    }

    ionViewWillEnter() {
        this.loadStoredImages();
    }

    loadStoredImages() {
        this.storage.get(STORAGE_KEY).then(images => {
            if (images) {
                const arr = JSON.parse(images);
                this.images = [];
                for (const img of arr) {
                    const filePath = this.file.dataDirectory + img.name;
                    const resPath = this.pathForImage(filePath);
                    this.images.push({
                        name: img.name,
                        path: resPath,
                        filePath: filePath,
                        code: img.code,
                        phone: img.phone,
                        congregation: img.congregation,
                        event: img.event,
                        timestamp: img.timestamp,
                        photographer: img.photographer,
                        fullName: img.fullName,
                        observation: img.observation,
                        photoDate: img.photoDate,
                    });
                }
            }
        });
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

    deleteImage(imgEntry, position) {
        this.images.splice(position, 1);

        this.storage.get(STORAGE_KEY).then(images => {
            const arr = JSON.parse(images);
            const filtered = arr.filter(name => name.name !== imgEntry.name);
            this.storage.set(STORAGE_KEY, JSON.stringify(filtered));

            const correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);

            this.file.removeFile(correctPath, imgEntry.name).then(res => {
                this.presentToast('File removed.');
            });
        });
    }

    startUpload(imgEntry, position) {
        this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
            .then(entry => {
                (<FileEntry>entry).file(file => this.readFile(imgEntry, file));

                this.deleteImage(imgEntry, position);
            })
            .catch(err => {
                this.presentToast('Error while reading file.');
            });
    }

    readFile(imgEntry, file: any) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const formData = new FormData();
            const imgBlob = new Blob([reader.result], {
                type: file.type
            });

            const fullDate = new Date(imgEntry.timestamp);

            formData.append('name', imgEntry.fullName);
            formData.append('code', imgEntry.code);
            formData.append('event', imgEntry.event);
            formData.append('photographer', imgEntry.photographer);
            formData.append('congregation', imgEntry.congregation);
            formData.append('phone', imgEntry.phone);
            formData.append('file', imgBlob, file.name);
            formData.append('timestamp', imgEntry.photoDate);
            formData.append('observation', imgEntry.observation);
            this.uploadImageData(formData);
        };
        reader.readAsArrayBuffer(file);
    }

    async uploadImageData(formData: FormData) {
        const loading = await this.loadingController.create({
            message: 'Uploading image...',
        });
        await loading.present();

        // https://webhook.site/09ec3ce0-1fff-4a16-b3d2-794611283f42
        // http://165.22.129.37/api/upload

        this.http.post('http://165.22.129.37/api/upload', formData)
            .pipe(
                finalize(() => {
                    loading.dismiss();
                })
            )
            .subscribe(res => {
                if (res['success']) {
                    this.presentToast('File upload complete!');
                } else {
                    this.presentToast('File upload failed :(');
                }
            });
    }

}
