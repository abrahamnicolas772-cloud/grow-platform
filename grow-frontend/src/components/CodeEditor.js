import Editor from 'react-simple-code-editor';
import 'prismjs/themes/prism-tomorrow.css';

// Import global de prismjs
import Prism from 'prismjs';

// Les langages seront chargés dynamiquement
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';

const CodeEditor = ({ code, setCode, language = 'javascript' }) => {
  const highlightCode = (code) => {
    const langMap = {
      javascript: Prism.languages.javascript,
      python: Prism.languages.python,
      css: Prism.languages.css,
    };
    const lang = langMap[language] || Prism.languages.javascript;
    return Prism.highlight(code, lang, language);
  };

  return (
    <Editor
      value={code}
      onValueChange={setCode}
      highlight={highlightCode}
      padding={12}
      style={{
        fontFamily: '"Fira Code", "Courier New", monospace',
        fontSize: 14,
        backgroundColor: '#1e1e2e',
        color: '#e2e8f0',
        borderRadius: '0.75rem',
        border: '1px solid #3b82f6',
        margin: '1rem 0',
      }}
    />
  );
};

export default CodeEditor;
