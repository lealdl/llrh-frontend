import { useState } from 'react';
import './iconpicker.css';

// Lista de ícones organizados por categoria
const iconesPorCategoria = {
  '😊 Profissional': ['💼', '📊', '🎯', '🏆', '📈', '💡', '🔧', '⚙️'],
  '🎓 Educação': ['🎓', '📝', '📚', '✏️', '📖', '🧠', '💡', '🔍'],
  '💻 Tecnologia': ['💻', '🖥️', '📱', '📲', '🌐', '🔒', '🔄', '⚙️'],
  '📞 Contato': ['📞', '✉️', '📧', '💬', '📨', '📩', '📫', '📬'],
  '🎨 Design': ['🎨', '🖌️', '🖍️', '✏️', '📐', '🖼️', '🎭', '✨'],
  '🏆 Esportes': ['⚽', '🏀', '🏈', '🎾', '🏋️', '🏊', '🚴', '🎿', '🏂', '🏄'],
  '🎵 Música': ['🎵', '🎶', '🎸', '🎺', '🎻', '🎹', '🎧', '🎤'],
  '🎮 Entretenimento': ['🎮', '🎲', '🎯', '🎳', '🎬', '🎥', '📹', '🎭'],
  '❤️ Sentimentos': ['❤️', '👍', '💪', '⭐', '🌟', '💎', '👑', '🎉'],
  '📍 Localização': ['📍', '🗺️', '🌍', '🌎', '🌏', '🏠', '🏢', '🏪'],
  '⏰ Tempo': ['⏰', '📅', '📆', '🕐', '🕑', '🕒', '🕓', '🕔'],
  '📦 Outros': ['📦', '🗂️', '📋', '✅', '❌', '⚠️', '🔑', '🛠️']
};

// Criar lista plana de todos os ícones para busca
const todosIcones = Object.values(iconesPorCategoria).flat();
const categorias = Object.keys(iconesPorCategoria);

const IconPicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  // Filtrar ícones por categoria e busca
  const iconesFiltrados = () => {
    let icones = [];
    
    if (selectedCategory === 'todos') {
      icones = todosIcones;
    } else {
      icones = iconesPorCategoria[selectedCategory] || [];
    }
    
    if (searchTerm) {
      icones = icones.filter(icone => icone.includes(searchTerm));
    }
    
    return icones;
  };

  const handleSelectIcon = (icone) => {
    onChange(icone);
    setIsOpen(false);
    setSearchTerm('');
    setSelectedCategory('todos');
  };

  const iconesExibir = iconesFiltrados();

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
                <button
                  type="button"
                  className={`category-btn ${selectedCategory === 'todos' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('todos')}
                >
                  📦 Todos
                </button>
                {categorias.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="icon-picker-grid">
              {iconesExibir.length === 0 ? (
                <div className="no-icons">Nenhum ícone encontrado</div>
              ) : (
                iconesExibir.map((icone) => (
                  <button
                    key={icone}
                    type="button"
                    className="icon-option"
                    onClick={() => handleSelectIcon(icone)}
                  >
                    <span className="icon-emoji">{icone}</span>
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
