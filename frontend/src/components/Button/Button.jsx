import './Button.css'

export default function Button({ label, variant, onClick }){
    return (
        <button className={variant} onClick={onClick}>{label}</button>
    )
}