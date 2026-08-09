import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import {
    buscarEquipe,
    buscarMembrosEquipe,
    atualizarEquipe
} from '@/api/api'

import useAuth from '@/contexts/useAuth'

import './EquipePage.css'

export default function EquipePage() {

    const { id } = useParams()
    const navigate = useNavigate()

    const { usuario } = useAuth()

    const [equipe, setEquipe] = useState(null)
    const [membros, setMembros] = useState([])

    const [loading, setLoading] = useState(true)
    const [editando, setEditando] = useState(false)
    const [salvando, setSalvando] = useState(false)

    const [form, setForm] = useState({
        nome: '',
        descricao: '',
        lider_id: '',
        icone: 'fa-users',
        cor: '#3157d5'
    })


    const icones = [
        'fa-users',
        'fa-user-group',
        'fa-coins',
        'fa-chart-line',
        'fa-chart-column',
        'fa-chart-pie',
        'fa-money-bill-trend-up',
        'fa-building-columns',
        'fa-magnifying-glass-chart',
        'fa-calculator',
        'fa-briefcase',
        'fa-code',
        'fa-bullhorn',
        'fa-handshake'
    ]


    const cores = [
        '#3157d5',
        '#6c4fd3',
        '#008f68',
        '#d18b00',
        '#d65353',
        '#008ca8',
        '#a03ca5',
        '#555555'
    ]


    function handleChange(event) {

        const { name, value } = event.target

        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }


    function abrirEdicao() {

        setForm({
            nome: equipe.nome,
            descricao: equipe.descricao || '',
            lider_id: equipe.lider_id || '',
            icone: equipe.icone || 'fa-users',
            cor: equipe.cor || '#3157d5'
        })

        setEditando(true)
    }


    async function handleSalvar() {

        setSalvando(true)

        try {

            const equipeAtualizada = await atualizarEquipe(
                id,
                {
                    nome: form.nome,
                    descricao: form.descricao || null,
                    lider_id: form.lider_id || null,
                    icone: form.icone,
                    cor: form.cor
                }
            )

            setEquipe(equipeAtualizada)

            setEditando(false)

        } catch (error) {

            console.error(error)

            alert('Não foi possível atualizar a equipe')

        } finally {

            setSalvando(false)

        }
    }


    useEffect(() => {

        async function carregarEquipe() {

            try {

                const [
                    dadosEquipe,
                    dadosMembros
                ] = await Promise.all([
                    buscarEquipe(id),
                    buscarMembrosEquipe(id)
                ])

                setEquipe(dadosEquipe)
                setMembros(dadosMembros)

            } catch (error) {

                console.error(error)

            } finally {

                setLoading(false)

            }
        }

        carregarEquipe()

    }, [id])


    if (loading) {
        return <p>Carregando...</p>
    }


    if (!equipe) {
        return <p>Equipe não encontrada.</p>
    }


    return (
        <main className="equipe-page">

            <button
                className="voltar-button"
                onClick={() => navigate('/equipes')}
            >
                <i className="fa-solid fa-arrow-left"></i>
                Voltar para equipes
            </button>


            {/* HEADER */}

            <section className="equipe-header">

                <div
                    className="equipe-icon"
                    style={{
                        backgroundColor: `${equipe.cor}20`,
                        color: equipe.cor
                    }}
                >
                    <i
                        className={`fa-solid ${equipe.icone || 'fa-users'}`}
                    ></i>
                </div>


                <div className="equipe-header-info">

                    <span className="equipe-status">
                        <i className="fa-solid fa-circle"></i>
                        {equipe.status}
                    </span>

                    <h1>
                        {equipe.nome}
                    </h1>

                    <p>
                        {equipe.descricao || 'Sem descrição'}
                    </p>

                </div>


                {usuario?.tipo === 'ADMIN' && (

                    <button
                        className="btn-editar-equipe"
                        onClick={abrirEdicao}
                    >
                        <i className="fa-solid fa-pen"></i>
                        Editar equipe
                    </button>

                )}

            </section>


            {/* MEMBROS */}

            <section className="equipe-content">

                <div className="equipe-section">

                    <div className="section-title">

                        <div>

                            <h2>
                                Membros
                            </h2>

                            <p>
                                Pessoas que fazem parte desta equipe.
                            </p>

                        </div>

                        <span className="membros-count">
                            {membros.length}
                        </span>

                    </div>


                    <div className="membros-list">

                        {membros.map(membro => {

                            const iniciais = membro.nome_completo
                                .split(' ')
                                .map(nome => nome[0])
                                .slice(0, 2)
                                .join('')

                            return (

                                <div
                                    key={membro.id}
                                    className="membro-card"
                                >

                                    <div className="membro-avatar">
                                        {iniciais}
                                    </div>


                                    <div className="membro-info">

                                        <strong>
                                            {membro.nome_completo}
                                        </strong>

                                        <span>
                                            {membro.email}
                                        </span>

                                    </div>


                                    <div className="membro-meta">

                                        {membro.cargo && (
                                            <span>
                                                {membro.cargo}
                                            </span>
                                        )}

                                        <small>
                                            {membro.matricula}
                                        </small>

                                    </div>

                                </div>

                            )
                        })}

                    </div>


                    {membros.length === 0 && (

                        <div className="sem-membros">

                            <i className="fa-solid fa-user-group"></i>

                            <h3>
                                Nenhum membro
                            </h3>

                            <p>
                                Esta equipe ainda não possui membros.
                            </p>

                        </div>

                    )}

                </div>

            </section>


            {/* MODAL DE EDIÇÃO */}

            {editando && (

                <div
                    className="modal-overlay"
                    onClick={() => setEditando(false)}
                >

                    <div
                        className="modal-equipe"
                        onClick={event => event.stopPropagation()}
                    >

                        <div className="modal-equipe-header">

                            <div>

                                <h2>
                                    Editar equipe
                                </h2>

                                <p>
                                    Altere as informações da equipe.
                                </p>

                            </div>


                            <button
                                className="modal-close"
                                onClick={() => setEditando(false)}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>

                        </div>


                        <div className="modal-equipe-body">

                            {/* PREVIEW */}

                            <div className="equipe-preview">

                                <div
                                    className="equipe-preview-icon"
                                    style={{
                                        backgroundColor: `${form.cor}20`,
                                        color: form.cor
                                    }}
                                >
                                    <i
                                        className={`fa-solid ${form.icone}`}
                                    ></i>
                                </div>

                                <div>
                                    <strong>
                                        {form.nome || 'Nome da equipe'}
                                    </strong>

                                    <span>
                                        {form.descricao ||
                                            'Descrição da equipe'}
                                    </span>
                                </div>

                            </div>


                            {/* NOME */}

                            <div className="form-group">

                                <label>
                                    Nome da equipe
                                </label>

                                <input
                                    type="text"
                                    name="nome"
                                    value={form.nome}
                                    onChange={handleChange}
                                    placeholder="Ex: Quant Research"
                                />

                            </div>


                            {/* DESCRIÇÃO */}

                            <div className="form-group">

                                <label>
                                    Descrição
                                </label>

                                <textarea
                                    name="descricao"
                                    value={form.descricao}
                                    onChange={handleChange}
                                    placeholder="Descreva a responsabilidade da equipe..."
                                    rows="3"
                                />

                            </div>


                            {/* LÍDER */}

                            <div className="form-group">

                                <label>
                                    ID do líder
                                </label>

                                <input
                                    type="text"
                                    name="lider_id"
                                    value={form.lider_id}
                                    onChange={handleChange}
                                    placeholder="UUID do aluno líder"
                                />

                                <small>
                                    Você pode deixar vazio caso a equipe
                                    ainda não tenha líder.
                                </small>

                            </div>


                            {/* ÍCONE */}

                            <div className="form-group">

                                <label>
                                    Ícone
                                </label>

                                <div className="icones-grid">

                                    {icones.map(icone => (

                                        <button
                                            type="button"
                                            key={icone}
                                            className={
                                                `icone-option ${
                                                    form.icone === icone
                                                        ? 'selected'
                                                        : ''
                                                }`
                                            }
                                            onClick={() =>
                                                setForm(prev => ({
                                                    ...prev,
                                                    icone
                                                }))
                                            }
                                            style={{
                                                color:
                                                    form.icone === icone
                                                        ? form.cor
                                                        : undefined
                                            }}
                                        >
                                            <i
                                                className={`fa-solid ${icone}`}
                                            ></i>
                                        </button>

                                    ))}

                                </div>

                            </div>


                            {/* COR */}

                            <div className="form-group">

                                <label>
                                    Cor
                                </label>

                                <div className="cores-grid">

                                    {cores.map(cor => (

                                        <button
                                            type="button"
                                            key={cor}
                                            className={
                                                `cor-option ${
                                                    form.cor === cor
                                                        ? 'selected'
                                                        : ''
                                                }`
                                            }
                                            onClick={() =>
                                                setForm(prev => ({
                                                    ...prev,
                                                    cor
                                                }))
                                            }
                                            style={{
                                                backgroundColor: cor
                                            }}
                                        >

                                            {form.cor === cor && (
                                                <i className="fa-solid fa-check"></i>
                                            )}

                                        </button>

                                    ))}

                                </div>

                            </div>

                        </div>


                        {/* AÇÕES */}

                        <div className="modal-equipe-actions">

                            <button
                                className="btn-cancelar"
                                onClick={() => setEditando(false)}
                                disabled={salvando}
                            >
                                Cancelar
                            </button>

                            <button
                                className="btn-salvar-equipe"
                                onClick={handleSalvar}
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

                    </div>

                </div>
            )}
        </main>
    )
}