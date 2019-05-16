import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class EventService {

    constructor(
        public http: HttpClient
    ) {}

    getEvents() {
        return this.http.get(`http://165.22.129.37/api/events`);
    }
}
