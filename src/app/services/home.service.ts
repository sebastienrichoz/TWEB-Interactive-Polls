import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import {Subject} from 'rxjs';

import 'rxjs/add/operator/map';
import {PollroomCreationDTO} from "../models/pollroom-creation-dto";
import {UtilityService} from "./utility-service";
import {Pollroom} from "../models/pollroom";

@Injectable()
export class HomeService {

    private pollroomSelectedSource = new Subject<Pollroom>();
    pollroomSelected$ = this.pollroomSelectedSource.asObservable();

    constructor(private http: Http, private utility: UtilityService) { }

    private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
    private options = new RequestOptions({ headers: this.headers });

    selectPollroom(pollroom: Pollroom) {
        this.pollroomSelectedSource.next(pollroom);
    }

    getStats(): Promise<any> {
        return this.http.get('/api/v1/statistics/')
            .toPromise()
            .then(this.utility.extractData)
            .catch(this.utility.handleError);
    }

    createPollroom(pollCreationDTO: PollroomCreationDTO): Promise<Pollroom> {
        return this.http.post("/api/v1/pollrooms/", JSON.stringify(pollCreationDTO), this.options)
            .toPromise()
            .then(this.utility.extractData)
            .catch(this.utility.handleError);
    }

    joinPollroom(pollroom_id: string): Promise<Pollroom> {
        return this.http.get("/api/v1/pollrooms/" + pollroom_id + "/")
            .toPromise()
            .then(this.utility.extractData)
            .catch(this.utility.handleError);
    }

    getPollroom(pollroomIdentifier: string): Promise<Pollroom> {
        return this.http.get('/api/v1/pollrooms/' + pollroomIdentifier)
            .toPromise()
            .then(this.utility.extractData)
            .catch(this.utility.handleError);
    }

    getPollrooms(): Promise<any> {
        return this.http.get('/api/v1/pollrooms/')
            .toPromise()
            .then(this.utility.extractData)
            .catch(this.utility.handleError);
    }
}
