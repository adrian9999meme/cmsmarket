export default function FormInput({
    label,
    required,
    type = "text",
    value,
    onChange,
    placeholder,
}) {
    return (
        <div className="mb-3">
            <label className="form-label">
                {label} {required && "*"}
            </label>
            <input
                type={type}
                className="form-control"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}