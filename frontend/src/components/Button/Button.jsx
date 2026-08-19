import './Button.css'

export default function Button({ label, variant, onClick, disabled }){
    return (
        <button className={variant} disabled={disabled} onClick={onClick}>{label}</button>
    )
}