import {Component, OnInit} from '@angular/core';
import { NavController } from '@ionic/angular';
import {Storage} from '@ionic/storage';

const STORAGE_KEY = 'my_images';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    images = [];

    count: number;

    constructor(
        public navCtrl: NavController,
        private storage: Storage,
    ) { }

    ngOnInit() { }

    ionViewWillEnter() {
        this.count = 0;
        this.storage.get(STORAGE_KEY).then(images => {
            if (images) {
                const arr = JSON.parse(images);
                this.count = arr.length;
            }
        });
    }

    /*teste() {
        const newImages = [{name: 'asd', code: 'XPTO123'}];

        newImages.push({name: 'assets/img/Sl7ZoABwQWBkJ47TkKWx_jw.svg', code: 'XPTO456s'});

        this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
    }*/


}
