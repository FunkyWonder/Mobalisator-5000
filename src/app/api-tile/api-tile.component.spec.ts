import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiTileComponent } from './api-tile.component';

describe('ApiTileComponent', () => {
  let component: ApiTileComponent;
  let fixture: ComponentFixture<ApiTileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApiTileComponent]
    });
    fixture = TestBed.createComponent(ApiTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
