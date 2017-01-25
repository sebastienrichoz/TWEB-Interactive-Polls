/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GamificationService } from './gamification.service';

describe('GamificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GamificationService]
    });
  });

  it('should ...', inject([GamificationService], (service: GamificationService) => {
    expect(service).toBeTruthy();
  }));
});
