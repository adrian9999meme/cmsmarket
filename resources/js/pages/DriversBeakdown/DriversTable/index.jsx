import TableHeader from "./TableHeader";
import DriverRow from "./TableRow";


export default function DriversTable({
    loading,
    drivers = [],
    onEdit,
    onDelete,
    onToggleStatus,
}) {
    if (loading) {
        return (
            <div className="py-5 text-center text-muted">
                <div className="spinner-border" role="status" />
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table align-middle">
                <TableHeader />

                <tbody>
                    {drivers?.length === 0 ? (
                        <tr>
                            <td colSpan={11} className="text-center text-muted py-5">
                                No drivers found.
                            </td>
                        </tr>
                    ) : (
                        drivers?.map((driver, index) => (
                            <DriverRow
                                key={driver.id}
                                index={index}
                                driver={driver}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onToggleStatus={onToggleStatus}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}