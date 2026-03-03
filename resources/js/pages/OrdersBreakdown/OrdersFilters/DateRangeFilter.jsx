const DateRangeFilter = ({ filters, onChange }) => {
  return (
    <div>
      <label className="form-label fw-semibold  text-muted">
        Date Range
      </label>

      <div className="d-flex align-items-center gap-2">
        {/* From */}
        <input
          type="date"
          className="form-control form-control-sm"
          value={filters.date_from || ""}
          onChange={(e) => onChange("date_from", e.target.value)}
        />

        <span className="text-muted ">to</span>

        {/* To */}
        <input
          type="date"
          className="form-control form-control-sm"
          value={filters.date_to || ""}
          onChange={(e) => onChange("date_to", e.target.value)}
        />
      </div>
    </div>
  );
};

export default DateRangeFilter;