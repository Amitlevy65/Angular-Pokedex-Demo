export class PokemonDetail{
  id!: number;
  order!: number;
  name!: string;
  height!: number;
  abilities: Ability[];
  species!: Species[];
  types: Type[];
  weight!: number;
  sprites!: Sprite;
  stats!: Stat[];
  moves!: Move[];

  constructor(){
    this.abilities = [];
    this.types = [];
    this.moves = [];
  }
}

class Ability{
  ability!: {
    name: string;
  };

  constructor(){
  }
}

class Species{
  url!:string;
}

class Type{
  slot!: number;
  type!: {
    name: string;
  };
}

class Sprite{
  front_default!: string;
}

class Stat{
  base_stat!: number;
  stat!: {
    name: string;
  };
}

class Move{
  move!: {
    name: string;
  };

  constructor(){
  }
}

