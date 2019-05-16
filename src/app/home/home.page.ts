import {Component, OnInit} from '@angular/core';
import { NavController } from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {EventService} from '../../service/event.service';

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
    event: string;
    photographer: string;

    constructor(
        public navCtrl: NavController,
        public eventService: EventService,
        private storage: Storage,
    ) { }

    ngOnInit() {}

    ionViewWillEnter() {
        this.storage.get('photograph_info').then(info => {
            this.event = info.event;
            this.photographer = info.name;
        });

        this.eventService.getEvents().subscribe(response => {
            this.events = response;
        }, error => {
            alert(error.error);
        });
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
            event: this.event,
            name: this.photographer,
        });
    }
}
