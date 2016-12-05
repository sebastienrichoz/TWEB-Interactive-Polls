/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PollroomComponent } from './pollroom.component';

describe('PollroomComponent', () => {
  let component: PollroomComponent;
  let fixture: ComponentFixture<PollroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
