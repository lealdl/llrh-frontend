import React, { useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './richtexteditor.css';

// Lista de fontes - SEM ESPAÇOS nos nomes
const FONT_FAMILIES = [
  'Arial', 'Arial-Black', 'Comic-Sans-MS', 'Courier-New', 'Georgia',
  'Impact', 'Tahoma', 'Times-New-Roman', 'Trebuchet-MS', 'Verdana',
  'Poppins', 'Nunito'
];

const FONT_SIZES = ['8', '10', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];

const RichTextEditor = ({ value, onChange, placeholder }) => {
  useEffect(() => {
    const Font = ReactQuill.Quill.import('formats/font');
    Font.whitelist = FONT_FAMILIES;
    ReactQuill.Quill.register(Font, true);

    const Size = ReactQuill.Quill.import('formats/size');
    Size.whitelist = FONT_SIZES;
    ReactQuill.Quill.register(Size, true);

    // Forçar recarga do editor
    const quill = document.querySelector('.ql-editor');
    if (quill) {
      quill.classList.add('ql-font-Poppins');
    }
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
