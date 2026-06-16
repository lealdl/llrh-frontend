import { useState } from 'react';
import './editor.css';

const RichTextEditor = ({ value, onChange, placeholder = "Digite o conteúdo aqui..." }) => {
  const [preview, setPreview] = useState(false);

  return (
    <div className="rich-text-editor-simple">
      <div className="editor-toolbar-simple">
        <button 
          type="button" 
          onClick={() => setPreview(false)} 
          className={!preview ? 'active' : ''}
        >
          ✏️ Editar HTML
        </button>
        <button 
          type="button" 
          onClick={() => setPreview(true)} 
          className={preview ? 'active' : ''}
        >
          👁️ Visualizar
        </button>
      </div>
      
      {!preview ? (
        <>
          <textarea
            className="editor-textarea-simple"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={18}
          />
          <div className="editor-help-hint">
            <small>💡 Você pode usar HTML para formatar.</small>
          </div>
        </>
      ) : (
        <div 
          className="editor-preview-simple" 
          dangerouslySetInnerHTML={{ __html: value || '<em>Nenhum conteúdo...</em>' }}
        />
      )}
    </div>
  );
};

export default RichTextEditor;
