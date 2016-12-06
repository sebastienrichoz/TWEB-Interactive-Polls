import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from "@angular/http";

@Injectable()
export class DashboardService {

    private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
    private options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http) { }

    getGlobalStats() {
        // TODO : get global stats for connected user
        return this.http.get('/globalstats/:user').map(res => res.json());
    }

    addPoll(pollName: string) {
        // TODO : post a poll accordingly to the connected user
        return this.http.post("/poll", JSON.stringify(pollName), this.options);
    }

    joinPoll(pollRoomNumber: string) {
        // TODO : socket.io join a pollroom number
        return this.http.post("/pollroom", JSON.stringify(pollRoomNumber), this.options);
    }
}
