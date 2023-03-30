import { Typography, Button, Box } from "@mui/material";
import "../cssFiles/bavaria.css";
import useBavaria from "../hooks/useBavaria";
import { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "../cssFiles/styles.css";

const Bavaria = () => {
  const { entities } = useBavaria();
  const [patients, setPatients] = useState();
  const [drugs, setDrugs] = useState();
  const [placebo, setPlacebo] = useState(false);

  const listPatients = async () => {
    let patientList = await entities.patient.list({
      filter: {
        eligibility: {
          eq: true,
        },
      },
    });
    setPatients(patientList.items);
  };

  const listDrugs = async () => {
    let drugsList = await entities.drug.list();
    setDrugs(drugsList.items);
  };

  useEffect(() => {
    listPatients();
    listDrugs();
  }, []);

  return (
    <div className="main1">
      <h1 className="container">Bavaria</h1>
      <div className="send">
        <Button
          sx={{ mb: 2 }}
          variant="contained"
          size="large"
          href="/Bavaria/SendDrugs"
        >
          <Typography variant="h5">Send Drug to FDA</Typography>
        </Button>
      </div>

      <Box sx={{ pt: 4, pb: 6 }} bgcolor="grey">
        <Box>
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="appcontainer">
                  <div className="box1">
                    <div className="app-container">
                      <h3>PATIENTS (FOR ONGOING TRIALS)</h3>
                      <table className="table-striped">
                        <thead>
                          <tr>
                            <th>Patient ID </th>
                            <th>Eligibility </th>
                            <th>Number of Visits</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patients?.map((patient, key) => {
                            return (
                              <tr key={key}>
                                <td> {patient._id} </td>
                                <td> {patient.eligibility ? "Yes" : "No"}</td>
                                <td> {patient.visits.length} / 5</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="box2">
                    <div className="app-container">
                      <h3>Drugs</h3>
                      <table className="table-striped">
                        <thead>
                          <tr>
                            <th>_id </th>
                            <th>Placebo </th>
                            <th>BatchNumber </th>
                          </tr>
                        </thead>
                        <tbody>
                          {drugs?.map((drug, key) => {
                            return (
                              <tr key={key}>
                                <td> {drug._id}</td>
                                <td> {drug.placebo ? "Yes" : "No"}</td>
                                <td> {drug.batchNumber}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default Bavaria;
