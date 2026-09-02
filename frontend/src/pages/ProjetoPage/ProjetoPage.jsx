import { useParams } from 'react-router-dom'
import BackButton from '@/components/BackButton/BackButton'

export default function ProjetoPage() {
    const { id } = useParams()

    console.log(id)

    return (
        <div>
            <BackButton />
            Projeto {id}
        </div>
    )
}