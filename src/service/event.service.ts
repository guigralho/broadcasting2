import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class EventService {

    constructor(
        public http: HttpClient
    ) {}

    getEvents() {
        return this.http.get(`http://192.168.0.10:8000/api/events`);
    }
}
