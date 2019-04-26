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
    events: any;

    count: number;
    event_id: string;
    fotografo: string;

    constructor(
        public navCtrl: NavController,
        private storage: Storage,
    ) { }

    ngOnInit() {
        this.events = [{
            id: 1,
            name: 'Treinamento Aeroporto'
        }, {
            id: 2,
            name: 'Treinamento Guia de Passeios'
        }];
    }

    ionTabsWillChange() {
        this.count = 0;
        this.storage.get(STORAGE_KEY).then(images => {
            if (images) {
                const arr = JSON.parse(images);
                this.count = arr.length;
            }
        });
    }

    saveInfo() {
        this.storage.set('photograph_info', {
            event_id: this.event_id,
            name: this.fotografo,
        });
    }
}
