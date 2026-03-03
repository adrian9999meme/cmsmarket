import React from "react";

const SearchFilter = ({ value, onChange, onKeyDown }) => {
  return (
    <div>
      <label className="form-label  fw-semibold text-muted">
        Search
      </label>

      <div className="input-group input-group-sm">
        <span className="input-group-text bg-light">
          <i className="bi bi-search"></i>
        </span>

        <input
          type="text"
          className="form-control"
          placeholder="Search orders..."
          value={value || ""}
          onChange={(e) => onChange("keyword", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onKeyDown(e.target.value);
            }
          }}
        />
      </div>
    </div>
  );
};

export default SearchFilter;