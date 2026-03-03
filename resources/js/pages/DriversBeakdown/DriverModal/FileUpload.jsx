export default function FileUpload({ label, onChange }) {
    return (
        <div className="mb-3">
            <label className="form-label">{label}</label>
            <input
                type="file"
                className="form-control"
                onChange={(e) => onChange(e.target.files[0])}
            />
        </div>
    );
}