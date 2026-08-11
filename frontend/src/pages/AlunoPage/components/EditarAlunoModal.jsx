import { useState } from 'react'

import './EditarAlunoModal.css'

export default function EditarAlunoModal({
    aluno,
    onClose,
    onSave,
    salvando
}) {

    function formatarTelefone(value) {
        const numeros = value
            .replace(/\D/g, '')
            .slice(0, 11)

        if (numeros.length === 0) {
            return ''
        }

        if (numeros.length <= 2) {
            return `(${numeros}`
        }

        if (numeros.length <= 7) {
            return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`
        }

        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
    }

    const [form, setForm] = useState({
        nome_completo: aluno.nome_completo || '',
        bairro: aluno.bairro || '',
        curso: aluno.curso || '',
        email: aluno.email || '',
        telefone: formatarTelefone(aluno.telefone || ''),
        matricula: aluno.matricula || '',
        data_nascimento: aluno.data_nascimento || '',
        ingresso_liga: aluno.ingresso_liga || '',
        desligamento_liga: aluno.desligamento_liga || '',
        cargo: aluno.cargo || '',
        periodo_ingresso: aluno.periodo_ingresso || '',
        faz_estagio: aluno.faz_estagio || false,
        status: aluno.status || 'ATIVO'
    })

    function handleChange(event) {
        const {
            name,
            value,
            type,
            checked
        } = event.target

        setForm(prev => ({
            ...prev,
            [name]:
                type === 'checkbox'
                    ? checked
                    : name === 'telefone'
                        ? formatarTelefone(value)
                        : value
        }))
    }

    function handleSubmit(event) {
        event.preventDefault()

        onSave({
            ...form,

            desligamento_liga:
                form.desligamento_liga || null
        })
    }

    return (
        <div className="modal-overlay">

            <div className="modal-aluno">

                <div className="modal-aluno-header">

                    <div>
                        <h2>Editar aluno</h2>

                        <p>
                            Atualize as informações do aluno.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        disabled={salvando}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="modal-aluno-body">

                        {/* DADOS PESSOAIS */}

                        <div className="modal-section-title">
                            <i className="fa-solid fa-user"></i>

                            <div>
                                <h3>Dados pessoais</h3>
                                <p>
                                    Informações básicas do aluno.
                                </p>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="nome_completo">
                                Nome completo
                            </label>

                            <input
                                id="nome_completo"
                                name="nome_completo"
                                type="text"
                                value={form.nome_completo}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">

                            <div className="form-group">
                                <label htmlFor="data_nascimento">
                                    Data de nascimento
                                </label>

                                <input
                                    id="data_nascimento"
                                    name="data_nascimento"
                                    type="date"
                                    value={form.data_nascimento}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="telefone">
                                    Telefone
                                </label>

                                <input
                                    id="telefone"
                                    name="telefone"
                                    type="tel"
                                    value={form.telefone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                E-mail
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="bairro">
                                Bairro
                            </label>

                            <input
                                id="bairro"
                                name="bairro"
                                type="text"
                                value={form.bairro}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* DADOS ACADÊMICOS */}

                        <div className="modal-section-title">
                            <i className="fa-solid fa-graduation-cap"></i>

                            <div>
                                <h3>Dados acadêmicos</h3>
                                <p>
                                    Informações sobre curso e matrícula.
                                </p>
                            </div>
                        </div>

                        <div className="form-row">

                            <div className="form-group">
                                <label htmlFor="matricula">
                                    Matrícula
                                </label>

                                <input
                                    id="matricula"
                                    name="matricula"
                                    type="text"
                                    value={form.matricula}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="curso">
                                    Curso
                                </label>

                                <input
                                    id="curso"
                                    name="curso"
                                    type="text"
                                    value={form.curso}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>

                        <div className="form-group">
                            <label htmlFor="periodo_ingresso">
                                Data de ingresso no curso
                            </label>

                            <input
                                id="periodo_ingresso"
                                name="periodo_ingresso"
                                type="date"
                                value={form.periodo_ingresso}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* DADOS DA LIGA */}

                        <div className="modal-section-title">
                            <i className="fa-solid fa-users"></i>

                            <div>
                                <h3>Dados da liga</h3>
                                <p>
                                    Participação na liga.
                                </p>
                            </div>
                        </div>

                        <div className="form-row">

                            <div className="form-group">
                                <label htmlFor="cargo">
                                    Cargo
                                </label>

                                <input
                                    id="cargo"
                                    name="cargo"
                                    type="text"
                                    value={form.cargo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="ingresso_liga">
                                    Ingresso na liga
                                </label>

                                <input
                                    id="ingresso_liga"
                                    name="ingresso_liga"
                                    type="date"
                                    value={form.ingresso_liga}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>

                        <div className="form-group">
                            <label htmlFor="desligamento_liga">
                                Desligamento da liga
                            </label>

                            <input
                                id="desligamento_liga"
                                name="desligamento_liga"
                                type="date"
                                value={form.desligamento_liga}
                                onChange={handleChange}
                            />

                            <small>
                                Deixe vazio caso o aluno ainda esteja na liga.
                            </small>
                        </div>

                        {/* STATUS */}

                        <div className="form-group">
                            <label htmlFor="status">
                                Status
                            </label>

                            <select
                                id="status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="ATIVO">
                                    Ativo
                                </option>

                                <option value="INATIVO">
                                    Inativo
                                </option>
                            </select>
                        </div>

                        {/* ESTÁGIO */}

                        <div className="modal-section-title">
                            <i className="fa-solid fa-briefcase"></i>

                            <div>
                                <h3>Estágio</h3>
                                <p>
                                    Informações profissionais.
                                </p>
                            </div>
                        </div>

                        <label className="checkbox-field">

                            <input
                                type="checkbox"
                                name="faz_estagio"
                                checked={form.faz_estagio}
                                onChange={handleChange}
                            />

                            <span>
                                O aluno está fazendo estágio
                            </span>

                        </label>

                    </div>

                    <div className="modal-aluno-actions">

                        <button
                            type="button"
                            className="btn-cancelar"
                            onClick={onClose}
                            disabled={salvando}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="btn-salvar-aluno"
                            disabled={salvando}
                        >
                            {salvando ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-check"></i>
                                    Salvar alterações
                                </>
                            )}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}