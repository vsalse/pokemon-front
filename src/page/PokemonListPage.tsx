import React, { useEffect, useState } from 'react';

type Pokemon = {
  id: number;
  name: string;
  frontDefault: string;
  typeList: string[];
  abilitiesList: string[];
  weight: number;
};

const PokemonListPage: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  const handlePrev = () => setPage(p => Math.max(0, p - 1));
  const handleNext = () => setPage(p => p + 1);

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: '1rem', background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)', fontFamily: 'Inter, Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: 'var(--accent)', letterSpacing: 1 }}>Pokémon List</h1>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <label htmlFor="size-select" style={{ color: 'var(--text)' }}>Pokémon por página: </label>
        <select
          id="size-select"
          value={size}
          onChange={e => { setSize(Number(e.target.value)); setPage(0); }}
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
          <option value={20}>20</option>
        </select>
      </div>
      {loading && <p style={{ color: 'var(--accent)', textAlign: 'center' }}>Cargando...</p>}
      {error && <p style={{ color: '#ff4f4f', textAlign: 'center' }}>{error}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {pokemons.map((poke: Pokemon) => (
          <div
            key={poke.id}
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
            }}
          >
            <img
              src={poke.frontDefault}
              alt={poke.name}
              width={80}
              height={80}
              style={{ marginRight: 20, background: '#222', borderRadius: 8, border: '2px solid var(--border)' }}
            />
            <div>
              <h2 style={{ margin: 0, textTransform: 'capitalize', color: 'var(--accent)', fontSize: 22 }}>{poke.name}</h2>
              <div style={{ fontSize: 15, margin: '4px 0' }}>Tipos: <span style={{ color: '#ffd86b' }}>{poke.typeList.join(', ')}</span></div>
              <div style={{ fontSize: 15, margin: '4px 0' }}>Habilidades: <span style={{ color: '#7ee787' }}>{poke.abilitiesList.join(', ')}</span></div>
              <div style={{ fontSize: 15, margin: '4px 0' }}>Peso: <span style={{ color: '#8ab4f8' }}>{poke.weight}</span></div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 32, display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button
          onClick={handlePrev}
          disabled={page === 0}
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
        <span style={{ alignSelf: 'center', fontSize: 16, color: 'var(--text)' }}>Página {page + 1}</span>
        <button
          onClick={handleNext}
          disabled={pokemons.length < size}
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