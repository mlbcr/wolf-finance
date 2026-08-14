import React from 'react'

export default function SearchBar({
    className = '',
    value = '',
    onChange = () => { },
    placeholder = 'Buscar...'
}) {
    return (
        <div className={className}>
            <i className="fa-solid fa-magnifying-glass"></i>

            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}
