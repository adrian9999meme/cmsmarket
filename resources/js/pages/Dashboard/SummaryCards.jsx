import { Col, Row } from "reactstrap"

import DashboardInsightCard from "../../components/Common/DashboardInsigthCard"

const SummaryCards = () => {
    return (
        <>
            <Row className="mb-4">
                <Col md={4} className="mb-3 mb-md-0">
                    <DashboardInsightCard
                        title="Live Deliveries"
                        value="68"
                        icon={<i className="bi bi-truck"></i>}
                        variant="primary"
                    />
                </Col>
                <Col md={4} className="mb-3 mb-md-0">
                    <DashboardInsightCard
                        title="Pending Orders"
                        value="32"
                        icon={<i className="bi bi-hourglass-split"></i>}
                        variant="danger"
                    />
                </Col>
                <Col md={4}>
                    <DashboardInsightCard
                        title="Today’s Orders"
                        value="145"
                        icon={<i className="bi bi-basket"></i>}
                        variant="success"
                    />
                </Col>
            </Row>
            <Row className="mb-4">
                <Col md={4} className="mb-3 mb-md-0">
                    <DashboardInsightCard
                        title="Drivers Online"
                        value="24"
                        icon={<i className="bi bi-person-badge"></i>}
                        variant="cyan"
                    />
                </Col>
                <Col md={4} className="mb-3 mb-md-0">
                    <DashboardInsightCard
                        title="New Customers"
                        value="17"
                        icon={<i className="bi bi-person-plus"></i>}
                        variant="purple"
                    />
                </Col>
                <Col md={4}>
                    <DashboardInsightCard
                        title="New Support Tickets"
                        value="5"
                        icon={<i className="bi bi-chat-dots"></i>}
                        variant="pink"
                    />
                </Col>
            </Row>
        </>
    )
}

export default SummaryCards