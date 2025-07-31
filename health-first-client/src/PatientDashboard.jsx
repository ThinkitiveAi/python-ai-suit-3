import React from "react";
import { Box, Typography } from "@mui/material";

function PatientDashboard() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ p: 4, borderRadius: 2, boxShadow: 3, bgcolor: "white", width: 360 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Patient Dashboard (Static UI)
        </Typography>
        <Typography align="center" color="text.secondary">
          Welcome, Patient!
        </Typography>
      </Box>
    </Box>
  );
}

export default PatientDashboard;
