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

    ngOnInit() {
        this.count = 0;
        this.storage.get(STORAGE_KEY).then(images => {
            if (images) {
                this.count = images.length;
            }
        });
    }


}
