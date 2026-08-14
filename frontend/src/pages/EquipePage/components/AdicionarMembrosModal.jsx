import { useMemo, useState } from 'react'

import './AdicionarMembrosModal.css'
import SearchBar from '@/components/SearchBar/SearchBar'

export default function AdicionarMembrosModal({
    alunos,
    membros,
    onClose,
    onAdd,
    salvando
}) {
    const [selecionados, setSelecionados] = useState([])
    const [busca, setBusca] = useState('')

    const idsMembros = new Set(
        membros.map(membro => String(membro.id))
    )

    const alunosDisponiveis = useMemo(() => {
        return alunos
            .filter(aluno => !idsMembros.has(String(aluno.id)))
            .filter(aluno => {
                const termo = busca.toLowerCase()

                return (
                    aluno.nome_completo.toLowerCase().includes(termo) ||
                    aluno.email.toLowerCase().includes(termo) ||
                    aluno.matricula.toLowerCase().includes(termo)
                )
            })
    }, [alunos, membros, busca])

    function toggleAluno(alunoId) {
        const id = String(alunoId)

        setSelecionados(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id)
            }

            return [...prev, id]
        })
    }

    function handleSubmit() {
        if (selecionados.length === 0) {
            return
        }

        onAdd(selecionados)
    }

    return (
        <div className="modal-overlay">
            <div className="adicionar-membros-modal">

                <div className="modal-header">
                    <div>
                        <h2>Adicionar membros</h2>
                        <p>
                            Selecione os alunos que deseja adicionar à equipe.
                        </p>
                    </div>

                    <button
                        className="modal-close"
                        onClick={onClose}
                        disabled={salvando}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <SearchBar
                    className="membros-search"
                    placeholder="Buscar por nome, e-mail ou matrícula..."
                    value={busca}
                    onChange={event => setBusca(event.target.value)}
                />

                <div className="alunos-list">

                    {alunosDisponiveis.length === 0 && (
                        <div className="empty-members">
                            <i className="fa-solid fa-users"></i>

                            <p>
                                Nenhum aluno disponível.
                            </p>
                        </div>
                    )}

                    {alunosDisponiveis.map(aluno => {
                        const selecionado = selecionados.includes(
                            String(aluno.id)
                        )

                        return (
                            <button
                                key={aluno.id}
                                type="button"
                                className={`aluno-option ${selecionado ? 'selected' : ''
                                    }`}
                                onClick={() => toggleAluno(aluno.id)}
                            >
                                <div className="aluno-avatar">
                                    {aluno.nome_completo
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div className="aluno-info">
                                    <strong>
                                        {aluno.nome_completo}
                                    </strong>

                                    <span>
                                        {aluno.matricula}
                                    </span>
                                </div>

                                <div className="aluno-check">
                                    {selecionado && (
                                        <i className="fa-solid fa-check"></i>
                                    )}
                                </div>
                            </button>
                        )
                    })}

                </div>

                <div className="modal-footer">

                    <span>
                        {selecionados.length}{' '}
                        {selecionados.length === 1
                            ? 'membro selecionado'
                            : 'membros selecionados'}
                    </span>

                    <div className="modal-actions">
                        <button
                            className="cancel-button"
                            onClick={onClose}
                            disabled={salvando}
                        >
                            Cancelar
                        </button>

                        <button
                            className="confirm-button"
                            onClick={handleSubmit}
                            disabled={
                                selecionados.length === 0 ||
                                salvando
                            }
                        >
                            {salvando
                                ? 'Adicionando...'
                                : 'Adicionar membros'}
                        </button>
                    </div>

                </div>

            </div>
        </div>
    )
}