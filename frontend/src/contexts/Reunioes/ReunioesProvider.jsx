import {
    useState,
    useCallback
} from 'react'

import ReunioesContext from './ReunioesContext'

import {
    listarReunioes
} from '@/api/api'


export default function ReunioesProvider({
    children
}) {

    const [reunioes, setReunioes] =
        useState([])

    const [carregando, setCarregando] =
        useState(false)

    const [erro, setErro] =
        useState(null)


    const carregarReunioes =
        useCallback(
            async (equipeId = null) => {

                try {

                    setCarregando(true)

                    setErro(null)

                    const dados =
                        await listarReunioes(
                            equipeId
                        )

                    setReunioes(
                        dados || []
                    )

                } catch (error) {

                    setErro(
                        error.message ||
                        'Erro ao carregar reuniões'
                    )

                } finally {

                    setCarregando(false)

                }

            },
            []
        )


    const adicionarReuniao =
        useCallback(
            (novaReuniao) => {

                setReunioes(prev => [
                    novaReuniao,
                    ...prev
                ])

            },
            []
        )


    const atualizarReuniaoNoEstado =
        useCallback(
            (
                reuniaoId,
                reuniaoAtualizada
            ) => {

                setReunioes(prev =>
                    prev.map(reuniao =>
                        reuniao.id === reuniaoId
                            ? reuniaoAtualizada
                            : reuniao
                    )
                )

            },
            []
        )


    const removerReuniao =
        useCallback(
            reuniaoId => {

                setReunioes(prev =>
                    prev.filter(
                        reuniao =>
                            reuniao.id !== reuniaoId
                    )
                )

            },
            []
        )


    const value = {

        reunioes,

        carregando,

        erro,

        carregarReunioes,

        adicionarReuniao,

        atualizarReuniaoNoEstado,

        removerReuniao

    }


    return (

        <ReunioesContext.Provider
            value={value}
        >
            {children}
        </ReunioesContext.Provider>

    )
}