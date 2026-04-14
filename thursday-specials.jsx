import React, { useState, useMemo, useEffect, useRef } from 'react';

const venues = [
  { id: 1, name: "East Village Hotel", suburb: "Darlinghurst", lat: -33.8776, lng: 151.2166, rating: 4.2, specials: [{ item: "Wings", price: 1, type: "wings" }, { item: "Rump Steak", price: 20, type: "steak" }, { item: "Schnitty", price: 15, type: "schnitty" }, { item: "Parmi", price: 21, type: "parmi" }] },
  { id: 2, name: "Imperial Hotel", suburb: "Paddington", lat: -33.8849, lng: 151.2272, rating: 4.0, specials: [{ item: "Schnitty", price: 15, type: "schnitty" }] },
  { id: 3, name: "Bar Cleveland", suburb: "Redfern", lat: -33.8919, lng: 151.2141, rating: 4.2, specials: [{ item: "Schnitty", price: 17, type: "schnitty" }] },
  { id: 4, name: "Lord Dudley", suburb: "Woollahra", lat: -33.8848, lng: 151.2374, rating: 4.2, specials: [{ item: "Pot Pie", price: 18, type: "other" }] },
  { id: 5, name: "Light Brigade", suburb: "Woollahra", lat: -33.8885, lng: 151.2322, rating: 4.0, specials: [{ item: "Pizza", price: 18, type: "pizza" }] },
  { id: 6, name: "Lord Roberts", suburb: "Darlinghurst", lat: -33.8756, lng: 151.2152, rating: 4.2, specials: [{ item: "Fish & Chips", price: 18, type: "seafood" }] },
  { id: 7, name: "Royal Hotel", suburb: "Paddington", lat: -33.8824, lng: 151.2285, rating: 4.1, specials: [{ item: "Schnitty", price: 18, type: "schnitty" }, { item: "Parmi", price: 20, type: "parmi" }] },
  { id: 8, name: "Bat & Ball", suburb: "Redfern", lat: -33.8923, lng: 151.2165, rating: 4.3, specials: [{ item: "Steak", price: 20, type: "steak" }] },
  { id: 9, name: "Woollahra Hotel", suburb: "Woollahra", lat: -33.8883, lng: 151.2369, rating: 4.2, specials: [{ item: "Burgers", price: 20, type: "burger" }] },
  { id: 10, name: "The Carrington", suburb: "Surry Hills", lat: -33.8877, lng: 151.2152, rating: 4.4, specials: [{ item: "Pasta", price: 20, type: "pasta" }] },
  { id: 11, name: "Bellevue Hotel", suburb: "Paddington", lat: -33.8855, lng: 151.2353, rating: 4.1, specials: [{ item: "Burgers", price: 22, type: "burger" }] },
  { id: 12, name: "The London", suburb: "Paddington", lat: -33.8852, lng: 151.2300, rating: 4.1, specials: [{ item: "Steak", price: 22, type: "steak" }] },
  { id: 13, name: "Four in Hand", suburb: "Paddington", lat: -33.8838, lng: 151.2344, rating: 4.1, specials: [{ item: "Belgian Mussels", price: 22, type: "seafood" }] },
  { id: 14, name: "The Waratah", suburb: "Darlinghurst", lat: -33.8782, lng: 151.2213, rating: 4.5, specials: [{ item: "Steak", price: 28, type: "steak" }] },
  { id: 15, name: "The Clock", suburb: "Surry Hills", lat: -33.8863, lng: 151.2140, rating: 4.2, specials: [{ item: "Hawkes Jugs", price: 18, type: "other" }] },
  { id: 16, name: "Nelson Hotel", suburb: "Bondi Junction", lat: -33.8903, lng: 151.2433, rating: 4.4, specials: [{ item: "Curry", price: 25, type: "other" }] },
  { id: 17, name: "Woolly Bay Hotel", suburb: "Woolloomooloo", lat: -33.8691, lng: 151.2195, rating: 3.9, specials: [{ item: "Steak", price: 25, type: "steak" }, { item: "Fish & Chips", price: 20, type: "seafood" }, { item: "Schnitty", price: 20, type: "schnitty" }] },
  { id: 18, name: "Beach Road Hotel", suburb: "Bondi Beach", lat: -33.8864, lng: 151.2727, rating: 3.8, specials: [{ item: "Schnitty", price: 20, type: "schnitty" }, { item: "Parmi", price: 25, type: "parmi" }] },
  { id: 19, name: "East Sydney Hotel", suburb: "Woolloomooloo", lat: -33.8725, lng: 151.2168, rating: 4.4, specials: [{ item: "Burger & Beer", price: 25, type: "burger" }] },
];

