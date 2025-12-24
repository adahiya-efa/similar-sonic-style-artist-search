import React, { useState } from 'react';
import { SonicArtist } from '../types';

interface ArtistCardProps {
  artist: SonicArtist;
  index: number;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, index }) => {
  const [loadingLink, setLoadingLink] = useState<string | null>(null);

  // Use the AI-optimized "searchableName" (e.g. "Afterlife Tale of Us") to ensure unique results.
  const queryName = artist.searchableName || artist.name;
  
  // 1. YouTube Music Link (Primary)
  // Keeps it clean using just the searchable name or direct ID
  const ytmQuery = encodeURIComponent(queryName).replace(/%20/g, '+');
  const ytmUrl = (artist.youtubeChannelId && artist.youtubeChannelId.startsWith('UC'))
    ? `https://music.youtube.com/channel/${artist.youtubeChannelId}`
    : `https://music.youtube.com/search?q=${ytmQuery}`;

  // 2. Deep Dive Search Queries
  // MUST include [ARTIST_NAME] + [SUB_GENRE] + music as per requirements to ensure specificity in main YouTube search.
  const deepDiveQueryRaw = `"${queryName}" ${artist.subGenre} music`;
  const deepDiveQuery = encodeURIComponent(deepDiveQueryRaw).replace(/%20/g, '+');
  
  const links = {
    // 🏠 Channel: Filter for channels
    channel: `https://www.youtube.com/results?search_query=${deepDiveQuery}&sp=EgIQAg%3D%3D`,

    // 🔍 Popular: Sort by view count
    popular: `https://www.youtube.com/results?search_query=${deepDiveQuery}&sp=CAMSAhAB`,

    // 🕙 Chronological: Sort by upload date
    recent: `https://www.youtube.com/results?search_query=${deepDiveQuery}&sp=CAISAhAB`,

    // 🔀 Mix: Search for playlists/mixes
    mix: `https://www.youtube.com/results?search_query=${deepDiveQuery}&sp=EgQYAhAB`
  };

  const handleLinkClick = (key: string) => {
    setLoadingLink(key);
    // Simulate a brief "loading" state for visual feedback
    setTimeout(() => setLoadingLink(null), 1000);
  };

  const Spinner = () => (
    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  );

  return (
    <div className="group bg-gray-900/40 backdrop-blur-sm border border-gray-800 hover:border-blue-500/50 transition-all duration-300 p-6 rounded-xl relative overflow-hidden flex flex-col h-full">
      {/* Background Index Number */}
      <div className="absolute top-0 right-0 p-4 text-4xl font-syncopate text-gray-800/30 group-hover:text-blue-500/20 transition-colors pointer-events-none select-none">
        {String(index + 1).padStart(2, '0')}
      </div>
      
      <div className="flex flex-col gap-4 relative z-10 flex-grow">
        <div>
          <h3 className="text-2xl font-syncopate font-bold text-gray-100 mb-1 group-hover:text-blue-400 transition-colors">
            {artist.name}
          </h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 bg-blue-900/30 text-blue-400 border border-blue-800 rounded uppercase tracking-wider font-semibold">
              {artist.genre}
            </span>
            <span className="px-2 py-1 bg-gray-800 text-gray-400 border border-gray-700 rounded uppercase tracking-wider font-semibold">
              {artist.subGenre}
            </span>
          </div>
        </div>

        <div className="space-y-3 flex-grow">
          <div>
            <span className="text-xs uppercase text-blue-500 font-bold block mb-1">Sonic Style</span>
            <p className="text-gray-400 text-sm leading-relaxed">
              {artist.style}
            </p>
          </div>
          <div>
            <span className="text-xs uppercase text-blue-500 font-bold block mb-1">Sonic Similarities</span>
            <p className="text-gray-300 text-sm leading-relaxed">
              {artist.nuancedSimilarities}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 mt-auto space-y-3">
          {/* Primary Action: YouTube Music */}
          <a
            href={ytmUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick('ytm')}
            className="flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-syncopate font-bold text-xs tracking-widest rounded-lg transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 group/btn metallic-border w-full h-[42px]"
          >
            {loadingLink === 'ytm' ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>YOUTUBE MUSIC</span>
                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </a>
          
          {/* Secondary Actions: Deep Dive Grid */}
          <div className="grid grid-cols-2 gap-2">
            <a 
              href={links.channel} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => handleLinkClick('channel')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded border border-gray-700 hover:border-gray-500 transition-all h-[34px]"
            >
               {loadingLink === 'channel' ? <Spinner /> : <span>🏠 YouTube</span>}
            </a>
            <a 
              href={links.popular} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => handleLinkClick('popular')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded border border-gray-700 hover:border-gray-500 transition-all h-[34px]"
            >
               {loadingLink === 'popular' ? <Spinner /> : <span>🔍 Popular YT</span>}
            </a>
            <a 
              href={links.recent} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => handleLinkClick('recent')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded border border-gray-700 hover:border-gray-500 transition-all h-[34px]"
            >
               {loadingLink === 'recent' ? <Spinner /> : <span>🕙 Recent YT</span>}
            </a>
            <a 
              href={links.mix} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => handleLinkClick('mix')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded border border-gray-700 hover:border-gray-500 transition-all h-[34px]"
            >
               {loadingLink === 'mix' ? <Spinner /> : <span>🔀 Mix YT</span>}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;