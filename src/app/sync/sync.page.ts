import {Component, OnInit} from '@angular/core';
import {Camera} from '@ionic-native/camera/ngx';
import {ActionSheetController, Platform, ToastController} from '@ionic/angular';
import {File} from '@ionic-native/file/ngx';
import {HttpClient} from '@angular/common/http';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {Storage} from '@ionic/storage';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.page.html',
  styleUrls: ['./sync.page.scss'],
})
export class SyncPage implements OnInit {

  images = [];

  constructor(
      private camera: Camera,
      private file: File,
      private http: HttpClient,
      private webview: WebView,
      private actionSheetController: ActionSheetController,
      private toastController: ToastController,
      private storage: Storage,
      private platform: Platform
  ) {
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.loadStoredImages();
    });
  }

  loadStoredImages() {
    this.storage.get(STORAGE_KEY).then(images => {
      if (images) {
        const arr = JSON.parse(images);
        this.images = [];
        for (const img of arr) {
          const filePath = this.file.dataDirectory + img;
          const resPath = this.pathForImage(filePath);
          this.images.push({name: img, path: resPath, filePath: filePath});
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

}
