import React from "react";

const EmptyState = () => {
  return (
    <tr>
      <td colSpan="9" className="text-center py-5">
        <div className="d-flex flex-column align-items-center">
          <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
          <h6 className="mb-1 fw-semibold">No Orders Found</h6>
          <p className="text-muted mb-0 small">
            Try adjusting your filters or search criteria.
          </p>
        </div>
      </td>
    </tr>
  );
};

export default EmptyState;