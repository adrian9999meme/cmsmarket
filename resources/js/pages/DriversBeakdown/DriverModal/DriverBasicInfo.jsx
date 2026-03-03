import FileUpload from "./FileUpload";
import FormInput from "./FromInput";
import ImagePreview from "./ImagePreview";


export default function DriverBasicInfo({ form, onChange }) {
    return (
        <>
            <div className="row">
                <div className="col-md-6">
                    <FormInput
                        label="First Name"
                        required
                        value={form.firstName}
                        onChange={(v) => onChange("firstName", v)}
                        placeholder="Enter First Name"
                    />
                </div>

                <div className="col-md-6">
                    <FormInput
                        label="Last Name"
                        required
                        value={form.lastName}
                        onChange={(v) => onChange("lastName", v)}
                        placeholder="Enter Last Name"
                    />
                </div>
            </div>

            <FormInput
                label="Email"
                required
                type="email"
                value={form.email}
                onChange={(v) => onChange("email", v)}
                placeholder="Enter Email Address"
            />

            <FormInput
                label="Password"
                required
                type="password"
                value={form.password}
                onChange={(v) => onChange("password", v)}
            />

            <FormInput
                label="Confirm Password"
                type="password"
                value={form.confirmPassword}
                onChange={(v) => onChange("confirmPassword", v)}
            />

            <ImagePreview file={form.profileImage} />
            <FileUpload
                label="Profile Image"
                onChange={(file) => onChange("profileImage", file)}
            />
        </>
    );
}