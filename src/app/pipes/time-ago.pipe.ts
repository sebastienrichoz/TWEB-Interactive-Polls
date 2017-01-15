import { OnDestroy, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/repeatWhen';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/takeWhile';

@Pipe({
    name: 'timeAgo',
    pure: false
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
private readonly async: AsyncPipe;

    private isDestroyed = false;
    private value: Date;
    private timer: Observable<string>;

    constructor(ref: ChangeDetectorRef) {
        this.async = new AsyncPipe(ref);
    }

    public transform(obj: any, ...args: any[]): any {
        if (obj == null) {
            return '';
        }

        if (!(obj instanceof Date)) {
            throw new Error('TimeAgoPipe works only with Dates');
        }

        this.value = obj;

        if (!this.timer) {
            this.timer = this.getObservable();
        }

        return this.async.transform(this.timer);
    }

    public now(): Date {
        return new Date();
    }

    public ngOnDestroy() {
        this.isDestroyed = true;
        // on next interval, will complete
    }

    private getObservable() {
        return Observable
            .of(1)
            .repeatWhen(notifications => {
                // for each next raised by the source sequence, map it to the result of the returned observable
                return notifications.flatMap((x, i) => {
                    const sleep = i < 60 ? 1000 : 30000;
                    return Observable.timer(sleep);
                });
            })
            .takeWhile(_ => !this.isDestroyed)
            .map((x, i) => this.elapsed());
    };

    private elapsed(): string {
        let now = this.now().getTime();

        // time since message was sent in seconds
        let delta = (now - this.value.getTime()) / 1000;

        // format string
        if (delta < 60) { // sent in last minute
            let single = Math.floor(delta);
            let time = "second";
            if (Math.floor(delta) > 1)
                time = "seconds";
            return `${single} ${time} ago`;
        } else if (delta < 3600) { // sent in last hour
            let single = Math.floor(delta / 60);
            let time = "minute";
            if (single > 1)
                time = "minutes";
            return `${single} ${time} ago`;
        } else if (delta < 86400) { // sent on last day
            let single = Math.floor(delta / 3600);
            let time = "hour";
            if (single > 1)
                time = "hours";
            return `${single} ${time} ago`;
        } else { // sent more than one day ago
            let single = Math.floor(delta / 86400);
            let time = "day";
            if (single > 1)
                time = "days";
            return `${single} ${time} ago`;
        }
    }
}