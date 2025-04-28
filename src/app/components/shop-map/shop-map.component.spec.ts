import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopMapComponent } from './shop-map.component';

describe('ShopMapComponent', () => {
  let component: ShopMapComponent;
  let fixture: ComponentFixture<ShopMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
