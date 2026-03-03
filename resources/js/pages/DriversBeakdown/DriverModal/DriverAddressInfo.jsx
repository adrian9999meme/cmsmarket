export default function DriverAddressInfo({ form, onChange }) {
    return (
        <>
            <div className="row">
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={form.country}
                        onChange={(e) => onChange("country", e.target.value)}
                    >
                        <option value="">Select Country</option>
                    </select>
                </div>

                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={form.state}
                        onChange={(e) => onChange("state", e.target.value)}
                    >
                        <option value="">Select State</option>
                    </select>
                </div>

                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={form.city}
                        onChange={(e) => onChange("city", e.target.value)}
                    >
                        <option value="">Select City</option>
                    </select>
                </div>
            </div>

            <textarea
                className="form-control mt-3"
                rows="3"
                placeholder="Address"
                value={form.address}
                onChange={(e) => onChange("address", e.target.value)}
            />
        </>
    );
}