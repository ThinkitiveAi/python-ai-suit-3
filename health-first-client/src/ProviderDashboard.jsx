import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  IconButton,
  Menu,
  MenuItem,
  Typography
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Mock data for staff and clinicians
const staffList = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    contact: "123-456-7890",
    role: "Staff",
    npi: "1234567890",
    location: "New York",
    status: true,
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    contact: "987-654-3210",
    role: "Staff",
    npi: "0987654321",
    location: "Los Angeles",
    status: false,
  },
];

const clinicianList = [
  {
    name: "Dr. Alice Brown",
    email: "alice.brown@example.com",
    contact: "555-123-4567",
    role: "Clinician",
    npi: "1122334455",
    location: "Chicago",
    status: true,
  },
  {
    name: "Dr. Bob White",
    email: "bob.white@example.com",
    contact: "555-987-6543",
    role: "Clinician",
    npi: "5544332211",
    location: "Houston",
    status: false,
  },
];

const columns = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email Id" },
  { id: "contact", label: "Contact Number" },
  { id: "role", label: "Role" },
  { id: "npi", label: "NPI Number" },
  { id: "location", label: "Work Location" },
  { id: "status", label: "Status" },
  { id: "action", label: "Action" },
];

function ProviderDashboard() {
  const [tab, setTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const [staff, setStaff] = useState(staffList);
  const [clinicians, setClinicians] = useState(clinicianList);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleStatusToggle = (rowIdx, isClinician) => {
    if (isClinician) {
      const updated = clinicians.map((row, idx) =>
        idx === rowIdx ? { ...row, status: !row.status } : row
      );
      setClinicians(updated);
    } else {
      const updated = staff.map((row, idx) =>
        idx === rowIdx ? { ...row, status: !row.status } : row
      );
      setStaff(updated);
    }
  };

  const handleMenuOpen = (event, rowIdx) => {
    setAnchorEl(event.currentTarget);
    setMenuRow(rowIdx);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRow(null);
  };

  const renderTable = (rows, isClinician) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.id}>{col.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.contact}</TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell>{row.npi}</TableCell>
              <TableCell>{row.location}</TableCell>
              <TableCell>
                <Switch
                  checked={row.status}
                  onChange={() => handleStatusToggle(idx, isClinician)}
                  color="primary"
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={(e) => handleMenuOpen(e, idx)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && menuRow === idx}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                  <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ width: "100vw", height: "100vh", p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Provider Dashboard
      </Typography>
      <Tabs value={tab} onChange={handleTabChange} aria-label="provider tabs">
        <Tab label="Staff" />
        <Tab label="Clinician" />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {tab === 0 ? renderTable(staff, false) : renderTable(clinicians, true)}
      </Box>
    </Box>
  );
}

export default ProviderDashboard;
