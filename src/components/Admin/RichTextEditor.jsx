import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './richtexteditor.css';

// Lista de fontes
const FONT_FAMILIES = [
  'Arial', 'Arial-Black', 'Comic-Sans-MS', 'Courier-New', 'Georgia',
  'Impact', 'Tahoma', 'Times-New-Roman', 'Trebuchet-MS', 'Verdana',
  'Poppins', 'Nunito'
];

const FONT_SIZES = ['8', '10', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];

// Registrar fontes GLOBALMENTE (fora do componente)
const Font = ReactQuill.Quill.import('formats/font');
Font.whitelist = FONT_FAMILIES;
ReactQuill.Quill.register(Font, true);

const Size = ReactQuill.Quill.import('formats/size');
Size.whitelist = FONT_SIZES;
ReactQuill.Quill.register(Size, true);

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const quillRef = useRef(null);

  useEffect(() => {
    // Forçar registro quando o componente montar
    const Font = ReactQuill.Quill.import('formats/font');
    Font.whitelist = FONT_FAMILIES;
    ReactQuill.Quill.register(Font, true);

    const Size = ReactQuill.Quill.import('formats/size');
    Size.whitelist = FONT_SIZES;
    ReactQuill.Quill.register(Size, true);

    // Log para debug
    console.log('📝 Fontes registradas:', Font.whitelist);
  }, []);

  const modules = {
    toolbar: [
      [{ font: FONT_FAMILIES }],
      [{ size: FONT_SIZES }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      ['clean'],
    ],
  };

  const formats = [
    'font', 'size', 'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'indent',
    'align',
    'link', 'image',
    'blockquote', 'code-block',
  ];

  return (
    <div className="rich-text-editor-wrapper">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Digite o conteúdo aqui...'}
        className="quill-editor"
      />
      <div className="editor-footer">
        💡 Selecione o texto e escolha uma fonte ou tamanho no dropdown
      </div>
    </div>
  );
};

export default RichTextEditor;
