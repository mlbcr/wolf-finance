import { useParams } from 'react-router-dom'

export default function EquipePage(){
    const { id } = useParams()

    console.log(id)

    return (
        <div>
            Equipe {id}
        </div>
    )
}