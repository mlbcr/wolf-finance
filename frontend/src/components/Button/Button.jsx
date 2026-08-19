import './Button.css'

export default function Button({
    label,
    variant,
    onClick,
    disabled,
    loading = false,
    loadingLabel = "Carregando...",
    children,
    ...props
}) {
    return (
        <button
            className={`${variant} ${loading ? 'loading' : ''}`}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? loadingLabel : children || label}
        </button>
    )
}