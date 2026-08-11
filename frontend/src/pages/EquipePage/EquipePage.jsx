import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import {
    buscarEquipe,
    buscarMembrosEquipe,
    buscarAlunos,
    atualizarEquipe,
    adicionarMembrosEquipe,
    removerMembroEquipe
} from '@/api/api'

import useAuth from '@/contexts/useAuth'

import ConfirmarAcaoModal from './components/ConfirmarAcaoModal/ConfirmarAcaoModal'
import EquipeHeader from './components/EquipeHeader'
import MembrosSection from './components/MembrosSection'
import EditarEquipeModal from './components/EditarEquipeModal'
import AdicionarMembrosModal from './components/AdicionarMembrosModal'

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

    const [alunos, setAlunos] = useState([])
    const [adicionandoMembros, setAdicionandoMembros] = useState(false)
    const [salvandoMembros, setSalvandoMembros] = useState(false)

    const [membroParaRemover, setMembroParaRemover] = useState(null)
    const [removendoMembro, setRemovendoMembro] = useState(false)

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
            lider_id: equipe.lider_id
                ? String(equipe.lider_id)
                : '',
            icone: equipe.icone || 'fa-users',
            cor: equipe.cor || '#3157d5'
        })

        setEditando(true)
    }

    async function handleSalvar() {
        setSalvando(true)

        try {
            const equipeAtualizada = await atualizarEquipe(id, {
                nome: form.nome,
                descricao: form.descricao || null,
                lider_id: form.lider_id || null,
                icone: form.icone,
                cor: form.cor
            })

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
                    dadosMembros,
                    dadosAlunos
                ] = await Promise.all([
                    buscarEquipe(id),
                    buscarMembrosEquipe(id),
                    buscarAlunos()
                ])

                console.log('ALUNOS RECEBIDOS:', dadosAlunos)
                console.log('QUANTIDADE:', dadosAlunos.length)

                setEquipe(dadosEquipe)
                setMembros(dadosMembros)
                setAlunos(dadosAlunos)

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

    const lider = membros.find(
        membro =>
            String(membro.id) === String(equipe.lider_id)
    )

    const displayLeader = editando
        ? membros.find(
            membro =>
                String(membro.id) ===
                String(form.lider_id)
        )
        : lider

    function handleRemoveMember(memberId) {
        // Não permite remover o líder
        if (
            String(memberId) ===
            String(equipe.lider_id)
        ) {
            return
        }

        const membro = membros.find(
            membro =>
                String(membro.id) ===
                String(memberId)
        )

        if (!membro) {
            return
        }

        setMembroParaRemover(membro)
    }

    async function confirmarRemocaoMembro() {
        if (!membroParaRemover) {
            return
        }

        setRemovendoMembro(true)

        try {
            await removerMembroEquipe(
                id,
                membroParaRemover.id
            )

            setMembros(prev =>
                prev.filter(
                    membro =>
                        String(membro.id) !==
                        String(membroParaRemover.id)
                )
            )

            setMembroParaRemover(null)

        } catch (error) {
            console.error(error)
            alert('Não foi possível remover o membro.')

        } finally {
            setRemovendoMembro(false)
        }
    }

    async function handleAdicionarMembros(alunoIds) {
        setSalvandoMembros(true)

        try {
            await adicionarMembrosEquipe(
                id,
                alunoIds
            )

            const novosMembros =
                await buscarMembrosEquipe(id)

            setMembros(novosMembros)
            setAdicionandoMembros(false)

        } catch (error) {
            console.error(error)
            alert('Não foi possível adicionar os membros.')

        } finally {
            setSalvandoMembros(false)
        }
    }

    function handleAddMember() {
        setAdicionandoMembros(true)
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

            <EquipeHeader
                equipe={equipe}
                leader={displayLeader}
                onEdit={abrirEdicao}
                isAdmin={usuario?.tipo === 'ADMIN'}
            />

            <section className="equipe-content">

                <MembrosSection
                    membros={membros}
                    leaderId={equipe.lider_id}
                    onAdd={handleAddMember}
                    onRemove={handleRemoveMember}
                />

            </section>

            {editando && (
                <EditarEquipeModal
                    form={form}
                    onChange={handleChange}
                    onClose={() => setEditando(false)}
                    onSave={handleSalvar}
                    salvando={salvando}
                    icones={icones}
                    cores={cores}
                    membros={membros}
                />
            )}

            {adicionandoMembros && (
                <AdicionarMembrosModal
                    alunos={alunos}
                    membros={membros}
                    onClose={() =>
                        setAdicionandoMembros(false)
                    }
                    onAdd={handleAdicionarMembros}
                    salvando={salvandoMembros}
                />
            )}

            {membroParaRemover && (
                <ConfirmarAcaoModal
                    titulo="Remover membro?"
                    mensagem={`Tem certeza que deseja remover ${membroParaRemover.nome_completo} desta equipe?`}
                    onClose={() =>
                        setMembroParaRemover(null)
                    }
                    onConfirm={confirmarRemocaoMembro}
                    confirmando={removendoMembro}
                    textoConfirmar="Remover membro"
                />
            )}

        </main>
    )
}

