import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheet, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { PokemonService } from 'src/app/services/pokemon.service';
import { PokemonDetail } from '../../models/pokemon.detail';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.sass']
})
export class PokemonDetailComponent implements OnInit {

  pokemon: PokemonDetail;
  classicMode: boolean;
  evolution_chain!: any;
  chain!: any;
  chainOrder = new Array<PokemonDetail>();
  evolutionUrl!: string;
  locations = new Map<string,Array<string>>();

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private pokemonService: PokemonService, private snackBar: MatSnackBar,private _http:HttpClient,private bottomSheet: MatBottomSheet) {
    this.pokemon = data.pokemon;
    this.classicMode = data.classicMode;
  }

  ngOnInit(){
    this.getChainIds(this.pokemon.id);
    this.getVersionsAndEncounters(this.pokemon.id);
  }

  getMoves(): string {
    return this.pokemon.moves.map(x => x.move.name).join(' , ');
  }

  getAbilities(): string {
    return this.pokemon.abilities.map(x => x.ability.name).join(', ');
  }

  getPrincipalType(list: any[]) {
    return list.filter(x => x.slot === 1)[0]?.type.name;
  }

  async getVersionsAndEncounters(pokemon:number){
    let outer = 0;
    let inner = 0;
    let area;
    let encounters = await this.pokemonService.getLocationEncounters(pokemon).toPromise();

    while(outer < encounters.length){
      let games = new Array<string>();
      area = encounters[outer].location_area.name;
      while(inner < encounters[outer].version_details.length){
        games.push(encounters[outer].version_details[inner].version.name);
        inner++;
      }
      this.locations.set(area,games);
      outer++;
      inner = 0;
    }
  }

  async getChainIds(pokemon: number){
    let order = [];
    let temp;
    let next;
    let id = 0;
    let species = await this.pokemonService.getPokemonSpecies(pokemon).toPromise();
    this.evolutionUrl = species.evolution_chain.url;
    this.evolution_chain = await this.pokemonService.getEvolutionUrl(this.evolutionUrl).toPromise();
    this.chain = this.evolution_chain.chain;
    species = await this.pokemonService.getChainSpecies(this.chain.species.url).toPromise();
    id = species.id;
    let detail = await this.pokemonService.getPokemonDetail(id).toPromise();
    order.push(detail);
    temp = this.chain.evolves_to;
    next = temp[0];

    while(temp.length > 0){
      temp = next.evolves_to;
      species = await this.pokemonService.getChainSpecies(next.species.url).toPromise();
      id = species.id;
      detail = await this.pokemonService.getPokemonDetail(id).toPromise();
      order.push(detail);
      next = temp[0];
    }
    order.map((detail : PokemonDetail) => {this.chainOrder.push(detail)});
  }

  onDetail(pokemon: PokemonDetail): void {
    this.bottomSheet.open(PokemonDetailComponent, {
      data: {pokemon,classicMode: this.classicMode,pokemonService:this.pokemonService}
    })
  }







}