const SUBURBS = ["All", "Darlinghurst", "Paddington", "Woollahra", "Redfern", "Surry Hills", "Woolloomooloo", "Bondi Junction", "Bondi Beach"];
const TYPES = [
  { key: "all", label: "All" },
  { key: "steak", label: "Steak" },
  { key: "schnitty", label: "Schnitty" },
  { key: "parmi", label: "Parmi" },
  { key: "burger", label: "Burger" },
  { key: "pizza", label: "Pizza" },
  { key: "pasta", label: "Pasta" },
  { key: "seafood", label: "Seafood" },
  { key: "wings", label: "Wings" },
  { key: "other", label: "Other" },
];

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

export default function App() {
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [suburbFilter, setSuburbFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const filtered = useMemo(() => {
    return venues.filter(v => {
      const matchSuburb = suburbFilter === 'All' || v.suburb === suburbFilter;
      const matchType = typeFilter === 'all' || v.specials.some(s => s.type === typeFilter);
      return matchSuburb && matchType;
    }).sort((a, b) => Math.min(...a.specials.map(s => s.price)) - Math.min(...b.specials.map(s => s.price)));
  }, [suburbFilter, typeFilter]);

  const openMaps = (venue) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name + ' ' + venue.suburb + ' Sydney')}`, '_blank');
  };

  const MapView = ({ height, venues: filteredVenues, selected, setSelected, openMaps, isMobile }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const [mapReady, setMapReady] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      if (!mapRef.current) return;
      
      // Load Leaflet CSS
      const cssId = 'leaflet-css-cdn';
      if (!document.getElementById(cssId)) {
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        document.head.appendChild(link);
      }

      // Load Leaflet JS
      const scriptId = 'leaflet-js-cdn';
      if (!document.getElementById(scriptId) && !window.L) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
        script.onload = () => {
          initializeMap();
        };
        script.onerror = () => setError('Failed to load map');
        document.head.appendChild(script);
      } else if (window.L) {
        initializeMap();
      }

      function initializeMap() {
        if (!window.L || !mapRef.current) return;
        
        try {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
          }

          const map = window.L.map(mapRef.current).setView([-33.884, 151.226], 15);
          
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
          }).addTo(map);

          mapInstanceRef.current = map;
          setMapReady(true);
        } catch (e) {
          setError('Map error');
        }
      }

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }, []);

    // Update markers
    useEffect(() => {
      if (!mapReady || !mapInstanceRef.current || !window.L) return;
      
      const map = mapInstanceRef.current;
      
      markersRef.current.forEach(m => map.removeLayer(m));
      markersRef.current = [];

      filteredVenues.forEach(venue => {
        const minPrice = Math.min(...venue.specials.map(s => s.price));
        const isSelected = selected?.id === venue.id;

        const icon = window.L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            background:${isSelected ? '#1a1a1a' : '#fff'};
            color:${isSelected ? '#fff' : '#1a1a1a'};
            padding:6px 12px;
            border-radius:20px;
            font-weight:600;
            font-size:13px;
            font-family:Inter,-apple-system,sans-serif;
            box-shadow:0 2px 8px rgba(0,0,0,0.2);
            border:2px solid #fff;
            white-space:nowrap;
          ">$${minPrice}</div>`,
          iconSize: [60, 30],
          iconAnchor: [30, 15],
        });

        const marker = window.L.marker([venue.lat, venue.lng], { icon }).addTo(map);
        marker.on('click', () => setSelected(isSelected ? null : venue));
        markersRef.current.push(marker);
      });

      if (filteredVenues.length > 0 && !selected) {
        const bounds = window.L.latLngBounds(filteredVenues.map(v => [v.lat, v.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }, [mapReady, filteredVenues, selected, setSelected]);

    if (error) {
      return (
        <div style={{ height, background: '#f5f5f5', borderRadius: isMobile ? 0 : 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#666' }}>{error}</span>
        </div>
      );
    }

    return (
      <div style={{ height, position: 'relative', borderRadius: isMobile ? 0 : 16, overflow: 'hidden' }}>
        <style>{`
          .custom-marker{background:none!important;border:none!important}
          .leaflet-control-attribution{font-size:10px!important}
        `}</style>
        
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        
        {!mapReady && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}>
            <span style={{ color: '#666', fontSize: 14 }}>Loading map...</span>
          </div>
        )}
        
        {selected && (
          <div style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            right: 12,
            background: 'white',
            borderRadius: 14,
            padding: 14,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            zIndex: 1000
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <h3 style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 600 }}>{selected.name}</h3>
                <p style={{ margin: 0, fontSize: 12, color: '#666' }}>{selected.suburb} · ★ {selected.rating.toFixed(1)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setSelected(null); }}
                style={{ width: 26, height: 26, borderRadius: 13, border: 'none', background: '#f0f0f0', cursor: 'pointer', fontSize: 13 }}
              >✕</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
              {selected.specials.map((s, i) => (
                <span key={i} style={{ background: '#f5f5f5', padding: '3px 8px', borderRadius: 5, fontSize: 12, color: '#1a1a1a' }}>
                  <strong>${s.price}</strong> {s.item}
                </span>
              ))}
            </div>
            <button
              onClick={() => openMaps(selected)}
              style={{ width: '100%', padding: 10, background: '#1a1a1a', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >Get Directions</button>
          </div>
        )}
      </div>
    );
  };

  const VenueCard = ({ venue }) => {
    const minPrice = Math.min(...venue.specials.map(s => s.price));
    return (
      <div
        onClick={() => openMaps(venue)}
        style={{
          background: 'white',
          borderRadius: 14,
          padding: 14,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          cursor: 'pointer',
          transition: 'box-shadow 0.15s',
          border: '1px solid #eee'
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <h2 style={{ margin: '0 0 3px', fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>{venue.name}</h2>
            <p style={{ margin: 0, fontSize: 13, color: '#888' }}>{venue.suburb} · ★ {venue.rating.toFixed(1)}</p>
          </div>
          <div style={{ background: '#1a1a1a', color: 'white', padding: '6px 12px', borderRadius: 8, fontWeight: 700, fontSize: 15 }}>${minPrice}</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {venue.specials.map((s, j) => (
            <span key={j} style={{ background: '#f5f5f5', padding: '4px 10px', borderRadius: 6, fontSize: 12, color: '#1a1a1a' }}>
              <strong>${s.price}</strong> {s.item}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const FilterBar = () => (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
      <select
        value={suburbFilter}
        onChange={e => setSuburbFilter(e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: 8,
          border: '1px solid #ddd',
          background: 'white',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          minWidth: 120
        }}
      >
        {SUBURBS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Suburbs' : s}</option>)}
      </select>
      
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
        {TYPES.map(t => (
          <button
            key={t.key}
            onClick={() => setTypeFilter(t.key)}
            style={{
              padding: '8px 14px',
              border: typeFilter === t.key ? '2px solid #1a1a1a' : '1px solid #ddd',
              borderRadius: 20,
              background: typeFilter === t.key ? '#1a1a1a' : 'white',
              color: typeFilter === t.key ? 'white' : '#1a1a1a',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >{t.label}</button>
        ))}
      </div>
    </div>
  );

  // Mobile Layout
  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'Inter, -apple-system, sans-serif' }}>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'white', borderBottom: '1px solid #eee', padding: 16 }}>
          <h1 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700 }}>Thursday Specials</h1>
          <p style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>{filtered.length} venues</p>
          
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button onClick={() => setMobileView('list')} style={{
              flex: 1, padding: 10, border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
              background: mobileView === 'list' ? '#1a1a1a' : '#f0f0f0',
              color: mobileView === 'list' ? 'white' : '#1a1a1a'
            }}>List</button>
            <button onClick={() => setMobileView('map')} style={{
              flex: 1, padding: 10, border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
              background: mobileView === 'map' ? '#1a1a1a' : '#f0f0f0',
              color: mobileView === 'map' ? 'white' : '#1a1a1a'
            }}>Map</button>
          </div>
          
          <FilterBar />
        </header>

        {mobileView === 'list' ? (
          <main style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(v => <VenueCard key={v.id} venue={v} />)}
          </main>
        ) : (
          <div style={{ position: 'fixed', top: 160, left: 0, right: 0, bottom: 0 }}>
            <MapView height="100%" venues={filtered} selected={selected} setSelected={setSelected} openMaps={openMaps} isMobile={true} />
          </div>
        )}
      </div>
    );
  }

  // Desktop Layout
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      <header style={{ background: 'white', borderBottom: '1px solid #eee', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px' }}>Thursday Specials</h1>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: '#666' }}>{filtered.length} venues</p>
            </div>
          </div>
          <FilterBar />
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <div style={{ marginBottom: 24 }}>
          <MapView height={400} venues={filtered} selected={selected} setSelected={setSelected} openMaps={openMaps} isMobile={false} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
          {filtered.map(v => <VenueCard key={v.id} venue={v} />)}
        </div>
      </main>
    </div>
  );
}
