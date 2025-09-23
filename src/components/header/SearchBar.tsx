import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useStandardsSuggestions } from '../../hooks/useStandardsSuggestions';

export const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { suggestions, isLoading } = useStandardsSuggestions(query);

  const handleSubmitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;

    // Check if it's an exact standard code
    const standardCodeMatch = q.match(/^EC\d{4}$/i);
    if (standardCodeMatch) {
      navigate(`/estandares/${standardCodeMatch[0].toUpperCase()}`);
      setQuery("");
      return;
    }

    // Otherwise search by title
    if (suggestions.length > 0) {
      navigate(`/estandares/${suggestions[0].code}`);
    } else {
      navigate(`/estandares?q=${encodeURIComponent(q)}`);
    }
    setQuery("");
  };

  const handleSuggestionClick = (code: string) => {
    navigate(`/estandares/${code}`);
    setQuery("");
  };

  return (
    <div className="flex-1 max-w-2xl mx-8">
      <form onSubmit={handleSubmitSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca entre 1,845 estándares (código o título)"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background/70 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            data-analytics="nav_search_focus"
          />
        </div>

        {/* Search Suggestions */}
        {query && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                Buscando...
              </div>
            ) : suggestions.length > 0 ? (
              <div className="py-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.code}
                    onClick={() => handleSuggestionClick(suggestion.code)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted text-left"
                    data-analytics="nav_search_suggestion_click"
                  >
                    <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
                      {suggestion.code}
                    </span>
                    <span className="text-sm text-foreground">{suggestion.title}</span>
                  </button>
                ))}
              </div>
            ) : query.length > 2 ? (
              <div className="p-4 text-center text-muted-foreground">
                No se encontraron resultados
              </div>
            ) : null}
          </div>
        )}
      </form>
    </div>
  );
};
