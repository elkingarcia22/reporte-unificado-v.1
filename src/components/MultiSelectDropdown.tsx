import React, { useRef, useEffect, useState } from 'react';

interface MultiSelectDropdownProps {
  label: string;
  items: Array<{ id: string | number; name: string; initials?: string }>;
  selected: string[];
  onSelect: (items: string[]) => void;
  placeholder?: string;
  error?: boolean;
  maxDisplayCount?: number;
}

export function MultiSelectDropdown({
  label,
  items,
  selected,
  onSelect,
  placeholder = 'Buscar...',
  error = false,
  maxDisplayCount = 5
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayCount = selected.length > maxDisplayCount
    ? `${maxDisplayCount}+`
    : selected.length;

  const toggleItem = (itemName: string) => {
    if (selected.includes(itemName)) {
      onSelect(selected.filter(item => item !== itemName));
    } else {
      onSelect([...selected, itemName]);
    }
  };

  const toggleSelectAll = () => {
    if (selected.length === items.length) {
      onSelect([]);
    } else {
      onSelect(items.map(item => item.name));
    }
  };

  const clearSelection = () => {
    onSelect([]);
    setSearchTerm('');
  };

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="mb-6 relative" ref={containerRef}>
      <label className="block font-['Helvetica_Now_Text_:Bold',sans-serif] text-[#303A47] text-xs mb-2 uppercase tracking-wide">
        {label}
      </label>

      <div className="relative">
        {/* Input principal que muestra los items seleccionados */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 border rounded-lg text-left flex items-center justify-between transition-all ${
            error ? 'border-[#D92D20]' : 'border-[#D0D2D5]'
          } ${isOpen ? 'border-[#0C5BEF] ring-1 ring-[#0C5BEF]' : ''} bg-white hover:border-[#0C5BEF]`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selected.length === 0 ? (
              <span className="font-['Noto_Sans:Regular',sans-serif] text-sm text-[#5C646F]">
                {placeholder}
              </span>
            ) : (
              <div className="flex items-center gap-1.5 flex-1 min-w-0 flex-wrap">
                {selected.slice(0, maxDisplayCount).map((item) => (
                  <div
                    key={item}
                    className="inline-flex items-center gap-1.5 bg-[#E7F0FF] border border-[#0C5BEF] rounded-full px-3 py-1.5 text-xs font-['Noto_Sans:Regular',sans-serif] text-[#303A47] flex-shrink-0"
                  >
                    <span className="truncate">{item}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(selected.filter(s => s !== item));
                      }}
                      className="flex-shrink-0 text-[#0C5BEF] hover:text-[#0A4BB8] transition-colors ml-0.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </div>
                ))}
                {selected.length > maxDisplayCount && (
                  <span className="inline-flex items-center bg-[#E7F0FF] border border-[#0C5BEF] rounded-full px-3 py-1.5 text-xs font-['Noto_Sans:Regular',sans-serif] text-[#303A47] flex-shrink-0">
                    +{selected.length - maxDisplayCount}
                  </span>
                )}
              </div>
            )}
          </div>
          <svg
            className={`w-5 h-5 text-[#303A47] transition-transform flex-shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#D0D2D5] rounded-lg shadow-xl z-[9999] overflow-hidden">
            {/* Búsqueda */}
            <div className="p-3 border-b border-[#D0D2D5]">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C646F]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#D0D2D5] rounded-lg font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47] placeholder-[#5C646F] focus:outline-none focus:border-[#0C5BEF] focus:ring-1 focus:ring-[#0C5BEF]"
                />
              </div>
            </div>

            {/* Select All */}
            <button
              type="button"
              onClick={toggleSelectAll}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F3F3F4] border-b border-[#D0D2D5] transition-colors"
            >
              <div className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                selected.length === items.length
                  ? 'bg-[#0C5BEF] border-[#0C5BEF]'
                  : 'border-[#D0D2D5]'
              }`}>
                {selected.length === items.length && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                )}
              </div>
              <span className="font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47]">
                (Select All)
              </span>
            </button>

            {/* Opciones */}
            <div className="max-h-60 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="px-4 py-3 text-center font-['Noto_Sans:Regular',sans-serif] text-sm text-[#5C646F]">
                  No options found
                </div>
              ) : (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleItem(item.name)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F3F3F4] transition-colors text-left"
                  >
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                      selected.includes(item.name)
                        ? 'bg-[#0C5BEF] border-[#0C5BEF]'
                        : 'border-[#D0D2D5]'
                    }`}>
                      {selected.includes(item.name) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      )}
                    </div>
                    {item.initials && (
                      <div className="w-8 h-8 rounded-full bg-[#0C5BEF] flex items-center justify-center flex-shrink-0">
                        <p className="font-['Open_Sans:Bold',sans-serif] font-bold text-white text-xs">
                          {item.initials}
                        </p>
                      </div>
                    )}
                    <span className="font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47] flex-1 truncate">
                      {item.name}
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2 px-4 py-3 border-t border-[#D0D2D5] bg-[#FAFBFC]">
              <button
                type="button"
                onClick={clearSelection}
                className="flex-1 px-3 py-2 border border-[#D0D2D5] rounded-lg font-['Noto_Sans:Regular',sans-serif] text-sm text-[#303A47] hover:bg-[#F3F3F4] transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-2 bg-[#0C5BEF] text-white rounded-lg font-['Noto_Sans:Regular',sans-serif] text-sm hover:bg-[#0A4BB8] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-[#D92D20] text-xs mt-1 font-['Noto_Sans:Regular',sans-serif]">
          Por favor selecciona al menos una opción.
        </p>
      )}
    </div>
  );
}
