import './vagas.css';

const Vagas = () => {
  const vagas = [
    {
      id: 1,
      titulo: 'Desenvolvedor(a) React Pleno',
      localizacao: 'Remoto',
      salario: 'R$ 7.000 - R$ 9.000',
      tipo: 'CLT',
      descricao: 'Desenvolvimento de aplicações web com React.js'
    },
    {
      id: 2,
      titulo: 'Analista de Recursos Humanos Sênior',
      localizacao: 'São Paulo - SP',
      salario: 'R$ 6.000 - R$ 8.000',
      tipo: 'CLT',
      descricao: 'Gestão de processos de RH e recrutamento'
    },
    {
      id: 3,
      titulo: 'UX/UI Designer',
      localizacao: 'Remoto',
      salario: 'R$ 5.500 - R$ 7.500',
      tipo: 'PJ',
      descricao: 'Criação de interfaces e experiência do usuário'
    },
    {
      id: 4,
      titulo: 'DevOps Engineer',
      localizacao: 'Híbrido - SP',
      salario: 'R$ 8.000 - R$ 12.000',
      tipo: 'CLT',
      descricao: 'Infraestrutura e automação de deploys'
    }
  ];

  const handleCandidatar = () => {
    alert('🚧 Funcionalidade em desenvolvimento. Em breve estará disponível!');
  };

  return (
    <section id="vagas" className="vagas">
      <div className="vagas-container">
        <div className="vagas-header">
          <h2>Vagas em Destaque</h2>
          <p>Encontre a oportunidade ideal para sua carreira</p>
        </div>

        <div className="vagas-grid">
          {vagas.map(vaga => (
            <div key={vaga.id} className="vaga-card">
              <div className="vaga-card-header">
                <h3>{vaga.titulo}</h3>
                <span className={`vaga-tipo ${vaga.tipo === 'PJ' ? 'tipo-pj' : 'tipo-clt'}`}>
                  {vaga.tipo}
                </span>
              </div>
              
              <div className="vaga-info">
                <div className="vaga-info-item">
                  <span className="info-icon">📍</span>
                  <span>{vaga.localizacao}</span>
                </div>
                <div className="vaga-info-item">
                  <span className="info-icon">💰</span>
                  <span>{vaga.salario}</span>
                </div>
              </div>
              
              <p className="vaga-descricao">{vaga.descricao}</p>
              
              <button 
                className="vaga-btn-candidatar"
                onClick={handleCandidatar}
              >
                🔒 Em desenvolvimento
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Vagas;
