import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { PokeBasicModel } from '../model/PokeBasicModel';
import { PokeListModel } from '../model/PokeListModel';

export function usePokemonList() {
  const [pokemons, setPokemons] = useState<PokeBasicModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string, severity?: string } | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1) - 1;
  const [size, setSize] = useState<number>(3);
  const [inputPage, setInputPage] = useState<string>((page + 1).toString());
  const navigate = useNavigate();

  useEffect(() => {
    setInputPage((page + 1).toString());
  }, [page]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiRequest<PokeListModel>('get', `/pokemon`, { params: { page, size } })
      .then((data) => {
        setPokemons(data.list);
        setTotalCount(data.recordCount);
      })
      .catch(err => setError({ message: err.message, severity: err.severity || 'error' }))
      .finally(() => setLoading(false));
  }, [page, size]);

  const setPageParam = (newPage: number) => {
    setSearchParams(params => {
      params.set('page', (newPage + 1).toString());
      return params;
    });
  };
  const handlePrev = () => setPageParam(Math.max(0, page - 1));
  const handleNext = () => setPageParam(page + 1);

  const totalPages = Math.max(1, Math.ceil(totalCount / size));

  const handleClearCache = async () => {
    try {
      await apiRequest('get', '/pokemon/clear-cache');
      setError({ message: 'Se limpió satisfactoriamente el cache', severity: 'success' });
    } catch (err) {
      let msg = 'Error al limpiar el cache';
      let severity = 'error';
      if (err && typeof err === 'object') {
        if ('message' in err && typeof (err as any).message === 'string') msg = (err as any).message;
        if ('severity' in err && typeof (err as any).severity === 'string') severity = (err as any).severity;
      }
      setError({ message: msg, severity });
    }
  };

  return {
    pokemons,
    totalCount,
    loading,
    error,
    setError,
    page,
    size,
    setSize,
    inputPage,
    setInputPage,
    totalPages,
    handlePrev,
    handleNext,
    setPageParam,
    handleClearCache,
    navigate,
    searchParams,
  };
} 