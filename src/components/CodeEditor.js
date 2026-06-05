import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-tomorrow.css';

const CodeEditor = ({ code, setCode, language = 'javascript' }) => {
  const getLanguage = () => {
    switch(language) {
      case 'python': return languages.python;
      case 'css': return languages.css;
      default: return languages.javascript;
    }
  };

  return (
    <Editor
      value={code}
      onValueChange={setCode}
      highlight={code => highlight(code, getLanguage(), language)}
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