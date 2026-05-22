import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementSidebar } from './management-sidebar';

describe('ManagementSidebar', () => {
  let component: ManagementSidebar;
  let fixture: ComponentFixture<ManagementSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
