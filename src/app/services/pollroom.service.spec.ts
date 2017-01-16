/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PollroomService } from './pollroom.service';

describe('Service: PollroomService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PollroomService]
    });
  });

  it('should ...', inject([PollroomService], (service: PollroomService) => {
    expect(service).toBeTruthy();
  }));
});
