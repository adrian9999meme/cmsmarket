import React from "react";
import './_dashboardInsightCard.scss'

const DashboardInsightCard = ({
    title,
    value,
    variant = "warning",
    icon,
}) => {
    return (
        <div className={`dashboard-card card border-0 shadow-sm dashboard-card--${variant}`}>
            <div className="card-body d-flex justify-content-between align-items-center">

                <div>
                    <h6 className="dashboard-card__title mb-2">
                        {title}
                    </h6>
                    <h1 className="dashboard-card__value mb-0">
                        {value}
                    </h1>
                </div>

                <div className="dashboard-card__icon">
                    {icon}
                </div>

            </div>
        </div>
    );
};

export default DashboardInsightCard;