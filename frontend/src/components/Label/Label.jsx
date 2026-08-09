import './Label.css'

export default function Label({ value, variant }) {
    return (
        <label className={variant}>{value}</label>
    )
}