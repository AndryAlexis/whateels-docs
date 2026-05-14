import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Doc } from './doc';

describe('Doc', () => {
  let component: Doc;
  let fixture: ComponentFixture<Doc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Doc],
    }).compileComponents();

    fixture = TestBed.createComponent(Doc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
