import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhotographPage } from './edit-photograph.page';

describe('PhotographPage', () => {
  let component: EditPhotographPage;
  let fixture: ComponentFixture<EditPhotographPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPhotographPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPhotographPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
