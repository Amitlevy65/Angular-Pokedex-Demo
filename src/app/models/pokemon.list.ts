export class PokemonList{
  name: string;
  url: string;
  sprite! :Sprite;


  constructor(){
    this.name = '';
    this.url = '';
  }
}

class Sprite{
  front_default!: string;
}
