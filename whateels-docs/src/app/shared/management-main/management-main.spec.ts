import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementMain } from './management-main';

describe('ManagementMain', () => {
  let component: ManagementMain;
  let fixture: ComponentFixture<ManagementMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementMain],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
