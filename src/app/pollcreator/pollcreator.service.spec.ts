/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PollcreatorService } from './pollcreator.service';

describe('Service: Pollcreator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PollcreatorService]
    });
  });

  it('should ...', inject([PollcreatorService], (service: PollcreatorService) => {
    expect(service).toBeTruthy();
  }));
});
