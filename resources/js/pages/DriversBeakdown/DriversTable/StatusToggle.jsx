export default function StatusToggle({ checked, onChange }) {
    return (
        <div className="form-check form-switch m-0">
            <input
                className="form-check-input"
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
        </div>
    );
}