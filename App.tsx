import React, { useState } from 'react';
import { analyzeSonicStyle } from './services/geminiService';
import { SearchResult, SearchMode } from './types';
import ArtistCard from './components/ArtistCard';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('STRICT');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await analyzeSonicStyle(query, mode);
      setResults(data);
    } catch (err) {
      setError('The Sonic DNA Engine failed to scan the input. Please ensure API key is valid and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 selection:bg-blue-600 selection:text-white pb-20">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center blue-glow">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h1 className="font-syncopate font-bold text-sm tracking-widest silver-gradient hidden sm:block">
              SIMILAR SONIC STYLE SEARCH
            </h1>
          </div>
          <div className="text-[10px] font-bold tracking-widest text-blue-500 uppercase">
            v1.2 • Enhanced Precision
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Search Hero */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-syncopate font-bold mb-6 silver-gradient leading-tight">
            SCAN SONIC DNA
          </h2>
          
          <div className="flex flex-col items-center gap-8 max-w-3xl mx-auto">
            {/* Mode Toggle */}
            <div className="flex items-center p-1 bg-gray-900 border border-gray-800 rounded-full w-full max-w-sm">
              <button
                onClick={() => setMode('STRICT')}
                className={`flex-1 px-4 py-2 rounded-full text-[10px] font-syncopate font-bold transition-all tracking-wider ${
                  mode === 'STRICT' ? 'bg-blue-600 text-white blue-glow' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                STRICT PRECISION
              </button>
              <button
                onClick={() => setMode('DISCOVERY')}
                className={`flex-1 px-4 py-2 rounded-full text-[10px] font-syncopate font-bold transition-all tracking-wider ${
                  mode === 'DISCOVERY' ? 'bg-blue-600 text-white blue-glow' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                SONIC DISCOVERY
              </button>
            </div>
            
            <p className="text-gray-400 text-sm italic min-h-[1.25rem]">
              {mode === 'STRICT' 
                ? 'Surgical Lock: Restricted to clones within the exact same sub-genre category.' 
                : 'Thematic Roam: Matches production signature across adjacent musical territories.'}
            </p>

            <form onSubmit={handleSearch} className="w-full relative group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Artist, Song, or YouTube Link..."
                className="w-full bg-gray-900 border-2 border-gray-800 focus:border-blue-600 focus:ring-0 text-white px-6 py-5 rounded-2xl text-lg outline-none transition-all placeholder:text-gray-600 group-hover:border-gray-700 shadow-2xl"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 px-8 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white font-syncopate font-bold text-xs tracking-widest rounded-xl transition-all active:scale-95 flex items-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ANALYZING
                  </span>
                ) : (
                  'INITIATE SCAN'
                )}
              </button>
            </form>
            {error && <p className="text-red-500 text-sm font-medium animate-pulse">{error}</p>}
          </div>
        </section>

        {/* Results Area */}
        {results ? (
          <div className="space-y-12 animate-[fadeIn_0.7s_ease-out]">
            {/* Analysis Header */}
            <div className="bg-gray-900/60 border border-gray-800 p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 border rounded ${
                    results.inputAnalysis.modeUsed === 'STRICT' ? 'text-blue-500 border-blue-500/30' : 'text-silver-400 border-gray-700'
                  }`}>
                    {results.inputAnalysis.modeUsed} LOCK
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Input DNA Scan</span>
                </div>
                <h3 className="text-3xl font-syncopate font-bold text-gray-100 uppercase">{results.inputAnalysis.artistOrSong}</h3>
                <p className="text-blue-400 font-semibold mt-1 uppercase tracking-wider text-sm">
                  {results.inputAnalysis.modeUsed === 'STRICT' ? 'Target Category: ' : ''}
                  {results.inputAnalysis.detectedGenre}
                </p>
              </div>
              <div className="flex-1 md:max-w-md border-l border-gray-800 pl-6 hidden md:block">
                <p className="text-sm text-gray-400 leading-relaxed italic">
                  "{results.inputAnalysis.sonicSignature}"
                </p>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.recommendations.map((artist, idx) => (
                <ArtistCard key={artist.name + idx} artist={artist} index={idx} />
              ))}
            </div>
            
            <footer className="text-center py-12 border-t border-gray-800/50">
              <p className="text-gray-600 text-xs font-syncopate tracking-widest">
                PRECISION SONIC MATCHING SYSTEM • PROCESSED VIA GEMINI
              </p>
            </footer>
          </div>
        ) : !loading && (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
             <svg className="w-24 h-24 text-gray-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
             </svg>
             <p className="font-syncopate tracking-[0.2em] text-sm text-center">AWAITING SONIC FREQUENCIES</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;