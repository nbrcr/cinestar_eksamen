
import "./ConfirmDialog.css"

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-dialog-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            Annuller
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Bekræft
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog

