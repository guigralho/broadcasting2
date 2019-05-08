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
                    name: photo.fullName,
                    code: photo.code,
                    photographer: photo.photographer,
                    event: photo.event,
                    img: photo.path,
                }
            });

        modal.onDidDismiss().then(result => {
            if (result !== null) {
                const editedImage = result.data;

                for (const image of this.images) {
                    if (image.timestamp === editedImage.timestamp) {
                        image.fullName = editedImage.name;
                        image.photographer = editedImage.photographer;
                    }
                }

                this.storage.get(STORAGE_KEY).then(images => {
                    if (images) {
                        const storedImages = JSON.parse(images);

                        for (const image of storedImages) {
                            if (image.timestamp === editedImage.timestamp) {
                                image.fullName = editedImage.name;
                                image.photographer = editedImage.photographer;
                            }
                        }

                        this.storage.remove(STORAGE_KEY);
                        this.storage.set(STORAGE_KEY, storedImages);
                    }
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
                        event: img.event,
                        timestamp: img.timestamp,
                        photographer: img.photographer,
                        fullName: img.fullName
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
                (<FileEntry>entry).file(file => this.readFile(file));

                this.deleteImage(imgEntry, position);
            })
            .catch(err => {
                this.presentToast('Error while reading file.');
            });
    }

    readFile(file: any) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const formData = new FormData();
            const imgBlob = new Blob([reader.result], {
                type: file.type
            });
            formData.append('file', imgBlob, file.name);
            this.uploadImageData(formData);
        };
        reader.readAsArrayBuffer(file);
    }

    async uploadImageData(formData: FormData) {
        const loading = await this.loadingController.create({
            message: 'Uploading image...',
        });
        await loading.present();

        this.http.post('http://localhost:8888/upload.php', formData)
            .pipe(
                finalize(() => {
                    loading.dismiss();
                })
            )
            .subscribe(res => {
                if (res['success']) {
                    this.presentToast('File upload complete.');
                } else {
                    this.presentToast('File upload failed.');
                }
            });
    }

}
