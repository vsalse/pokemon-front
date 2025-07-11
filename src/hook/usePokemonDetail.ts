import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { PokeCacheModel } from '../model/PokeCacheModel';
import { PokeBasicModel } from '../model/PokeBasicModel';
import { PokeDetailModel } from '../model/PokeDetailModel';

export function usePokemonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pokemon, setPokemon] = useState<PokeCacheModel | null>(null);
  const [evolutionList, setEvolutionList] = useState<PokeBasicModel[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string, severity?: string } | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiRequest<PokeDetailModel>('get', `/pokemon/${id}`)
      .then((data) => {
        setPokemon(data.data);
        setEvolutionList(data.evolutionList);
      })
      .catch(err => setError({ message: err.message, severity: err.severity || 'error' }))
      .finally(() => setLoading(false));
  }, [id]);

  return {
    pokemon,
    evolutionList,
    loading,
    error,
    setError,
    navigate,
    searchParams,
    id,
  };
} 