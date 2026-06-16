import { useState, useEffect } from 'react';
import { getAdminServicos, createServico, updateServico, deleteServico } from '../../services/api';
import IconPicker from './IconPicker';

const ServicosAdmin = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    icone: '🎯',
    descricao: '',
    ordem: 0,
    ativo: 1
  });

  const carregarServicos = async () => {
    setLoading(true);
    try {
      const response = await getAdminServicos();
      console.log('📦 Serviços recebidos (RAW):', response);
      
      if (response.success && response.data) {
        // Garantir que cada serviço tenha os campos corretos
        const dadosTratados = response.data.map(servico => ({
          ...servico,
          // Se ativo não veio, assume que é ativo (1)
          ativo: servico.ativo !== undefined ? parseInt(servico.ativo) : 1,
          ordem: servico.ordem !== undefined ? parseInt(servico.ordem) : 0,
          icone: servico.icone || '📌',
          titulo: servico.titulo || 'Sem título'
        }));
        console.log('📦 Serviços tratados:', dadosTratados);
        setServicos(dadosTratados);
      } else {
        setServicos([]);
      }
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      setServicos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarServicos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked ? 1 : 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleIconChange = (icone) => {
    setFormData(prev => ({ ...prev, icone }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dadosEnviar = {
      ...formData,
      ativo: parseInt(formData.ativo) || 0
    };
    
    console.log('📤 Enviando dados:', dadosEnviar);
    
    try {
      let response;
      if (editando) {
        response = await updateServico(editando, dadosEnviar);
      } else {
        response = await createServico(dadosEnviar);
      }
      
      console.log('📥 Resposta:', response);
      
      if (response && response.success) {
        alert(editando ? '✅ Serviço atualizado!' : '✅ Serviço criado!');
        setMostrarForm(false);
        setEditando(null);
        setFormData({ titulo: '', icone: '🎯', descricao: '', ordem: 0, ativo: 1 });
        await carregarServicos();
      } else {
        alert('❌ Erro: ' + (response?.message || 'Falha ao salvar'));
      }
    } catch (error) {
      console.error('❌ Erro:', error);
      alert('❌ Erro de conexão');
    }
  };

  const handleEdit = (servico) => {
    console.log('✏️ Editando serviço:', servico);
    setFormData({
      titulo: servico.titulo || '',
      icone: servico.icone || '🎯',
      descricao: servico.descricao || '',
      ordem: parseInt(servico.ordem) || 0,
      ativo: parseInt(servico.ativo) || 1
    });
    setEditando(servico.id);
    setMostrarForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;
    try {
      const response = await deleteServico(id);
      if (response.success) {
        alert('✅ Serviço excluído!');
        await carregarServicos();
      } else {
        alert('❌ Erro ao excluir');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro de conexão');
    }
  };

  const handleCancel = () => {
    setMostrarForm(false);
    setEditando(null);
    setFormData({ titulo: '', icone: '🎯', descricao: '', ordem: 0, ativo: 1 });
  };

  if (loading) return <div className="admin-loading">🔄 Carregando...</div>;

  return (
    <div className="servicos-container">
      <div className="servicos-header">
        <h2>📋 Serviços</h2>
        <button type="button" className="btn-novo-servico" onClick={() => setMostrarForm(true)}>
          ➕ Novo Serviço
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSubmit} className="servico-form">
          <h3>{editando ? '✏️ Editar Serviço' : '➕ Novo Serviço'}</h3>
          <div className="servico-form-grid">
            <div className="form-group">
              <label>Título *</label>
              <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Ícone</label>
              <IconPicker value={formData.icone} onChange={handleIconChange} />
            </div>
            <div className="form-group">
              <label>Ordem</label>
              <input type="number" name="ordem" value={formData.ordem} onChange={handleChange} min="0" />
              <small>Menor = primeiro</small>
            </div>
            <div className="form-group">
              <label>Ativo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  name="ativo" 
                  checked={formData.ativo === 1} 
                  onChange={handleChange} 
                />
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  background: formData.ativo === 1 ? '#d1fae5' : '#fee2e2',
                  color: formData.ativo === 1 ? '#065f46' : '#991b1b'
                }}>
                  {formData.ativo === 1 ? '✅ Ativo' : '❌ Inativo'}
                </span>
              </div>
            </div>
            <div className="form-group full-width">
              <label>Descrição *</label>
              <textarea name="descricao" rows="3" value={formData.descricao} onChange={handleChange} required></textarea>
            </div>
            <div className="servico-form-actions">
              <button type="button" className="btn-cancelar-servico" onClick={handleCancel}>Cancelar</button>
              <button type="submit" className="btn-salvar-servico">
                {editando ? '💾 Atualizar' : '💾 Criar'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="servicos-table-wrapper">
        {servicos.length === 0 ? (
          <div className="sem-servicos">📭 Nenhum serviço cadastrado</div>
        ) : (
          <table className="servicos-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>#</th>
                <th style={{ width: '60px' }}>Ícone</th>
                <th>Título</th>
                <th style={{ width: '130px' }}>Status</th>
                <th style={{ width: '100px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {servicos.map((servico, index) => {
                // Se ativo for undefined, assume que é ativo (1)
                const ativoNum = servico.ativo !== undefined ? parseInt(servico.ativo) : 1;
                const isAtivo = ativoNum === 1;
                const iconeExibido = servico.icone || '📌';
                
                console.log(`🔍 ${servico.titulo}: ativo=${servico.ativo} -> isAtivo=${isAtivo}`);
                
                return (
                  <tr key={servico.id || index}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ textAlign: 'center', fontSize: '1.5rem' }}>{iconeExibido}</td>
                    <td>{servico.titulo}</td>
                    <td>
                      <span className={`servico-status ${isAtivo ? 'ativo' : 'inativo'}`}>
                        {isAtivo ? '✅ Ativo' : '❌ Inativo'}
                      </span>
                    </td>
                    <td>
                      <div className="servico-acoes">
                        <button type="button" className="btn-editar-servico" onClick={() => handleEdit(servico)}>
                          ✏️
                        </button>
                        <button type="button" className="btn-deletar-servico" onClick={() => handleDelete(servico.id)}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ServicosAdmin;
