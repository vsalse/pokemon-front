import React from 'react';
import Spinner from '../component/Spinner';
import ImageWithLoader from '../component/ImageWithLoader';
import Toast from '../component/Toast';
import { usePokemonList } from '../hook/usePokemonList';

const PokemonListPage: React.FC = () => {
  const {
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
  } = usePokemonList();

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24, minHeight: 600, position: 'relative' }}>
      <Toast message={error?.message || ''} severity={error?.severity} onClose={() => setError(null)} />
      <h1 style={{ textAlign: 'center', color: '#3b82f6', fontSize: 32, marginBottom: 24 }}>Lista de Pokemones</h1>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
        <label htmlFor="size-select">Pokemones por página: </label>
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
        <button
          onClick={handleClearCache}
          disabled={loading}
          style={{ marginLeft: 12, padding: '4px 16px', fontSize: 15, borderRadius: 6, background: '#e2b714', color: '#23272f', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px #0002' }}
        >
          Limpiar caché
        </button>
      </div>
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
        maxHeight: 520,
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
          max={totalPages}
          onChange={e => {
            setInputPage(e.target.value.replace(/^0+/, ''));
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              const val = Number(inputPage);
              if (!isNaN(val) && val > 0 && val <= totalPages) setPageParam(val - 1);
            }
          }}
          disabled={loading}
          style={{ width: 60, padding: '6px 8px', borderRadius: 6, border: '1.5px solid #888', background: '#181c20', color: '#fff', fontSize: 16, textAlign: 'center', outline: 'none' }}
        />
        <span style={{ alignSelf: 'center', fontSize: 16 }}>/ {totalPages}</span>
        <button
          onClick={handleNext}
          disabled={page + 1 >= totalPages || loading}
          style={{ padding: '8px 20px', borderRadius: 8, fontSize: 16, background: pokemons.length < size ? '#444' : '#3b82f6', color: '#fff', border: 'none', cursor: pokemons.length < size ? 'not-allowed' : 'pointer' }}
        >Siguiente</button>
      </div>
    </div>
  );
};

export default PokemonListPage; 