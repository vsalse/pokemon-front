import { PokeCacheModel } from './PokeCacheModel';
import { PokeBasicModel } from './PokeBasicModel';

export interface PokeDetailModel {
  data: PokeCacheModel;
  evolutionList: PokeBasicModel[][];
} 