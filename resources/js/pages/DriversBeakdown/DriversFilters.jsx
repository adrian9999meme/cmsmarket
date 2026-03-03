export default function DriversFilters({ pickupHub, keyword, onChange, onSearch }) {
  return (
    <div className="d-flex gap-2">
      <select
        className="form-select"
        style={{ minWidth: 220 }}
        value={pickupHub}
        onChange={(e) => onChange("pickupHub", e.target.value)}
      >
        <option value="all">Pickup Hub</option>
        <option value="hub_a">Hub A</option>
        <option value="hub_b">Hub B</option>
      </select>

      <div className="input-group align-items-center" style={{ minWidth: 280 }}>
        <input
          className="form-control rounded z-1"
          placeholder="Search"
          value={keyword}
          onChange={(e) => onChange("keyword", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch(e.target.value);
          }}
        />
        <span className="position-absolute pe-3 end-0 z-3">
          <i className="bi bi-search" />
        </span>
      </div>
    </div>
  );
}