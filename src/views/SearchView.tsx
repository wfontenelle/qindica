import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, ArrowRight, UserSearch, ArrowDownUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserCard } from '../components/UserCard';
import { POPULAR_TAGS } from '../data/seedData';
import { sortUsersByCriterion, SortOption } from '../utils/networkGraph';

interface SearchViewProps {
  initialQuery?: string;
}

export const SearchView: React.FC<SearchViewProps> = ({ initialQuery = '' }) => {
  const { users, networkStats, isAuthenticated, currentUser, userLocation } = useApp();
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<string | null>(
    initialQuery.trim() ? initialQuery.trim() : null
  );
  const [sortOption, setSortOption] = useState<SortOption>(
    isAuthenticated ? 'network_degree' : 'proximity'
  );

  // When user logs in or out, automatically enforce default sorting:
  // Logged in: Conexão -> Proximidade -> Estrelas ('network_degree')
  // Logged out: Proximidade -> Estrelas ('proximity')
  useEffect(() => {
    if (isAuthenticated) {
      setSortOption('network_degree');
    } else {
      setSortOption('proximity');
    }
  }, [isAuthenticated]);

  // Determine active reference location
  const referenceLocation = useMemo(() => {
    if (isAuthenticated && currentUser.latitude != null && currentUser.longitude != null) {
      return {
        latitude: currentUser.latitude,
        longitude: currentUser.longitude,
        city: currentUser.city,
        state: currentUser.state,
        neighborhood: currentUser.neighborhood,
        cep: currentUser.cep,
      };
    }
    return userLocation;
  }, [
    isAuthenticated,
    currentUser.latitude,
    currentUser.longitude,
    currentUser.city,
    currentUser.state,
    currentUser.neighborhood,
    currentUser.cep,
    userLocation,
  ]);

  // Dynamic tags pool merging seed popular tags and any custom tags created by users
  const allAvailableTags = useMemo(() => {
    const tagSet = new Set<string>();
    POPULAR_TAGS.forEach((t) => tagSet.add(t));
    users.forEach((u) => {
      if (Array.isArray(u.tags)) {
        u.tags.forEach((t) => tagSet.add(t));
      }
    });
    return Array.from(tagSet);
  }, [users]);

  // Suggestions while typing (matching names and all active tags)
  const suggestions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    const candidateUsers = isAuthenticated
      ? users.filter((u) => u.id !== currentUser.id)
      : users;

    const matchedNames = candidateUsers
      .filter((u) => u.name.toLowerCase().includes(trimmed))
      .map((u) => ({ type: 'user', label: u.name, value: u.name }));

    const matchedTags = allAvailableTags
      .filter((t) => t.toLowerCase().includes(trimmed))
      .map((t) => ({ type: 'tag', label: t, value: t }));

    const combined = [...matchedNames, ...matchedTags];
    // Deduplicate by label
    const unique = Array.from(new Map(combined.map((item) => [item.label, item])).values());
    return unique.slice(0, 8);
  }, [query, users, currentUser.id, isAuthenticated, allAvailableTags]);

  // Results matching activeFilter or query
  const searchResults = useMemo(() => {
    const candidateUsers = isAuthenticated
      ? users.filter((u) => u.id !== currentUser.id)
      : users;

    const term = (activeFilter || query).trim().toLowerCase();
    const matches = !term
      ? candidateUsers
      : candidateUsers.filter((u) => {
          const nameMatch = u.name.toLowerCase().includes(term);
          const bioMatch = u.bio.toLowerCase().includes(term);
          const tagMatch = u.tags.some((tag) => tag.toLowerCase().includes(term));
          const textMatch = u.presentationText.toLowerCase().includes(term);
          const net = networkStats.get(u.id);
          const degreeMatch = isAuthenticated && net?.degreeLabel
            ? net.degreeLabel.toLowerCase().includes(term)
            : false;
          return nameMatch || bioMatch || tagMatch || textMatch || degreeMatch;
        });

    // Apply sorting (Degree of connection only if logged in, or proximity/stars/time)
    const effectiveSort = (!isAuthenticated && sortOption === 'network_degree') ? 'proximity' : sortOption;
    return sortUsersByCriterion(matches, networkStats, effectiveSort, referenceLocation);
  }, [users, currentUser.id, activeFilter, query, networkStats, sortOption, isAuthenticated, referenceLocation]);

  const handleClear = () => {
    setQuery('');
    setActiveFilter(null);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      setActiveFilter(query.trim());
    }
  };

  const handleSelectSuggestion = (value: string) => {
    setQuery(value);
    setActiveFilter(value);
  };

  const handleRemoveFilter = () => {
    setActiveFilter(null);
    setQuery('');
  };

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Search Input Bar */}
      <div className="px-4 pt-4 pb-2">
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center w-full"
        >
          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!e.target.value) {
                setActiveFilter(null);
              }
            }}
            placeholder="Buscar por nome, tag ou especialidade..."
            className="w-full bg-white dark:bg-[#18181C] text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 pl-4 pr-20 py-2.5 rounded-lg shadow-xs border border-neutral-200 dark:border-neutral-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7B2FFF] focus:border-transparent transition-all"
            autoFocus
          />

          {/* Action Buttons inside Input */}
          <div className="absolute right-2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                id="search-clear-btn"
                onClick={handleClear}
                className="w-7 h-7 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Limpar busca"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            )}
            <button
              type="submit"
              id="search-submit-btn"
              className="w-8 h-8 rounded-md bg-[#7B2FFF] text-white flex items-center justify-center shadow-xs hover:bg-[#6A23E3] active:scale-95 transition-all cursor-pointer"
              aria-label="Pesquisar"
            >
              <Search size={15} strokeWidth={2.5} />
            </button>
          </div>
        </form>
      </div>

      {/* Autocomplete Suggestions (while typing and active filter not yet applied or query changing) */}
      {query.trim().length > 0 && suggestions.length > 0 && (!activeFilter || query !== activeFilter) && (
        <div className="px-4 py-2">
          <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
            Sugestões
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug) => (
              <button
                key={sug.label}
                id={`suggestion-${sug.label.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => handleSelectSuggestion(sug.value)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#7B2FFF] text-white text-xs font-semibold shadow-xs hover:bg-[#6A23E3] active:scale-95 transition-all cursor-pointer"
              >
                <span>{sug.label}</span>
                <ArrowRight size={13} strokeWidth={2.5} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Tags when search is empty */}
      {!query.trim() && !activeFilter && (
        <div className="px-4 py-2 mb-2">
          <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
            Tags em destaque & Especialidades
          </p>
          <div className="flex flex-wrap gap-1.5">
            {allAvailableTags.slice(0, 16).map((tag) => (
              <button
                key={tag}
                id={`popular-tag-${tag.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => handleSelectSuggestion(tag)}
                className="px-2.5 py-1 rounded-md bg-white dark:bg-[#18181C] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium hover:border-[#7B2FFF] dark:hover:border-[#7B2FFF] hover:text-[#7B2FFF] dark:hover:text-[#a068ff] active:scale-95 transition-all cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filter & Sorting Bar */}
      <div className="px-4 py-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 bg-white dark:bg-[#18181C] p-3 sm:p-3.5 rounded-lg border border-neutral-200/80 dark:border-neutral-800 shadow-xs transition-colors">
          <div className="flex items-center gap-2 flex-wrap">
            {activeFilter ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Filtrando por:</span>
                <div
                  id="active-filter-chip"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#7B2FFF] text-white text-xs font-semibold shadow-xs"
                >
                  <span>{activeFilter}</span>
                  <button
                    id="remove-filter-btn"
                    onClick={handleRemoveFilter}
                    className="p-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer"
                    aria-label="Remover filtro"
                  >
                    <X size={13} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ) : (
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Todos os profissionais
              </span>
            )}
            <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">
              · {searchResults.length} {searchResults.length === 1 ? 'perfil' : 'perfis'}
            </span>
          </div>

          {/* Sort Select */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label htmlFor="search-sort-select" className="text-xs font-bold text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5 shrink-0 cursor-pointer">
              <ArrowDownUp size={13} className="text-[#7B2FFF]" />
              <span>Ordenar:</span>
            </label>
            <select
              id="search-sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="w-full sm:w-auto text-xs font-semibold px-3 py-1.5 rounded-md bg-neutral-50 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/80 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF] cursor-pointer transition-all"
            >
              {isAuthenticated && (
                <option value="network_degree">Relação na Rede (Conexão ➔ Proximidade ➔ Estrelas)</option>
              )}
              <option value="proximity">Mais próximos (Geolocalização ➔ Estrelas)</option>
              <option value="stars_desc">Mais estrelas (Mais recomendados)</option>
              <option value="newest_first">Mais recentes</option>
              <option value="oldest_first">Mais tempo de plataforma</option>
              <option value="name_asc">Ordem alfabética (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Results Grid: max 6 columns on desktop */}
      <div className="w-full mt-2">
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {searchResults.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div className="py-16 px-4 text-center bg-white dark:bg-[#18181C] rounded-lg border border-neutral-200/80 dark:border-neutral-800 mx-1 mt-2 transition-colors">
            <UserSearch className="mx-auto text-neutral-400 dark:text-neutral-500 mb-2" size={42} />
            <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100">
              Nenhuma pessoa encontrada
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
              Tente buscar por outro termo, tag, habilidade ou remova o filtro atual.
            </p>
            <button
              onClick={handleClear}
              className="mt-4 px-4 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold transition-colors cursor-pointer"
            >
              Limpar busca
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
