import { useState } from 'react';

function CodeEditor({ initialCode = '', language = 'javascript', onChange }) {
  const [code, setCode] = useState(initialCode);

  const handleChange = (e) => {
    setCode(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <div style={{ background: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }}>
      <div style={{ padding: '8px 12px', background: '#2d2d2d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#888', fontSize: '0.75rem' }}>{language}</span>
      </div>
      <textarea
        value={code}
        onChange={handleChange}
        spellCheck={false}
        style={{
          width: '100%',
          minHeight: '200px',
          padding: '12px',
          background: 'transparent',
          border: 'none',
          color: '#d4d4d4',
          fontFamily: 'Consolas, Monaco, monospace',
          fontSize: '0.85rem',
          lineHeight: '1.5',
          resize: 'vertical',
          outline: 'none',
        }}
      />
    </div>
  );
}

export default CodeEditor;
