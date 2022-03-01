import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PokemonService } from 'src/app/services/pokemon.service';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { PokemonListComponent } from '../pokemon-list/pokemon-list.component';
import { PokemonDetail } from 'src/app/models/pokemon.detail';
import { PokemonDetailComponent } from '../pokemon-detail/pokemon-detail.component';

@Component({
  selector: 'app-pokemon-favorites',
  templateUrl: './pokemon-favorites.component.html',
  styleUrls: ['./pokemon-favorites.component.sass']
})


export class PokemonFavoritesComponent implements OnInit {

  classicMode: boolean;
  favoritesDetails = PokemonListComponent.favoritesDetails;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
                private bottomSheet: MatBottomSheet,
                private snackBar: MatSnackBar) {
                this.classicMode = data.classicMode;
  }

  ngOnInit(): void {
  }

  onDetail(pokemon: PokemonDetail): void {
    this.bottomSheet.open(PokemonDetailComponent, {
      data: {pokemon,classicMode: this.classicMode}
    })
  }

  onAddFavorite(pokemon: PokemonDetail): void{
    if(PokemonListComponent.contains < 6 && !PokemonListComponent.favoritesDetails.includes(pokemon)){
      PokemonListComponent.favoritesDetails.push(pokemon);
      PokemonListComponent.contains ++;
      this.snackBar.open('Added to Favorites!', 'Ok',{
        duration: 3000,
      });
    }
    else{
      if(PokemonListComponent.favoritesDetails.includes(pokemon)){
        delete PokemonListComponent.favoritesDetails[PokemonListComponent.favoritesDetails.indexOf(pokemon)];
        PokemonListComponent.contains --;
        PokemonListComponent.favoritesDetails.length --;
        this.snackBar.open('Removed from Favorites!','Ok',{
          duration: 3000,
        });
      }else{
        if(PokemonListComponent.contains >= 6){
          this.snackBar.open('Favorite list is full!', 'Ok',{
            duration: 3000,
          });
        }
      }
    }
  }

  getPrincipalType(list: any[]) {
    return list.filter(x => x.slot === 1)[0]?.type.name;
  }

}
