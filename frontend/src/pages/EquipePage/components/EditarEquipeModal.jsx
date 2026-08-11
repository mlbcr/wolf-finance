import './EditarEquipeModal.css'

export default function EditarEquipeModal({
    form,
    onChange,
    onClose,
    onSave,
    salvando,
    icones,
    cores,
    membros
}) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-equipe" onClick={event => event.stopPropagation()}>
                <div className="modal-equipe-header">
                    <div>
                        <h2>Editar equipe</h2>
                        <p>Altere as informações da equipe.</p>
                    </div>

                    <button className="modal-close" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="modal-equipe-body">
                    <div className="equipe-preview">
                        <div
                            className="equipe-preview-icon"
                            style={{
                                backgroundColor: `${form.cor}20`,
                                color: form.cor
                            }}
                        >
                            <i className={`fa-solid ${form.icone}`}></i>
                        </div>

                        <div>
                            <strong>{form.nome || 'Nome da equipe'}</strong>
                            <span>{form.descricao || 'Descrição da equipe'}</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Nome da equipe</label>
                        <input
                            type="text"
                            name="nome"
                            value={form.nome}
                            onChange={onChange}
                            placeholder="Ex: Quant Research"
                        />
                    </div>

                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea
                            name="descricao"
                            value={form.descricao}
                            onChange={onChange}
                            placeholder="Descreva a responsabilidade da equipe..."
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Líder</label>
                        <select name="lider_id" value={form.lider_id} onChange={onChange}>
                            <option value="">Sem líder</option>
                            {membros.map(membro => (
                                <option key={membro.id} value={String(membro.id)}>
                                    {membro.nome_completo}
                                </option>
                            ))}
                        </select>
                        <small>Escolha um líder para esta equipe ou deixe vazio.</small>
                    </div>

                    <div className="form-group">
                        <label>Ícone</label>
                        <div className="icones-grid">
                            {icones.map(icone => (
                                <button
                                    type="button"
                                    key={icone}
                                    className={`icone-option ${form.icone === icone ? 'selected' : ''}`}
                                    onClick={() => onChange({ target: { name: 'icone', value: icone } })}
                                    style={{ color: form.icone === icone ? form.cor : undefined }}
                                >
                                    <i className={`fa-solid ${icone}`}></i>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Cor</label>
                        <div className="cores-grid">
                            {cores.map(cor => (
                                <button
                                    type="button"
                                    key={cor}
                                    className={`cor-option ${form.cor === cor ? 'selected' : ''}`}
                                    onClick={() => onChange({ target: { name: 'cor', value: cor } })}
                                    style={{ backgroundColor: cor }}
                                >
                                    {form.cor === cor && <i className="fa-solid fa-check"></i>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="modal-equipe-actions">
                    <button className="btn-cancelar" onClick={onClose} disabled={salvando}>
                        Cancelar
                    </button>
                    <button className="btn-salvar-equipe" onClick={onSave} disabled={salvando}>
                        {salvando ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                Salvando...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-check"></i>
                                Salvar alterações
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
