import { useState, useEffect } from 'react';
import { getAdminVagas, createVaga, updateVaga, deleteVaga } from '../../services/api';

const VagasAdmin = () => {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    localizacao: '',
    salario: '',
    tipo: 'CLT',
    descricao: '',
    ativo: 1,
    ordem: 0,
    bloqueado: 1
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const carregarVagas = async () => {
    setLoading(true);
    try {
      const response = await getAdminVagas();
      console.log('📦 Vagas recebidas:', response);
      if (response.success && response.data) {
        setVagas(response.data);
      } else {
        setVagas([]);
      }
    } catch (error) {
      console.error('Erro ao carregar vagas:', error);
      setVagas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarVagas();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked ? 1 : 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dadosEnviar = {
      ...formData,
      ativo: parseInt(formData.ativo) || 0,
      ordem: parseInt(formData.ordem) || 0,
      bloqueado: parseInt(formData.bloqueado) || 0
    };
    
    console.log('📤 Enviando dados:', dadosEnviar);
    
    try {
      let response;
      if (editando) {
        response = await updateVaga(editando, dadosEnviar);
      } else {
        response = await createVaga(dadosEnviar);
      }
      
      console.log('📥 Resposta:', response);
      
      if (response && response.success) {
        showToast(editando ? '✅ Vaga atualizada!' : '✅ Vaga criada!');
        setMostrarForm(false);
        setEditando(null);
        setFormData({ titulo: '', localizacao: '', salario: '', tipo: 'CLT', descricao: '', ativo: 1, ordem: 0, bloqueado: 1 });
        await carregarVagas();
      } else {
        showToast('❌ ' + (response?.message || 'Falha ao salvar'), 'error');
      }
    } catch (error) {
      console.error('❌ Erro:', error);
      showToast('❌ Erro de conexão', 'error');
    }
  };

  const handleEdit = (vaga) => {
    console.log('✏️ Editando vaga:', vaga);
    setFormData({
      titulo: vaga.titulo || '',
      localizacao: vaga.localizacao || '',
      salario: vaga.salario || '',
      tipo: vaga.tipo || 'CLT',
      descricao: vaga.descricao || '',
      ativo: parseInt(vaga.ativo) || 1,
      ordem: parseInt(vaga.ordem) || 0,
      bloqueado: parseInt(vaga.bloqueado) || 1
    });
    setEditando(vaga.id);
    setMostrarForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta vaga?')) return;
    try {
      const response = await deleteVaga(id);
      if (response.success) {
        showToast('✅ Vaga excluída!');
        await carregarVagas();
      } else {
        showToast('❌ Erro ao excluir', 'error');
      }
    } catch (error) {
      console.error('Erro:', error);
      showToast('❌ Erro de conexão', 'error');
    }
  };

  const handleCancel = () => {
    setMostrarForm(false);
    setEditando(null);
    setFormData({ titulo: '', localizacao: '', salario: '', tipo: 'CLT', descricao: '', ativo: 1, ordem: 0, bloqueado: 1 });
  };

  if (loading) return <div className="admin-loading">🔄 Carregando...</div>;

  return (
    <div className="vagas-admin-container">
      {toast && (
        <div className={`servico-toast ${toast.type}`}>
          <span>{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>×</button>
        </div>
      )}

      <div className="vagas-admin-header">
        <h2>📋 Vagas</h2>
        <button type="button" className="btn-novo-vaga" onClick={() => setMostrarForm(true)}>
          ➕ Nova Vaga
        </button>
      </div>

      {mostrarForm && (
        <div className="vaga-form">
          <h3>{editando ? '✏️ Editar Vaga' : '➕ Nova Vaga'}</h3>
          <div className="vaga-form-grid">
            <div className="form-group">
              <label>Título *</label>
              <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Localização</label>
              <input type="text" name="localizacao" value={formData.localizacao} onChange={handleChange} placeholder="Ex: Remoto, São Paulo - SP" />
            </div>
            <div className="form-group">
              <label>Salário</label>
              <input type="text" name="salario" value={formData.salario} onChange={handleChange} placeholder="Ex: R$ 5.000 - R$ 7.000" />
            </div>
            <div className="form-group">
              <label>Tipo</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange}>
                <option value="CLT">CLT</option>
                <option value="PJ">PJ</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ordem</label>
              <input type="number" name="ordem" value={formData.ordem} onChange={handleChange} min="0" />
              <small>Menor = primeiro</small>
            </div>
            <div className="form-group">
              {/* <label>Ativo</label> */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                    {formData.ativo === 1 ? '✅ Ativa' : '❌ Inativa'}
                  </span>
                </div>
                <small style={{ color: '#666', fontSize: '0.75rem', lineHeight: '1.4' }}>
                  {formData.ativo === 1 
                    ? '🟢 Ativa: vaga aparece no site.' 
                    : '🔴 Inativa: vaga fica oculta.'}
                </small>
              </div>
            </div>
            <div className="form-group">
              {/* <label>Bloqueado</label> */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="checkbox" 
                    name="bloqueado" 
                    checked={formData.bloqueado === 1} 
                    onChange={handleChange} 
                  />
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    background: formData.bloqueado === 1 ? '#fef3c7' : '#d1fae5',
                    color: formData.bloqueado === 1 ? '#92400e' : '#065f46'
                  }}>
                    {formData.bloqueado === 1 ? '🔒 Bloqueada' : '🔓 Desbloqueada'}
                  </span>
                </div>
                <small style={{ color: '#666', fontSize: '0.75rem', lineHeight: '1.4' }}>
                  {formData.bloqueado === 1 
                    ? '🟡 Bloqueada: vaga aparece com "Em breve" (desabilitada).' 
                    : '🟢 Desbloqueada: vaga liberada para candidatura.'}
                </small>
              </div>
            </div>
            <div className="form-group full-width">
              <label>Descrição</label>
              <textarea name="descricao" rows="3" value={formData.descricao} onChange={handleChange} placeholder="Descrição da vaga..."></textarea>
            </div>
            <div className="vaga-form-actions">
              <button type="button" className="btn-cancelar-vaga" onClick={handleCancel}>Cancelar</button>
              <button type="button" className="btn-salvar-vaga" onClick={handleSubmit}>
                {editando ? '💾 Atualizar' : '💾 Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="vagas-table-wrapper">
        {vagas.length === 0 ? (
          <div className="sem-vagas">📭 Nenhuma vaga cadastrada</div>
        ) : (
          <table className="vagas-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Título</th>
                <th>Localização</th>
                <th>Salário</th>
                <th>Tipo</th>
                <th style={{ width: '100px' }}>Status</th>
                <th style={{ width: '100px' }}>Bloqueio</th>
                <th style={{ width: '100px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vagas.map((vaga, index) => {
                const isAtivo = parseInt(vaga.ativo) === 1;
                const isBloqueado = parseInt(vaga.bloqueado) === 1;
                return (
                  <tr key={vaga.id || index}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td>{vaga.titulo}</td>
                    <td>{vaga.localizacao}</td>
                    <td>{vaga.salario}</td>
                    <td>
                      <span className={`vaga-tipo ${vaga.tipo === 'PJ' ? 'tipo-pj' : 'tipo-clt'}`}>
                        {vaga.tipo}
                      </span>
                    </td>
                    <td>
                      <span className={`servico-status ${isAtivo ? 'ativo' : 'inativo'}`}>
                        {isAtivo ? '✅ Ativa' : '❌ Inativa'}
                      </span>
                    </td>
                    <td>
                      <span className={`servico-status ${isBloqueado ? 'bloqueado' : 'desbloqueado'}`}>
                        {isBloqueado ? '🔒 Bloqueada' : '🔓 Desbloqueada'}
                      </span>
                    </td>
                    <td>
                      <div className="servico-acoes">
                        <button type="button" className="btn-editar-servico" onClick={() => handleEdit(vaga)}>
                          ✏️
                        </button>
                        <button type="button" className="btn-deletar-servico" onClick={() => handleDelete(vaga.id)}>
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

export default VagasAdmin;
