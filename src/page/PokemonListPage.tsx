import React, { useEffect, useState } from 'react';
import Spinner from './Spinner';
import { useNavigate, useSearchParams } from 'react-router-dom';

type Pokemon = {
  id: number;
  name: string;
  imageList: string;
  typeList: string[];
  abilitiesList: string[];
  weight: number;
};

const PokemonListPage: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [inputPage, setInputPage] = useState<string>('1');
  const [size, setSize] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1) - 1;

  useEffect(() => {
    setInputPage((page + 1).toString());
    // Guardar la última página visitada en sessionStorage
    sessionStorage.setItem('lastPokemonPage', (page + 1).toString());
  }, [page]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    fetch(`${apiUrl}/pokemon?page=${page}&size=${size}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener los Pokémon');
        return res.json();
      })
      .then((data: Pokemon[]) => setPokemons(data))
      .catch(err => setError(err.message))
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

  return (
    <div style={{
      maxWidth: 700,
      margin: '0 auto',
      padding: '1rem',
      background: 'var(--bg)',
      minHeight: '100vh',
      color: 'var(--text)',
      fontFamily: 'Inter, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      boxSizing: 'border-box',
    }}>
      <h1 style={{ textAlign: 'center', color: 'var(--accent)', letterSpacing: 1, margin: 0, marginBottom: '1.2rem' }}>Pokémon List</h1>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <label htmlFor="size-select" style={{ color: 'var(--text)' }}>Pokémon por página: </label>
        <select
          id="size-select"
          value={size}
          onChange={e => { setSize(Number(e.target.value)); setPageParam(0); }}
          disabled={loading}
          style={{
            background: 'var(--select-bg)',
            color: 'var(--select-text)',
            border: '1.5px solid var(--select-border)',
            borderRadius: 6,
            padding: '4px 12px',
            fontSize: 16,
            outline: 'none',
            transition: 'border 0.2s',
          }}
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>
      {error && <p style={{ color: '#ff4f4f', textAlign: 'center' }}>{error}</p>}
      <div style={{ position: 'relative', flex: 1, minHeight: 0, marginBottom: 24 }}>
        <div style={{
          height: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
          filter: loading ? 'blur(2px)' : 'none',
          pointerEvents: loading ? 'none' : 'auto',
          transition: 'filter 0.2s',
        }}>
          {pokemons.map((poke: Pokemon) => (
            <div
              key={poke.id}
              onClick={() => navigate(`/pokemon/${poke.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid var(--border)',
                borderRadius: 12,
                padding: 16,
                background: 'var(--card-bg)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                gap: 20,
                transition: 'transform 0.15s',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 20, minWidth: 120 }}>
                <h2 style={{ margin: '0 0 8px 0', textTransform: 'capitalize', color: 'var(--accent)', fontSize: 22, textAlign: 'center' }}>{poke.name}</h2>
                <div style={{
                  background: 'linear-gradient(90deg, #ffe082 0%, #fffde4 100%)',
                  borderRadius: 16,
                  border: '3px solid #e2b714',
                  boxShadow: '0 4px 24px rgba(226,183,20,0.18)',
                  padding: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 4,
                  minWidth: 110,
                  minHeight: 110,
                }}>
                  <img
                    src={poke.imageList}
                    alt={poke.name}
                    width={110}
                    height={110}
                    style={{ background: 'transparent', borderRadius: 8, display: 'block' }}
                  />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 15, margin: '4px 0' }}>
                  Tipos:
                  <ul style={{ color: '#ffd86b', margin: 0, paddingLeft: 20, listStyle: 'none' }}>
                    {poke.typeList.map((type, idx) => (
                      <li key={idx} style={{ paddingLeft: 0, marginBottom: 2 }}>• {type}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ fontSize: 15, margin: '4px 0' }}>
                  Habilidades:
                  <ul style={{ color: '#7ee787', margin: 0, paddingLeft: 20, listStyle: 'none' }}>
                    {poke.abilitiesList.map((ability, idx) => (
                      <li key={idx} style={{ paddingLeft: 0, marginBottom: 2 }}>• {ability}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ fontSize: 15, margin: '4px 0' }}>Peso: <span style={{ color: '#8ab4f8' }}>{poke.weight}</span></div>
              </div>
            </div>
          ))}
        </div>
        {loading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(24,28,32,0.45)',
            zIndex: 2,
          }}>
            <Spinner size={56} />
          </div>
        )}
      </div>
      <div style={{ marginTop: 32, display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
        <button
          onClick={handlePrev}
          disabled={page === 0 || loading}
          style={{
            background: page === 0 ? 'var(--button-disabled)' : 'var(--button-bg)',
            color: 'var(--button-text)',
            border: '1.5px solid var(--border)',
            borderRadius: 8,
            padding: '8px 20px',
            fontSize: 16,
            cursor: page === 0 ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s, border 0.2s',
            fontWeight: 500,
          }}
        >Anterior</button>
        <span style={{ alignSelf: 'center', fontSize: 16, color: 'var(--text)' }}>Página</span>
        <input
          type="number"
          min={1}
          value={inputPage}
          onChange={e => {
            setInputPage(e.target.value.replace(/^0+/, ''));
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              const val = Number(inputPage);
              if (!isNaN(val) && val > 0) setPageParam(val - 1);
            }
          }}
          disabled={loading}
          style={{
            width: 60,
            padding: '6px 8px',
            borderRadius: 6,
            border: '1.5px solid var(--border)',
            background: 'var(--card-bg)',
            color: 'var(--text)',
            fontSize: 16,
            textAlign: 'center',
            outline: 'none',
          }}
        />
        <span style={{ alignSelf: 'center', fontSize: 16, color: 'var(--text)' }}>/</span>
        <button
          onClick={handleNext}
          disabled={pokemons.length < size || loading}
          style={{
            background: pokemons.length < size ? 'var(--button-disabled)' : 'var(--button-bg)',
            color: 'var(--button-text)',
            border: '1.5px solid var(--border)',
            borderRadius: 8,
            padding: '8px 20px',
            fontSize: 16,
            cursor: pokemons.length < size ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s, border 0.2s',
            fontWeight: 500,
          }}
        >Siguiente</button>
      </div>
    </div>
  );
};

export default PokemonListPage; 