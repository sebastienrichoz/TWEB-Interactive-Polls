import { fakeAsync, tick } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeWhile';

import { TimeAgoPipe } from './time-ago.pipe';
import { WrappedValue } from '@angular/core';

// Learning
describe('Observable', () => {
  it('standard Observable.interval does not continue after .takeWhile', fakeAsync(() => {
    let n = 0;
    let m = 0;
    Observable
        .interval(100)
        .do(_ => n++)
        .takeWhile(_ => n < 3)
        .subscribe(_ => m++);

    tick(600);

    expect(n).toBe(3);
    expect(m).toBe(2);
    // observe that there's also no "periodic timers still left in the queue" error
  }));
});

describe('TimeAgoPipe', () => {

  describe('on Date', () => {
    let pipe: TimeAgoPipe;
    let ref: any;
    let start: Date;
    let updated: number;

    beforeEach(() => {
      start = new Date();
      updated = 0;
      ref = {
        markForCheck: () => updated++
      };
      pipe = new TimeAgoPipe(ref);
    });

    function safePipeSpec(spec: () => void) {
      return fakeAsync(() => {
        try {
          spec();
        } finally {
          pipe.ngOnDestroy(); // destroy pipe
          tick(30000); // ensure the periodic timer has a chance to cleanup after itself
        }
      });
    }

    describe('transform', () => {
      it('should update value every second', safePipeSpec(() => {
        pipe.transform(start);
        expect(updated).toBe(1);

        tick(1000);

        expect(updated).toBe(2);
      }));

      it('should properly format values', safePipeSpec(() => {
        // monkey-patch pipe
        let elapsed = 0;
        function elapse(x) {
          elapsed += x;
          tick(x);
        };
        (<any>pipe).now = () => new Date(start.getTime() + elapsed);

        function unwrap(x: string | WrappedValue) {
          return x instanceof String ? x : x.wrapped;
        }

        pipe.transform(start);

        elapse(1000); // +1s = 1s
        expect(unwrap(pipe.transform(start))).toBe('1s ago');

        elapse(10000); // +10s = 11s
        expect(unwrap(pipe.transform(start))).toBe('11s ago');

        elapse(50000); // +50s = 61s
        expect(unwrap(pipe.transform(start))).toBe('1m ago');

        elapse(60 * 60 * 1000); // +1h = 1h61s(60s*60m*1000ms)
        expect(unwrap(pipe.transform(start))).toBe('1h ago');

        elapse(24 * 60 * 60 * 1000); // +24h = 25h61s
        expect(unwrap(pipe.transform(start))).toBe('1d ago');
      }));

    });

    describe('ngOnDestroy', () => {
      it('should do nothing when no subscription', () => {
        expect(() => pipe.ngOnDestroy()).not.toThrow();
      });

      it('should ensure no more change detection cycle triggered', fakeAsync(() => {
        pipe.transform(start);
        expect(updated).toBe(1);

        pipe.ngOnDestroy();
        tick(1000);

        expect(updated).toBe(1);
      }));
    });
  });

  describe('on null', () => {
    it('should return empty string', () => {
      let pipe = new TimeAgoPipe(null);
      expect(pipe.transform(null)).toBe('');
    });
  });

  describe('on other types', () => {
    it('should throw', () => {
      let pipe = new TimeAgoPipe(null);
      expect(() => pipe.transform(<any>'some bogus object')).toThrowError();
    });
  });
});