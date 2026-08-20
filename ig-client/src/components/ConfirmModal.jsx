import { LoaderIcon } from "react-hot-toast";

const ConfirmModal = ({
  show,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!show) return null;
  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onCancel} disabled={loading}></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger d-flex align-items-center justify-content-center"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading && <LoaderIcon className="me-2 spin-animation" size={18} />}
              {loading ? "Deleting..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;