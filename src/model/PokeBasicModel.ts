/**
 * Modelo básico de Pokemon, usado para la lista y evoluciones.
 */
export interface PokeBasicModel {
  id: number;
  name: string;
  imageList: string;
  typeList: string[];
  abilitiesList: string[];
  weight: number;
} 