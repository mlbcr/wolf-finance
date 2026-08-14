import React from 'react'

export default function Modal({
    onClose,
    children,
    overlayClassName = 'modal-overlay',
    containerClassName = 'modal'
}) {
    return (
        <div className={overlayClassName} onClick={onClose}>
            <div className={containerClassName} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}
