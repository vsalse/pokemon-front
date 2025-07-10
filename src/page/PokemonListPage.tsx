import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Spinner from './Spinner';
import ImageWithLoader from './ImageWithLoader';

interface Pokemon {
  id: number;
  name: string;
  imageList: string;
  typeList: string[];
  abilitiesList: string[];
  weight: number;
}

const PokemonListPage: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    fetch(`http://localhost:8080/pokemon?page=${page}&size=${size}`)
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
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24, minHeight: 600, position: 'relative' }}>
      <h1 style={{ textAlign: 'center', color: '#3b82f6', fontSize: 32, marginBottom: 24 }}>Pokémon List</h1>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
        <label htmlFor="size-select">Pokémon por página: </label>
        <select
          id="size-select"
          value={size}
          onChange={e => { setSize(Number(e.target.value)); setPageParam(0); }}
          disabled={loading}
          style={{ padding: '4px 12px', fontSize: 16, borderRadius: 6 }}
        >
          <option value={3}>3</option>
          <option value={6}>6</option>
          <option value={12}>12</option>
        </select>
      </div>
      {error && <p style={{ color: '#ff4f4f', textAlign: 'center' }}>{error}</p>}
      {/* Spinner centrado mientras loading */}
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
          background: 'rgba(24,28,32,0.85)',
          zIndex: 10,
        }}>
          <Spinner size={72} />
        </div>
      )}
      {/* Zona scrollable de la lista */}
      <div style={{
        maxHeight: 520, // margen extra para que no se corte la última tarjeta
        minHeight: 152,
        overflowY: 'auto',
        marginBottom: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        filter: loading ? 'blur(2px)' : 'none',
        pointerEvents: loading ? 'none' : 'auto',
        userSelect: loading ? 'none' : 'auto',
      }}>
        {pokemons.map(poke => (
          <div
            key={poke.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#23272f',
              borderRadius: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              padding: 16,
              gap: 18,
              cursor: 'pointer',
              transition: 'box-shadow 0.2s'
            }}
            onClick={() => navigate(`/pokemon/${poke.id}?page=${page+1}`)}
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter') navigate(`/pokemon/${poke.id}?page=${page+1}`); }}
            aria-label={`Ver detalle de ${poke.name}`}
          >
            <div style={{ width: 120, height: 120, background: '#fffde4', borderRadius: 16, border: '2px solid #e2b714', marginRight: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ImageWithLoader src={poke.imageList} alt={poke.name} width={120} height={120} style={{ borderRadius: 12 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#3b82f6', textTransform: 'capitalize', marginBottom: 4 }}>{poke.name}</div>
              <div style={{ fontSize: 15, marginBottom: 2 }}>
                <span style={{ fontWeight: 600 }}>Tipos:</span> {poke.typeList.map((type, idx) => (
                  <span key={idx} style={{ color: '#ffd86b', marginLeft: idx > 0 ? 8 : 4 }}>{type}</span>
                ))}
              </div>
              <div style={{ fontSize: 15, marginBottom: 2 }}>
                <span style={{ fontWeight: 600 }}>Habilidades:</span>
                <ul style={{ color: '#7ee787', margin: 0, paddingLeft: 20, listStyle: 'disc' }}>
                  {poke.abilitiesList.map((ab, idx) => (
                    <li key={idx}>{ab.replace(/\n/g, ' ')}</li>
                  ))}
                </ul>
              </div>
              <div style={{ fontSize: 15 }}>Peso: <span style={{ color: '#8ab4f8' }}>{poke.weight} kg</span></div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 32, display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', filter: loading ? 'blur(1px)' : 'none', pointerEvents: loading ? 'none' : 'auto', userSelect: loading ? 'none' : 'auto' }}>
        <button
          onClick={handlePrev}
          disabled={page === 0 || loading}
          style={{ padding: '8px 20px', borderRadius: 8, fontSize: 16, background: page === 0 ? '#444' : '#3b82f6', color: '#fff', border: 'none', cursor: page === 0 ? 'not-allowed' : 'pointer' }}
        >Anterior</button>
        <span style={{ alignSelf: 'center', fontSize: 16 }}>Página</span>
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
          style={{ width: 60, padding: '6px 8px', borderRadius: 6, border: '1.5px solid #888', background: '#181c20', color: '#fff', fontSize: 16, textAlign: 'center', outline: 'none' }}
        />
        <span style={{ alignSelf: 'center', fontSize: 16 }}>/</span>
        <button
          onClick={handleNext}
          disabled={pokemons.length < size || loading}
          style={{ padding: '8px 20px', borderRadius: 8, fontSize: 16, background: pokemons.length < size ? '#444' : '#3b82f6', color: '#fff', border: 'none', cursor: pokemons.length < size ? 'not-allowed' : 'pointer' }}
        >Siguiente</button>
      </div>
    </div>
  );
};

export default PokemonListPage; 