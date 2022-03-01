import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonFavoritesComponent } from './pokemon-favorites.component';

describe('PokemonFavoritesComponent', () => {
  let component: PokemonFavoritesComponent;
  let fixture: ComponentFixture<PokemonFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokemonFavoritesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
