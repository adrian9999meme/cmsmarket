import React from "react"
import { Card, CardBody, CardTitle, Col, Progress, Row } from "reactstrap"

import "./dashboard.scss"

const TopSellingStores = () => {
  return (
    <React.Fragment>
      <Card className="">
        <CardBody>
          <CardTitle className="mb-2">Top Selling Stores</CardTitle>
          <div className="text-center d-flex px-5 gap-4 align-items-center justify-content-around">
            <div className="mb-0">
              <i className="bx bx-map-pin text-primary display-4" />
            </div>
            <div>
              <h3>1,456</h3>
              <p>Edmundson</p>
            </div>
          </div>

          <div className="table-responsive mt-0">
            <table className="table align-middle table-nowrap">
              <tbody>
                <tr>
                  <td style={{ width: "30%" }}>
                    <p className="mb-0">Edmundson</p>
                  </td>
                  <td style={{ width: "25%" }}>
                    <h5 className="mb-0">1,456</h5>
                  </td>
                  <td>
                    <Progress
                      value="94"
                      color="primary"
                      className="bg-transparent progress-sm"
                      size="sm"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="mb-0">Screwfix</p>
                  </td>
                  <td>
                    <h5 className="mb-0">1,123</h5>
                  </td>
                  <td>
                    <Progress
                      value="82"
                      color="success"
                      className="bg-transparent progress-sm"
                      size="sm"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="mb-0">LDN Projects</p>
                  </td>
                  <td>
                    <h5 className="mb-0">1,026</h5>
                  </td>
                  <td>
                    <Progress
                      value="70"
                      color="warning"
                      className="bg-transparent progress-sm"
                      size="sm"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

export default TopSellingStores
