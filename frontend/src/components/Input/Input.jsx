import './Input.css'

export default function Input({ value, variant, type, onChange, placeholder }) {
    return (
        <input
            type={type}
            className={variant}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    )
}