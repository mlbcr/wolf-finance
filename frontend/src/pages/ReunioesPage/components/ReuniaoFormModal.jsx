import { useState } from 'react'

import Button from '@/components/Button/Button'


function criarDadosIniciais(reuniao) {

    return {
        titulo:
            reuniao?.titulo || '',

        descricao:
            reuniao?.descricao || '',

        data:
            reuniao?.data || '',

        hora_inicio:
            reuniao?.hora_inicio
                ? reuniao.hora_inicio.substring(0, 5)
                : '',

        hora_fim:
            reuniao?.hora_fim
                ? reuniao.hora_fim.substring(0, 5)
                : ''
    }

}


export default function ReuniaoFormModal({
    reuniao,
    onSalvar,
    onFechar,
    salvando
}) {

    const [dados, setDados] =
        useState(() =>
            criarDadosIniciais(reuniao)
        )


    function atualizarCampo(
        campo,
        valor
    ) {

        setDados(prev => ({
            ...prev,
            [campo]: valor
        }))

    }


    function handleSubmit(e) {

        e.preventDefault()

        onSalvar(dados)

    }


    return (

        <div
            className="modal-overlay"
            onClick={
                salvando
                    ? undefined
                    : onFechar
            }
        >
            <div
                className="modal-container reuniao-form-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >
                <div className="modal-header">

                    <h2>
                        {reuniao
                            ? 'Editar Reunião'
                            : 'Nova Reunião'
                        }
                    </h2>

                    <Button
                        type="button"
                        variant="btn-fechar"
                        onClick={onFechar}
                        disabled={salvando}
                    >
                        <i className="fa-solid fa-times" />
                    </Button>
                </div>

                <form
                    onSubmit={handleSubmit}
                >

                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="titulo">
                                Título
                            </label>

                            <input
                                id="titulo"
                                type="text"
                                value={dados.titulo}
                                disabled={salvando}
                                required
                                onChange={(e) =>
                                    atualizarCampo(
                                        'titulo',
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="descricao">
                                Descrição
                            </label>

                            <textarea
                                id="descricao"
                                value={dados.descricao}
                                disabled={salvando}
                                rows="4"
                                onChange={(e) =>
                                    atualizarCampo(
                                        'descricao',
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="data">
                                    Data
                                </label>
                                <input
                                    id="data"
                                    type="date"
                                    value={dados.data}
                                    disabled={salvando}
                                    required
                                    onChange={(e) =>
                                        atualizarCampo(
                                            'data',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="hora_inicio">
                                    Início
                                </label>

                                <input
                                    id="hora_inicio"
                                    type="time"
                                    value={dados.hora_inicio}
                                    disabled={salvando}
                                    required
                                    onChange={(e) =>
                                        atualizarCampo(
                                            'hora_inicio',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="hora_fim">
                                    Fim
                                </label>

                                <input
                                    id="hora_fim"
                                    type="time"
                                    value={dados.hora_fim}
                                    disabled={salvando}
                                    required
                                    onChange={(e) =>
                                        atualizarCampo(
                                            'hora_fim',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">

                        <Button
                            type="button"
                            label="Cancelar"
                            variant="btn-cancelar"
                            disabled={salvando}
                            onClick={onFechar}
                        />

                        <Button
                            type="submit"
                            label={
                                reuniao
                                    ? 'Salvar alterações'
                                    : 'Criar reunião'
                            }
                            loadingLabel="Salvando..."
                            variant="btn-salvar"
                            loading={salvando}
                        />
                    </div>
                </form>
            </div>

        </div>
    )
}