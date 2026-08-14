export default function AlunoInfo({ aluno }) {

    function formatarData(data) {
        if (!data) {
            return '-'
        }

        return new Date(`${data}T00:00:00`)
            .toLocaleDateString('pt-BR')
    }

    function formatarDataCadastro(data) {
        if (!data) {
            return '-'
        }

        return new Date(data)
            .toLocaleDateString('pt-BR')
    }

    return (
        <>

            {/* DADOS PESSOAIS */}

            <section className="aluno-section">

                <div className="section-title">

                    <div>
                        <h2>
                            <i className="fa-solid fa-user"></i>
                            Dados pessoais
                        </h2>

                        <p>
                            Informações pessoais do aluno
                        </p>
                    </div>

                </div>

                <div className="aluno-info-grid">

                    <div className="info-item">
                        <span>Nome completo</span>
                        <strong>
                            {aluno.nome_completo || '-'}
                        </strong>
                    </div>

                    <div className="info-item">
                        <span>Data de nascimento</span>
                        <strong>
                            {formatarData(aluno.data_nascimento)}
                        </strong>
                    </div>

                    <div className="info-item">
                        <span>Bairro</span>
                        <strong>
                            {aluno.bairro || '-'}
                        </strong>
                    </div>

                    <div className="info-item">
                        <span>E-mail</span>
                        <strong>
                            {aluno.email || '-'}
                        </strong>
                    </div>

                    <div className="info-item">
                        <span>Telefone</span>
                        <strong>
                            {aluno.telefone || '-'}
                        </strong>
                    </div>

                </div>

            </section>


            {/* DADOS ACADÊMICOS */}

            <section className="aluno-section">

                <div className="section-title">

                    <div>
                        <h2>
                            <i className="fa-solid fa-graduation-cap"></i>
                            Dados acadêmicos
                        </h2>

                        <p>
                            Informações acadêmicas do aluno
                        </p>
                    </div>

                </div>

                <div className="aluno-info-grid">

                    <div className="info-item">
                        <span>Matrícula</span>
                        <strong>
                            {aluno.matricula || '-'}
                        </strong>
                    </div>

                    <div className="info-item">
                        <span>Curso</span>
                        <strong>
                            {aluno.curso || '-'}
                        </strong>
                    </div>

                    <div className="info-item">
                        <span>Ingresso no curso</span>
                        <strong>
                            {formatarData(aluno.periodo_ingresso)}
                        </strong>
                    </div>

                    <div className="info-item">
                        <span>Data de cadastro</span>
                        <strong>
                            {formatarDataCadastro(aluno.cadastrado_em)}
                        </strong>
                    </div>

                </div>

            </section>


            {/* DADOS DA LIGA */}

            <section className="aluno-section">

                <div className="section-title">

                    <div>
                        <h2>
                            <i className="fa-solid fa-users"></i>
                            Dados da liga
                        </h2>

                        <p>
                            Informações sobre a participação na liga
                        </p>
                    </div>

                </div>

                <div className="aluno-info-grid">

                    <div className="info-item">
                        <span>Cargo</span>
                        <strong>
                            {aluno.cargo || '-'}
                        </strong>
                    </div>

                    <div className="info-item">
                        <span>Ingresso na liga</span>
                        <strong>
                            {formatarData(aluno.ingresso_liga)}
                        </strong>
                    </div>

                    <div className="info-item">
                        <span>Desligamento da liga</span>
                        <strong>
                            {aluno.desligamento_liga
                                ? formatarData(aluno.desligamento_liga)
                                : 'Ainda na liga'
                            }
                        </strong>
                    </div>

                    <div className="info-item">
                        <span>Status</span>
                        <strong>
                            {aluno.status || '-'}
                        </strong>
                    </div>

                </div>

            </section>


            {/* DADOS PROFISSIONAIS */}

            <section className="aluno-section">

                <div className="section-title">

                    <div>
                        <h2>
                            <i className="fa-solid fa-briefcase"></i>
                            Dados profissionais
                        </h2>

                        <p>
                            Informações profissionais do aluno
                        </p>
                    </div>

                </div>

                <div className="aluno-info-grid">

                    <div className="info-item">

                        <span>
                            Faz estágio
                        </span>

                        <strong>
                            {aluno.faz_estagio
                                ? 'Sim'
                                : 'Não'
                            }
                        </strong>

                    </div>

                </div>

            </section>

        </>
    )
}

