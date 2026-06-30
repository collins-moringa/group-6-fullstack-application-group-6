import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/';

export default function App() {
  const [countries, setCountries] = useState([]);
  const [name, setName] = useState('');
  const [isoCode, setIsoCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // READ: Fetch all countries from Shawn's API
  useEffect(() => {
    axios.get(API_BASE_URL)
      .then(res => {
        setCountries(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Could not connect to Flask Backend');
        setLoading(false);
      });
  }, []);

  // CREATE: Post new country with required ISO code validation
  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !isoCode) return;

    if (isoCode.trim().length !== 3) {
      alert("ISO Code must be exactly 3 characters! (e.g., KEN)");
      return;
    }

    const payload = { 
      name: name.trim(), 
      iso_code: isoCode.trim().toUpperCase() 
    };

    axios.post(API_BASE_URL, payload)
      .then(res => {
        setCountries([...countries, res.data]);
        setName('');
        setIsoCode('');
      })
      .catch(err => {
        const errorMsg = err.response?.data?.message || 'Failed to save country';
        alert(errorMsg);
      });
  };

  // DELETE: Remove country by unique ID
  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}${id}`)
      .then(() => {
        setCountries(countries.filter(c => c.id !== id));
      })
      .catch(err => alert('Failed to delete country'));
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading System Data...</div>;
  if (error) return <div style={{ padding: '40px', color: 'red', textAlign: 'center' }}>{error}</div>;

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', maxWidth: '1100px', margin: '0 auto', color: '#333' }}>
      <header style={{ borderBottom: '2px solid #eee', paddingBottom: '12px', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: '#1a73e8' }}>Group 6 — Management Dashboard</h1>
        <p style={{ margin: '4px 0 0', color: '#666' }}>Connected to live backend endpoints</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* LEFT COLUMN: CRUD FORM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <h3 style={{ marginTop: 0 }}>Add New Country</h3>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="text" placeholder="Country Name (e.g., Kenya)" value={name}
                onChange={e => setName(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <input 
                type="text" placeholder="3-Letter ISO Code (e.g., KEN)" value={isoCode}
                onChange={e => setIsoCode(e.target.value)}
                maxLength={3}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <button type="submit" style={{ background: '#1a73e8', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Save to Database
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE DATABASE RECORDS */}
        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
          <h3 style={{ marginTop: 0 }}>Active Database Records</h3>
          {countries.length === 0 ? (
            <p style={{ color: '#888' }}>No records found. Use the form to add a country!</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {countries.map(c => (
                <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <div>
                    <strong>{c.name}</strong> <span style={{ color: '#1a73e8', marginLeft: '8px', fontSize: '13px', padding: '2px 6px', background: '#e8f0fe', borderRadius: '4px' }}>{c.iso_code}</span>
                  </div>
                  <button onClick={() => handleDelete(c.id)} style={{ background: '#d93025', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}