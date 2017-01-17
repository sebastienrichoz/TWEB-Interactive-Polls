import {Response} from "@angular/http";
export class UtilityService {
    public extractData(res: Response) {
        let body = res.json();
        return body || { };
    }

    public handleError (error: Response | any) {
        // TODO : In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            // errMsg = body[0];
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error("error: " + errMsg);
        return Promise.reject(errMsg);
    }
}