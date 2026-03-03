import FileUpload from "./FileUpload";


export default function DriverDocuments({ form, onChange }) {
    return (
        <>
            <FileUpload
                label="CV Document"
                onChange={(file) => onChange("cvDocument", file)}
            />

            <FileUpload
                label="Driving License"
                onChange={(file) => onChange("drivingLicense", file)}
            />

            <textarea
                className="form-control mt-3"
                rows="3"
                placeholder="Comments"
                value={form.comments}
                onChange={(e) => onChange("comments", e.target.value)}
            />
        </>
    );
}