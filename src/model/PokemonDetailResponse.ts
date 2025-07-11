import { PokeCacheModel } from './PokeCacheModel';
import { PokeBasicModel } from './PokeBasicModel';

export interface PokemonDetailResponse {
  data: PokeCacheModel;
  evolutionList: PokeBasicModel[][];
} 