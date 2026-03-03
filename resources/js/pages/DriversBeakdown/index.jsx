import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useParams } from "react-router-dom";

import DriversHeader from "./DriversHeader";
import DriversFilters from "./DriversFilters";
import DriversTable from "./DriversTable";
import { getDrivers } from "../../store/drivers/action";
import DriverModal from "./DriverModal";

export default function DriversBreakdown() {
    const dispatch = useDispatch()
    const { subdomain } = useParams()
    const [loading, setLoading] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({
        pickupHub: "all",
        keyword: "",
    });

    const driverSelector = createSelector(
        (state) => state.drivers,
        (drivers) => ({
            allDrivers: drivers.drivers,
        })
    )
    const { allDrivers } = useSelector(driverSelector)

    const filtersRef = useRef(filters);

    useEffect(() => {
        filtersRef.current = filters
    }, [filters])

    useEffect(() => {
        dispatch(getDrivers(filtersRef.current));
    }, [filters.pickupHub])

    useEffect(() => {
        setDrivers(allDrivers)
    }, [allDrivers])

    // simulate API
    useEffect(() => {
        dispatch(getDrivers(filters));
    }, [dispatch]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleSearchChange = (keyword) => {
        setFilters((prev) => ({ ...prev, keyword: keyword }));
        dispatch(getDrivers(filtersRef.current))
    };

    const handleAddNew = () => {
        setShowModal(true);
    };

    const handleEdit = (driver) => {
        alert(`Edit driver: ${driver.name}`);
    };

    const handleToggleStatus = async (driverId, nextValue) => {
        // optimistic update
        setDrivers((prev) =>
            prev.map((d) => (d.id === driverId ? { ...d, active: nextValue } : d))
        );

        // TODO: call API
        // await api.patch(`/drivers/${driverId}`, { active: nextValue });
    };

    const handleDelete = (driver) => {
        if (!confirm(`Delete ${driver.name}?`)) return;
        setDrivers((prev) => prev.filter((d) => d.id !== driver.id));
    };

    return (
        <div className="page-content">
            <div className="container-fluid py-4">
                <DriversHeader onAddNew={handleAddNew} />

                <DriverModal show={showModal} onClose={() => setShowModal(false)} onSubmit={() => setShowModal(false)}/>

                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h5 className="mb-0">Drivers</h5>

                            <DriversFilters
                                pickupHub={filters.pickupHub}
                                keyword={filters.keyword}
                                onChange={handleFilterChange}
                                onSearch={handleSearchChange}
                            />
                        </div>

                        <DriversTable
                            loading={loading}
                            drivers={drivers}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}