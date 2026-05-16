'use client';
// components/AddressAutocomplete.jsx
//
// Text input with debounced HERE Autosuggest dropdown. Used on the buyer
// homepage form and the agent /dashboard/upload form so the address field
// always gets a REAL geocodable address instead of a free-typed string
// like "Sample Report, WA" (which silently dropped tradies because HERE
// couldn't geocode it).
//
// Why server-proxy: the HERE_API_KEY is server-only. The /api/address-
// suggest route forwards the query and only returns label + lat/lng. Edge
// caches identical queries for 1 hour so repeat typing is free.

import { useEffect, useRef, useState } from 'react';

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,           // called with { label, position } when a suggestion is picked
  placeholder = 'e.g. 12 Smith Street, Yarraville VIC 3013',
  inputStyle,         // pass through any styling the parent form uses
  inputId,
  required = false,
  disabled = false,
}) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  // Suppress refetching the suggestion list when we programmatically set
  // the input to a value we already accepted from the dropdown.
  const justPickedRef = useRef(false);

  useEffect(() => {
    if (justPickedRef.current) {
      justPickedRef.current = false;
      return;
    }
    if (!value || value.length < 3) {
      setItems([]);
      setOpen(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      setLoading(true);
      try {
        const resp = await fetch(`/api/address-suggest?q=${encodeURIComponent(value)}`, {
          signal: abortRef.current.signal,
        });
        const data = await resp.json();
        setItems(data.items || []);
        setOpen((data.items || []).length > 0);
        setHighlight(-1);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('[autocomplete] fetch failed:', err.message);
        }
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [value]);

  // Close when clicking outside the wrapper.
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const pick = (item) => {
    justPickedRef.current = true;
    onChange(item.label);
    if (onSelect) onSelect({ label: item.label, position: item.position });
    setOpen(false);
    setItems([]);
  };

  const onKeyDown = (e) => {
    if (!open || items.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && highlight >= 0) {
      e.preventDefault();
      pick(items[highlight]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => items.length > 0 && setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        required={required}
        disabled={disabled}
        style={inputStyle}
      />
      {open && items.length > 0 && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 30,
            margin: 0,
            padding: 4,
            listStyle: 'none',
            background: 'white',
            border: '1px solid #d4d4d4',
            borderRadius: 8,
            boxShadow: '0 6px 24px rgba(10,22,40,0.10)',
            maxHeight: 280,
            overflowY: 'auto',
            fontSize: 14,
          }}
        >
          {items.map((item, idx) => (
            <li
              key={item.id}
              role="option"
              aria-selected={highlight === idx}
              onMouseDown={(e) => {
                // Use mousedown not click so the dropdown picks BEFORE the
                // input loses focus (focus loss would close the dropdown).
                e.preventDefault();
                pick(item);
              }}
              onMouseEnter={() => setHighlight(idx)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                borderRadius: 6,
                background: highlight === idx ? '#f6f3eb' : 'transparent',
                color: '#0a1628',
                lineHeight: 1.4,
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
