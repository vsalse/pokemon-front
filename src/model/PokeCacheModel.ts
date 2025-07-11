// Este archivo fue renombrado de PokemonDetail.ts a PokeCacheModel.ts
export interface PokeCacheModel {
  id: number;
  name: string;
  imageList: string;
  typeList: string[];
  abilitiesList: string[];
  weight: number;
  height: number;
  species: {
    evolutionChainUrl: string;
    flavorText: string;
  };
  imageDetail: string;
} 