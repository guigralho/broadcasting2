import { Component } from '@angular/core';
import {Storage} from '@ionic/storage';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  count: number;

  constructor(
      private storage: Storage,
  ) { }

  ionTabsWillChange() {
    console.log('asd');
    this.count = 0;
    this.storage.get(STORAGE_KEY).then(images => {
      if (images) {
        const arr = JSON.parse(images);
        this.count = arr.length;
      }
    });
  }
}
