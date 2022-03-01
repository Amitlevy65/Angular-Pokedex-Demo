import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable } from 'rxjs';
import { PokemonDetail } from '../../models/pokemon.detail';
import { PokemonList } from '../../models/pokemon.list';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonDetailComponent } from '../pokemon-detail/pokemon-detail.component';
import { PokemonFavoritesComponent } from '../pokemon-favorites/pokemon-favorites.component';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.sass']
})
export class PokemonListComponent implements OnInit {

  search: FormControl = new FormControl('');
  pokemons: PokemonDetail[] = [];
  static favoritesDetails: PokemonDetail[] = [];
  static contains = 0;
  private offset: number;
  classicMode: boolean = true;
  isLoading: boolean = false;
  isLastPage: boolean = false;
  firstClick: boolean = true;
  isSearching: boolean = false;
  audio = new Audio();


  searchPokemon: PokemonDetail = new PokemonDetail();

  constructor(private pokemonService: PokemonService,
              private bottomSheet: MatBottomSheet,
              private snackBar: MatSnackBar) {
                this.offset = 0 ;
              }


  ngOnInit(): void {
    this.getPage(this.offset);
  }

  onOpenFavorites(): void {
    this.bottomSheet.open(PokemonFavoritesComponent ,{
      data: {PokemonListComponent,classicMode: this.classicMode}
    });
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

  getPage(offset: number) {
    if(!this.isLoading && !this.isLastPage) {
      this.isLoading = true;
      this.pokemonService.getPokemonList(offset)
      .subscribe((list: PokemonList[]) => {
        if(list.length === 0) {
          this.isLastPage = true;
        }
        if(!this.isLastPage) {
          this.getPokemon(list);
        }
      });
    }
  }

  onSearchPokemon(): void {
    const value = this.search.value;
    if(value === '') {
      this.isSearching = false;
    } else {
      this.isSearching = true;
      this.isLoading = true;
      this.pokemonService.getPokemonDetail(value)
      .subscribe((pokemon: PokemonDetail) => {
        this.searchPokemon = pokemon;
        this.isLoading = false;
      }, (error: any) => {
        this.isLoading = false;
        if(error.status === 404) {
          this.snackBar.open('Sorry, Pokemon not found', 'Ok', {
            duration: 3000,
          });
        }
      })
    }
  }


  private getPokemon(list: PokemonList[]) {
    const arr: Observable<PokemonDetail>[] = [];
    list.map((value: PokemonList) => {
      arr.push(
        this.pokemonService.getPokemonDetail(value.name)
      );
    });

    forkJoin([...arr]).subscribe((pokemons) => {
      this.pokemons.push(...pokemons);
      this.isLoading = false;
    })
  }

  getPrincipalType(list: any[]) {
    return list.filter(x => x.slot === 1)[0]?.type.name;
  }

  onDetail(pokemon: PokemonDetail): void {
    this.bottomSheet.open(PokemonDetailComponent, {
      data: {pokemon,classicMode: this.classicMode,pokemonService:this.pokemonService}
    })
  }

  onPlaySong(): void{
    if(this.firstClick){
      this.audio.src = "../../../assets/Theme.wav"
      this.audio.load();
      this.audio.volume = 0.3;
      this.audio.play();
      this.firstClick = false;
    }
    else{
      this.audio.pause();
      this.firstClick = true;
    }
  }


}
