export default function ModalActions({ onClose, onSave }) {
    return (
        <>
            <button className="btn btn-secondary" onClick={onClose}>
                Cancel
            </button>
            <button className="btn btn-dark" onClick={onSave}>
                Save
            </button>
        </>
    );
}