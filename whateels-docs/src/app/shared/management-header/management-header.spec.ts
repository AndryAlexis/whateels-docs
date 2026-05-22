import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementHeader } from './management-header';

describe('ManagementHeader', () => {
  let component: ManagementHeader;
  let fixture: ComponentFixture<ManagementHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
