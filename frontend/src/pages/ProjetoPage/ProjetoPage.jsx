import { useParams } from 'react-router-dom'

export default function ProjetoPage(){
    const { id } = useParams()

    console.log(id)

    return (
        <div>
            Projeto {id}
        </div>
    )
}