import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class HomeService {

    constructor(private http: Http) { }

    private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
    private options = new RequestOptions({ headers: this.headers });

    register(registeredUser) {
        // TODO : registration
        return this.http.post("/users/registration", JSON.stringify(registeredUser), this.options);
    }

    getStats() {
        // TODO
        return this.http.get('/stats').map(res => res.json());
    }

    getCats() {
        return this.http.get('/cats').map(res => res.json());
    }

    addCat(cat) {
        return this.http.post("/cat", JSON.stringify(cat), this.options);
    }

    editCat(cat) {
        return this.http.put(`/cat/${cat._id}`, JSON.stringify(cat), this.options);
    }

    deleteCat(cat) {
        return this.http.delete(`/cat/${cat._id}`, this.options);
    }

}
