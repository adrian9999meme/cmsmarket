import React, { useEffect, useState } from "react"
import { createSelector } from "reselect"
import { useSelector } from "react-redux"
import { Row, Col, Card, CardBody } from "reactstrap"
import { Link } from "react-router-dom"

import avatar1 from "../../../images/users/avatar-1.jpg"
import profileImg from "../../../images/profile-img.png"
import "./dashboard.scss"

const WelcomeComp = () => {
  const loginSelector = createSelector(
    state => state.Login,
    login => ({
      user: login.user
    })
  )
  const { user } = useSelector(loginSelector)
  const [currentUser, setCurrentUser] = useState({})
  useEffect(() => (
    setCurrentUser(user)
  ), [user])

  return (
    <React.Fragment>
      <Card className="overflow-hidden">
        <div className="bg-primary-subtle">
          <Row>
            <Col xs="7">
              <div className="text-white p-5">
                <h5 className="text-white">Welcome Back !</h5>
                <p>Lekit Dashboard</p>
              </div>
            </Col>
            <Col xs="5" className="align-self-end">
              <img src={profileImg} alt="" className="img-fluid" />
            </Col>
          </Row>
        </div>
        <CardBody className="pt-0">
          <Row>
            <Col sm="4">
              <div className="avatar-md profile-user-wid mb-4">
                <img
                  src={currentUser.image ? currentUser.image : avatar1}
                  alt=""
                  className="img-thumbnail rounded-circle"
                />
              </div>
              <h5 className="font-size-15 text-truncate">{`${currentUser.first_name} ${currentUser.last_name}`}</h5>
            </Col>

            <Col sm="8">
              <div className="pt-4">
                <Row>
                  <Col xs="6">
                    <h5 className="font-size-15">125</h5>
                    <p className="text-muted mb-0">Projects</p>
                  </Col>
                  <Col xs="6">
                    <h5 className="font-size-15">£1245</h5>
                    <p className="text-muted mb-0">Lekit Revenue</p>
                  </Col>
                </Row>
                <div className="mt-3">
                  <Link
                    to=""
                    className="btn btn-primary  btn-sm"
                  >
                    View Profile <i className="mdi mdi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}
export default WelcomeComp
