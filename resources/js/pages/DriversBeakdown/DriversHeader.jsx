export default function DriversHeader({ onAddNew }) {
    return (
        <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
                <span
                    className="rounded-pill"
                    style={{ width: 30, height: 6, background: "#4f46e5" }}
                />
                <h4 className="mb-0">Drivers Lists</h4>
            </div>

            <button className="btn btn-dark" onClick={onAddNew}>
                + ADD NEW DRIVER
            </button>
        </div>
    );
}