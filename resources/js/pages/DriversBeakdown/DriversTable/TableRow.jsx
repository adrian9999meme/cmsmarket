import DriverActions from "./DriverActions";
import DriverInfo from "./DriverInfo";
import StatusToggle from "./StatusToggle";
import { money } from "./formatters";


export default function DriverRow({
    index,
    driver,
    onEdit,
    onDelete,
    onToggleStatus,
}) {
    return (
        <tr>
            <td className="text-muted">{index + 1}</td>

            <td>
                <DriverInfo
                    name={driver.full_name}
                    email={driver.email}
                    avatarUrl={driver.images.image_40x40}
                />
            </td>

            <td>{driver.phone || <span className="text-muted">—</span>}</td>
            <td>{driver.last_login || <span className="text-muted">—</span>}</td>

            <td>{money(driver.delivery_hero?.currency)}</td>
            <td>{driver.pickup_hub_id || <span className="text-muted">—</span>}</td>

            <td>
                <StatusToggle
                    checked={!!driver.status}
                    onChange={(next) => onToggleStatus(driver.id, next)}
                />
            </td>

            <td>{money(driver.balance)}</td>
            <td>{money(driver.delivery_hero?.total_collection || '-')}</td>
            <td>{money(driver.delivery_hero?.total_commission || '-')}</td>

            <td className="text-end">
                <DriverActions
                    onEdit={() => onEdit(driver)}
                    onDelete={() => onDelete(driver)}
                />
            </td>
        </tr>
    );
}