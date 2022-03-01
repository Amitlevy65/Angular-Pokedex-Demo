import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PokemonList } from '../models/pokemon.list';
import { PokemonDetail } from '../models/pokemon.detail';
import { map } from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class PokemonService {
  private baseUrl = 'http://pokeapi.co/api/v2/';

  constructor(private http: HttpClient) { }

  getPokemonList(offset:number,limit:number = 900): Observable<PokemonList[]>{
    return this.http.get<PokemonList[]>(this.baseUrl + 'pokemon?offset=' + offset + '&limit=' + limit).pipe(
      map((x: any) => x.results)
    );
  }

  getPokemonDetail(pokemon: number | string): Observable<any>{
    return this.http.get<PokemonDetail>(this.baseUrl + 'pokemon/' + pokemon);
  }

  getPokemonSpecies(pokemon: number): Observable<any>{
    return this.http.get<any>(this.baseUrl + 'pokemon-species/' + pokemon );
  }

  getEvolutionUrl(url: string): Observable<any>{
    return this.http.get<any>(url);
  }

  getChainSpecies(url:string): Observable<any>{
    return this.http.get<any>(url);
  }

  getLocationEncounters(pokemon: number): Observable<any>{
    return this.http.get<any>(this.baseUrl + 'pokemon/' + pokemon + '/encounters');
  }
}
