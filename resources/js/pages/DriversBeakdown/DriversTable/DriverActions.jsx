export default function DriverActions({ onEdit, onDelete }) {
  return (
    <div className="d-inline-flex gap-2">
      <button className="btn btn-light border" onClick={onEdit} title="Edit">
        <i className="bi bi-pencil" />
      </button>

      <div className="dropdown">
        <button
          className="btn btn-light border dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          title="More"
        >
          <i className="bi bi-three-dots-vertical" />
        </button>

        <ul className="dropdown-menu dropdown-menu-end">
          <li>
            <button className="dropdown-item" onClick={onEdit}>
              Edit
            </button>
          </li>
          <li>
            <button className="dropdown-item text-danger" onClick={onDelete}>
              Delete
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}