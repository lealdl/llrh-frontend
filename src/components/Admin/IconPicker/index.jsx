import { useState } from 'react';
import './iconpicker.css';

// Lista de ícones organizados por categoria
const icones = {
  '💼': 'Profissional',
  '🎯': 'Alvo/Destaque',
  '📊': 'Gráficos/Dados',
  '🎓': 'Educação',
  '🔍': 'Busca/Headhunting',
  '🧠': 'Psicologia/Cérebro',
  '💰': 'Finanças/Salário',
  '🤝': 'Parceria',
  '⭐': 'Destaque',
  '🚀': 'Crescimento',
  '💡': 'Ideias',
  '📈': 'Crescimento',
  '👥': 'Equipe',
  '🏆': 'Prêmio',
  '⚙️': 'Configuração',
  '🔧': 'Ferramenta',
  '📞': 'Contato',
  '✉️': 'Email',
  '🌐': 'Internet',
  '📱': 'Mobile',
  '💻': 'Tecnologia',
  '🎨': 'Design',
  '📝': 'Documento',
  '🗂️': 'Arquivo',
  '📅': 'Calendário',
  '⏰': 'Horário',
  '📍': 'Localização',
  '🔒': 'Segurança',
  '🔑': 'Chave',
  '❤️': 'Coração',
  '👍': 'Like',
  '💪': 'Força',
  '🤝': 'Aperto de mão',
  '🎉': 'Celebração',
  '🌟': 'Estrela',
  '🔥': 'Destaque',
  '💎': 'Diamante',
  '👑': 'Coroa'
};

const IconPicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  // Categorias únicas
  const categorias = ['todos', ...new Set(Object.values(icones))];

  // Filtrar ícones
  const iconesFiltrados = Object.entries(icones).filter(([icone, categoria]) => {
    const matchSearch = icone.includes(searchTerm) || categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'todos' || categoria === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleSelectIcon = (icone) => {
    onChange(icone);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="icon-picker">
      <div className="icon-picker-preview" onClick={() => setIsOpen(!isOpen)}>
        <span className="selected-icon">{value || '🎯'}</span>
        <button type="button" className="icon-picker-btn">📋 Selecionar Ícone</button>
      </div>

      {isOpen && (
        <div className="icon-picker-modal">
          <div className="icon-picker-modal-content">
            <div className="icon-picker-header">
              <h3>Selecione um Ícone</h3>
              <button type="button" className="icon-picker-close" onClick={() => setIsOpen(false)}>×</button>
            </div>
            
            <div className="icon-picker-toolbar">
              <input
                type="text"
                placeholder="🔍 Buscar ícone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="icon-picker-search"
              />
              
              <div className="icon-picker-categories">
                {categorias.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === 'todos' ? '📦 Todos' : cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="icon-picker-grid">
              {iconesFiltrados.length === 0 ? (
                <div className="no-icons">Nenhum ícone encontrado</div>
              ) : (
                iconesFiltrados.map(([icone, categoria]) => (
                  <button
                    key={icone}
                    type="button"
                    className="icon-option"
                    onClick={() => handleSelectIcon(icone)}
                    title={categoria}
                  >
                    <span className="icon-emoji">{icone}</span>
                    <span className="icon-label">{categoria}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IconPicker;
