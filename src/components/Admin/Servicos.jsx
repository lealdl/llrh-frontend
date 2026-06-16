import { useState, useEffect } from 'react';
import { getAdminServicos, createServico, updateServico, deleteServico } from '../../services/api';
import IconPicker from './IconPicker';

const ServicosAdmin = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formIcone, setFormIcone] = useState('💼');

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      setLoading(true);
      const data = await getAdminServicos();
      
      if (data && data.success && Array.isArray(data.data)) {
        setServicos(data.data);
      } 
      else if (Array.isArray(data)) {
        setServicos(data);
      }
      else {
        setServicos([]);
      }
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      setServicos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const servico = {
      titulo: formData.get('titulo'),
      descricao: formData.get('descricao'),
      icone: formIcone,
      ordem: parseInt(formData.get('ordem')) || 0,
      ativo: formData.get('ativo') === 'on' ? 1 : 0
    };

    if (editing) {
      updateServico(editing.id, servico).then(() => {
        carregarServicos();
        setEditing(null);
        setFormIcone('💼');
        e.target.reset();
      });
    } else {
      createServico(servico).then(() => {
        carregarServicos();
        setFormIcone('💼');
        e.target.reset();
      });
    }
  };

  const handleEdit = (servico) => {
    setEditing(servico);
    setFormIcone(servico.icone || '💼');
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      await deleteServico(id);
      carregarServicos();
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setFormIcone('💼');
  };

  if (loading) return <div className="servicos-empty">Carregando serviços...</div>;

  const servicosOrdenados = [...servicos].sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

  return (
    <div className="servicos-container">
      <div className="servicos-form-section">
        <h2>{editing ? '✏️ Editar Serviço' : '➕ Novo Serviço'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="servicos-form-grid">
            <div className="servicos-form-group">
              <label>Título *</label>
              <input type="text" name="titulo" defaultValue={editing?.titulo || ''} required />
            </div>
            <div className="servicos-form-group">
              <label>Ícone</label>
              <IconPicker value={formIcone} onChange={setFormIcone} />
            </div>
            <div className="servicos-form-group">
              <label>Ordem</label>
              <input type="number" name="ordem" defaultValue={editing?.ordem || 0} step="1" />
              <small>Menor = primeiro</small>
            </div>
            <div className="servicos-form-group">
              <label className="servicos-checkbox">
                <input type="checkbox" name="ativo" defaultChecked={editing?.ativo !== 0} />
                <span>Ativo</span>
              </label>
            </div>
            <div className="servicos-full-width">
              <div className="servicos-form-group">
                <label>Descrição *</label>
                <textarea name="descricao" rows="3" defaultValue={editing?.descricao || ''} required />
              </div>
            </div>
          </div>
          <div className="servicos-form-actions">
            <button type="submit" className="btn-servicos-primary">
              {editing ? '✏️ Atualizar' : '➕ Criar'}
            </button>
            {editing && (
              <button type="button" onClick={handleCancel} className="btn-servicos-secondary">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="servicos-form-section">
        <h2>📋 Serviços</h2>
        {servicosOrdenados.length === 0 ? (
          <div className="servicos-empty">Nenhum serviço cadastrado.</div>
        ) : (
          <div className="servicos-table-container">
            <table className="servicos-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ícone</th>
                  <th>Título</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {servicosOrdenados.map(s => (
                  <tr key={s.id}>
                    <td>{s.ordem || 0}</td>
                    <td className="servicos-icone">{s.icone || '💼'}</td>
                    <td>{s.titulo}</td>
                    <td>
                      <span className="servicos-status">
                        {s.ativo ? '🟢 Ativo' : '⚫ Inativo'}
                      </span>
                    </td>
                    <td className="servicos-actions">
                      <button onClick={() => handleEdit(s)} className="btn-servicos-edit" title="Editar">✏️</button>
                      <button onClick={() => handleDelete(s.id)} className="btn-servicos-delete" title="Excluir">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicosAdmin;
