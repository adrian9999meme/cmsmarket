import FormInput from "./FromInput";

export default function DriverFinancialInfo({ form, onChange }) {
    return (
        <>
            <div className="row mt-3">
                <div className="col-md-6">
                    <FormInput
                        label="Salary"
                        value={form.salary}
                        onChange={(v) => onChange("salary", v)}
                        placeholder="Enter Salary"
                    />
                </div>

                <div className="col-md-6">
                    <FormInput
                        label="Commission Per Delivery"
                        value={form.commission}
                        onChange={(v) => onChange("commission", v)}
                    />
                </div>
            </div>

            <FormInput
                label="Pickup Hub"
                value={form.pickupHub}
                onChange={(v) => onChange("pickupHub", v)}
            />
        </>
    );
}