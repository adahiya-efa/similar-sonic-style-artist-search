import React from 'react';
import { SonicArtist } from '../types';

interface ArtistCardProps {
  artist: SonicArtist;
  index: number;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, index }) => {
  // Replace spaces with + for the verbatim search rules as requested
  const formattedName = artist.name.replace(/\s+/g, '+');
  
  // Strictly constructed links based on the provided logic
  const links = {
    // 1. [ 🏠 Official Channel ]: https://www.youtube.com/results?search_query="[ARTIST_NAME]"+official+artist+channel&sp=EgIQAg%3D%3D
    official: `https://www.youtube.com/results?search_query=%22${formattedName}%22+official+artist+channel&sp=EgIQAg%3D%3D`,
    
    // 2. [ 🔍 Search Music ]: https://www.youtube.com/results?search_query="[ARTIST_NAME]"+music&sp=CAMSAhAB
    search: `https://www.youtube.com/results?search_query=%22${formattedName}%22+music&sp=CAMSAhAB`,
    
    // 3. [ 🔀 Artist Mix ]: https://www.youtube.com/results?search_query=[ARTIST_NAME]+music&sp=EgQYAhAB
    mix: `https://www.youtube.com/results?search_query=${formattedName}+music&sp=EgQYAhAB`,
    
    // 4. [ 📂 Topic Channel ]: https://www.youtube.com/results?search_query=[ARTIST_NAME]+-+Topic+music
    topic: `https://www.youtube.com/results?search_query=${formattedName}+-+Topic+music`
  };

  return (
    <div className="group bg-gray-900/40 backdrop-blur-sm border border-gray-800 hover:border-blue-500/50 transition-all duration-300 p-6 rounded-xl relative overflow-hidden">
      {/* Background Index Number */}
      <div className="absolute top-0 right-0 p-4 text-4xl font-syncopate text-gray-800/30 group-hover:text-blue-500/20 transition-colors pointer-events-none select-none">
        {String(index + 1).padStart(2, '0')}
      </div>
      
      <div className="flex flex-col gap-4 relative z-10">
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

        <div className="grid grid-cols-2 gap-2 pt-2">
          <a
            href={links.official}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-blue-600 text-gray-200 hover:text-white text-xs font-bold rounded transition-all metallic-border"
          >
            <span>🏠 Official</span>
          </a>
          <a
            href={links.search}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-blue-600 text-gray-200 hover:text-white text-xs font-bold rounded transition-all metallic-border"
          >
            <span>🔍 Search</span>
          </a>
          <a
            href={links.mix}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-blue-600 text-gray-200 hover:text-white text-xs font-bold rounded transition-all metallic-border"
          >
            <span>🔀 Mix</span>
          </a>
          <a
            href={links.topic}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-blue-600 text-gray-200 hover:text-white text-xs font-bold rounded transition-all metallic-border"
          >
            <span>📂 Topic</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;