const defaultAvatar = "images/default_driver.png";

export default function DriverInfo({ name, email, avatarUrl }) {
    return (
        <div className="d-flex align-items-center gap-3">
            <img
                src={`storage/${avatarUrl}` || `storage/${defaultAvatar}`}
                alt={name}
                className="rounded-circle"
                style={{ width: 42, height: 42, objectFit: "cover" }}
            />

            <div>
                <div className="fw-semibold">{name}</div>
                <div className="text-muted small d-flex align-items-center gap-2">
                    <span
                        className="rounded-circle"
                        style={{ width: 8, height: 8, background: "#22c55e" }}
                        title="online"
                    />
                    <span>{email}</span>
                </div>
            </div>
        </div>
    );
}