import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, Package, FileText, ShoppingCart, DollarSign, Settings } from 'lucide-react';

const commands = [
  { id: 'dashboard', name: 'Go to Dashboard', icon: <LayoutDashboard size={18}/>, path: '/dashboard' },
  { id: 'products', name: 'Manage Products', icon: <Package size={18}/>, path: '/products' },
  { id: 'invoices', name: 'View Invoices', icon: <FileText size={18}/>, path: '/invoices' },
  { id: 'purchases', name: 'View Purchases', icon: <ShoppingCart size={18}/>, path: '/purchases' },
  { id: 'expenses', name: 'Manage Expenses', icon: <DollarSign size={18}/>, path: '/expenses' },
  { id: 'settings', name: 'Settings', icon: <Settings size={18}/>, path: '/settings' },
];

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredCommands = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    }
    if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      navigate(filteredCommands[selectedIndex].path);
      setIsOpen(false);
      setQuery('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cmd-palette-overlay" onClick={() => setIsOpen(false)}>
      <div className="cmd-palette" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '24px', borderBottom: '1px solid #f3f4f6' }}>
          <Search size={20} color="#6b7280" />
          <input 
            autoFocus
            placeholder="What do you need? (Type a command...)" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ borderBottom: 'none' }}
          />
        </div>
        <div className="cmd-options">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => (
              <div 
                key={cmd.id} 
                className={`cmd-option ${idx === selectedIndex ? 'selected' : ''}`}
                onMouseEnter={() => setSelectedIndex(idx)}
                onClick={() => {
                  navigate(cmd.path);
                  setIsOpen(false);
                  setQuery('');
                }}
              >
                <span style={{ color: '#2563eb' }}>{cmd.icon}</span>
                <span>{cmd.name}</span>
              </div>
            ))
          ) : (
            <div style={{ padding: '24px', color: '#6b7280', textAlign: 'center', fontSize: '14px' }}>
              No commands found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
