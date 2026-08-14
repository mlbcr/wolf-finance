import { useEffect, useRef, useState } from 'react'

import { buscarCursos } from '@/api/apiCursos'

import './CadastrarAlunoModal.css'

export default function CadastrarAlunoModal({
    onClose,
    onSave,
    salvando
}) {

    const [form, setForm] = useState({
        nome_completo: '',
        bairro: '',
        curso: '',
        email: '',
        telefone: '',
        matricula: '',
        data_nascimento: '',
        ingresso_liga: '',
        desligamento_liga: '',
        cargo: '',
        periodo_ingresso: '',
        faz_estagio: false
    })

    const [cursos, setCursos] = useState([])
    const [buscaCurso, setBuscaCurso] = useState('')
    const [cursoAberto, setCursoAberto] = useState(false)
    const cursoSelectRef = useRef(null)

    useEffect(() => {
        async function carregarCursos() {
            try {
                const dados = await buscarCursos()
                setCursos(dados)
            } catch (error) {
                console.error(error)
            }
        }

        carregarCursos()
    }, [])

    useEffect(() => {
        function handleClickFora(event) {
            if (
                cursoSelectRef.current &&
                !cursoSelectRef.current.contains(event.target)
            ) {
                setCursoAberto(false)
            }
        }

        document.addEventListener('mousedown', handleClickFora)

        return () => {
            document.removeEventListener('mousedown', handleClickFora)
        }
    }, [])

    function normalizarTexto(texto) {
        return texto
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
    }

    const cursosFiltrados = cursos.filter(curso => {
        const termo = normalizarTexto(buscaCurso)

        if (!termo) {
            return true
        }

        return (
            normalizarTexto(curso.nome).includes(termo) ||
            normalizarTexto(curso.sigla).includes(termo)
        )
    })

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
                        ? value.replace(/\D/g, '').slice(0, 11)
                        : value
        }))
    }

    function handleSubmit(event) {
        event.preventDefault()

        const dados = {
            ...form,

            desligamento_liga:
                form.desligamento_liga || null
        }

        onSave(dados)
    }

    return (
        <div className="modal-overlay">

            <div className="modal-aluno">

                <div className="modal-aluno-header">

                    <div>
                        <h2>Cadastrar aluno</h2>

                        <p>
                            Preencha os dados do novo aluno.
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
                                <p>Informações básicas do aluno.</p>
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
                                placeholder="Nome completo"
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
                                    placeholder="(21) 99999-9999"
                                    value={formatarTelefone(form.telefone)}
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
                                placeholder="email@exemplo.com"
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
                                placeholder="Bairro onde mora"
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
                                <p>Informações sobre o curso e matrícula.</p>
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
                                    placeholder="Ex.: 2024123456"
                                    value={form.matricula}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="curso">
                                    Curso
                                </label>

                                <div className="curso-select"
                                ref={cursoSelectRef}
                                >

                                    <input
                                        type="text"
                                        placeholder="Pesquisar curso..."
                                        value={
                                            cursoAberto
                                                ? buscaCurso
                                                : form.curso
                                        }
                                        onFocus={() => {
                                            setCursoAberto(true)
                                            setBuscaCurso('')
                                        }}
                                        onChange={event => {
                                            setBuscaCurso(event.target.value)
                                            setCursoAberto(true)
                                        }}
                                        required={!form.curso}
                                    />

                                    {cursoAberto && (
                                        <div className="curso-options">

                                            {cursosFiltrados.length === 0 && (
                                                <div className="curso-empty">
                                                    Nenhum curso encontrado.
                                                </div>
                                            )}

                                            {cursosFiltrados.map(curso => (
                                                <button
                                                    key={curso.id}
                                                    type="button"
                                                    className="curso-option"
                                                    onClick={() => {
                                                        setForm(prev => ({
                                                            ...prev,
                                                            curso: curso.nome
                                                        }))

                                                        setBuscaCurso(curso.nome)
                                                        setCursoAberto(false)
                                                    }}
                                                >
                                                    <strong>
                                                        {curso.sigla}
                                                    </strong>

                                                    <span>
                                                        {curso.nome}
                                                    </span>
                                                </button>
                                            ))}

                                        </div>
                                    )}

                                </div>

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
                                <p>Informações sobre a participação na liga.</p>
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
                                    placeholder="Ex.: Membro"
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

                        {/* ESTÁGIO */}

                        <div className="modal-section-title">
                            <i className="fa-solid fa-briefcase"></i>

                            <div>
                                <h3>Estágio</h3>
                                <p>Informações profissionais do aluno.</p>
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
                                    Cadastrando...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-plus"></i>
                                    Cadastrar aluno
                                </>
                            )}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}
