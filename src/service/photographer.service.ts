import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class PhotographerService {

    constructor(
        public http: HttpClient
    ) {}

    getPhotographers() {
        return this.http.get(`http://165.22.129.37/api/photographers`);
    }
}
