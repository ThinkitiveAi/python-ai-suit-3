import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Grid,
  Select,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff, Person, Lock, Email, Phone, Home, CalendarToday } from "@mui/icons-material";

// Helper functions
const passwordStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};
const isValidEmail = (email) =>
  /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
const isValidPhone = (phone) =>
  /^\+?\d{10,15}$/.test(phone.replace(/\s+/g, ""));
const isValidZip = (zip) =>
  /^[A-Za-z0-9\s\-]{3,12}$/.test(zip.trim());
const todayMinus13Years = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 13);
  return d.toISOString().split("T")[0];
};

// Initial states
const initial = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  password: "",
  confirm_password: "",
  date_of_birth: "",
  gender: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  // Optional
  emergency_name: "",
  emergency_phone: "",
  emergency_relationship: "",
  insurance_provider: "",
  insurance_policy: "",
  medical_history: [],
};

const medicalOptions = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Allergies",
  "Other",
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

function PatientRegister() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showEmergency, setShowEmergency] = useState(false);
  const [showInsurance, setShowInsurance] = useState(false);
  const [showMedical, setShowMedical] = useState(false);

  // Validation
  const validate = (field, value = values[field]) => {
    let error = "";
    const v = typeof value === "string" ? value.trim() : value;
    switch (field) {
      case "first_name":
      case "last_name":
        if (!v) error = "Required";
        else if (v.length < 2 || v.length > 50)
          error = "2–50 characters required";
        break;
      case "email":
        if (!v) error = "Required";
        else if (!isValidEmail(v)) error = "Invalid email";
        break;
      case "phone_number":
        if (!v) error = "Required";
        else if (!isValidPhone(v)) error = "Invalid phone";
        break;
      case "password":
        if (!v) error = "Required";
        else if (passwordStrength(v) < 3)
          error = "Min 8 chars, upper/lower, number or symbol";
        break;
      case "confirm_password":
        if (!v) error = "Required";
        else if (v !== values.password) error = "Passwords do not match";
        break;
      case "date_of_birth":
        if (!v) error = "Required";
        else {
          const dob = new Date(v);
          const minAge = new Date(todayMinus13Years());
          if (dob > minAge)
            error = "Must be at least 13 years old";
        }
        break;
      case "gender":
        if (!v) error = "Required";
        break;
      case "street":
        if (!v) error = "Required";
        else if (v.length > 200) error = "Max 200 chars";
        break;
      case "city":
        if (!v) error = "Required";
        else if (v.length > 100) error = "Max 100 chars";
        break;
      case "state":
        if (!v) error = "Required";
        else if (v.length > 50) error = "Max 50 chars";
        break;
      case "zip":
        if (!v) error = "Required";
        else if (!isValidZip(v)) error = "Invalid ZIP";
        break;
      // Optional
      case "emergency_phone":
        if (v && !isValidPhone(v)) error = "Invalid phone";
        break;
      case "emergency_name":
        if (v && v.length > 100) error = "Max 100 chars";
        break;
      case "emergency_relationship":
        if (v && v.length > 50) error = "Max 50 chars";
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((err) => ({ ...err, [name]: validate(name) }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (touched[name]) setErrors((err) => ({ ...err, [name]: validate(name, value) }));
  };

  const handleMedicalChange = (event) => {
    const { value } = event.target;
    setValues((v) => ({
      ...v,
      medical_history: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const allRequiredValid = [
    "first_name",
    "last_name",
    "email",
    "phone_number",
    "password",
    "confirm_password",
    "date_of_birth",
    "gender",
    "street",
    "city",
    "state",
    "zip",
  ].every(
    (f) =>
      values[f] &&
      !validate(f, values[f])
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate all
    const newTouched = {};
    const newErrors = {};
    Object.keys(values).forEach((f) => {
      newTouched[f] = true;
      newErrors[f] = validate(f);
    });
    setTouched(newTouched);
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccessMsg("Registration successful! (Simulated)");
      // Reset form
      setValues(initial);
      setTouched({});
      setErrors({});
    }, 1200);
  };

  // Accessibility: ARIA labels, tab order, etc.
  return (
    <Box sx={{
      minHeight: "100vh",
      width: "100vw",
      bgcolor: "#f5f7fa",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 2,
    }}>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        sx={{
          width: "70%",
          maxWidth: "100vw",
          bgcolor: "white",
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
          Patient Registration
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ mb: 2 }}>
          Create your account to access health services.
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          {/* Personal Info */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="first_name"
              required
              fullWidth
              value={values.first_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.first_name}
              helperText={touched.first_name && errors.first_name}
              inputProps={{ maxLength: 50, "aria-label": "first name" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="last_name"
              required
              fullWidth
              value={values.last_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.last_name}
              helperText={touched.last_name && errors.last_name}
              inputProps={{ maxLength: 50, "aria-label": "last name" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              required
              fullWidth
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.email}
              helperText={touched.email && errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
                inputProps: { "aria-label": "email", autoComplete: "new-email" },
              }}
              type="email"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              name="phone_number"
              required
              fullWidth
              value={values.phone_number}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.phone_number}
              helperText={touched.phone_number && errors.phone_number}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                ),
                inputProps: {
                  "aria-label": "phone number",
                  autoComplete: "new-phone",
                  maxLength: 16,
                  pattern: "[0-9+ ]*",
                },
              }}
              type="tel"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl
              variant="outlined"
              fullWidth
              required
              error={!!errors.password}
            >
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="new-password"
                inputProps={{
                  "aria-label": "password",
                  maxLength: 64,
                  autoComplete: "new-password",
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((s) => !s)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              <FormHelperText>
                {touched.password && errors.password}
                {values.password && !errors.password && (
                  <span>
                    {" "}
                    Strength:{" "}
                    {["Weak", "Fair", "Good", "Strong", "Excellent"][
                      passwordStrength(values.password) - 1
                    ] || "Too short"}
                  </span>
                )}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl
              variant="outlined"
              fullWidth
              required
              error={!!errors.confirm_password}
            >
              <InputLabel htmlFor="confirm_password">Confirm Password</InputLabel>
              <OutlinedInput
                id="confirm_password"
                name="confirm_password"
                type={showConfirm ? "text" : "password"}
                value={values.confirm_password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="new-password"
                inputProps={{
                  "aria-label": "confirm password",
                  maxLength: 64,
                  autoComplete: "new-password",
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirm((s) => !s)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
              />
              <FormHelperText>
                {touched.confirm_password && errors.confirm_password}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Birth"
              name="date_of_birth"
              required
              fullWidth
              type="date"
              value={values.date_of_birth}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.date_of_birth}
              helperText={touched.date_of_birth && errors.date_of_birth}
              inputProps={{
                max: todayMinus13Years(),
                "aria-label": "date of birth",
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.gender}>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                name="gender"
                value={values.gender}
                label="Gender"
                onChange={handleChange}
                onBlur={handleBlur}
                inputProps={{ "aria-label": "gender" }}
              >
                {genderOptions.map((g) => (
                  <MenuItem key={g.value} value={g.value}>
                    {g.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {touched.gender && errors.gender}
              </FormHelperText>
            </FormControl>
          </Grid>
          {/* Address */}
          <Grid item xs={12}>
            <Divider sx={{ mt: 2, mb: 1 }}>Address</Divider>
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              label="Street"
              name="street"
              required
              fullWidth
              value={values.street}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.street}
              helperText={touched.street && errors.street}
              inputProps={{
                maxLength: 200,
                "aria-label": "street",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Home />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="ZIP"
              name="zip"
              required
              fullWidth
              value={values.zip}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.zip}
              helperText={touched.zip && errors.zip}
              inputProps={{
                maxLength: 12,
                "aria-label": "zip",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="City"
              name="city"
              required
              fullWidth
              value={values.city}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.city}
              helperText={touched.city && errors.city}
              inputProps={{
                maxLength: 100,
                "aria-label": "city",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="State"
              name="state"
              required
              fullWidth
              value={values.state}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.state}
              helperText={touched.state && errors.state}
              inputProps={{
                maxLength: 50,
                "aria-label": "state",
              }}
            />
          </Grid>
          {/* Optional sections */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                size="small"
                variant={showEmergency ? "contained" : "outlined"}
                onClick={() => setShowEmergency((s) => !s)}
              >
                Emergency Contact
              </Button>
              <Button
                size="small"
                variant={showInsurance ? "contained" : "outlined"}
                onClick={() => setShowInsurance((s) => !s)}
              >
                Insurance Info
              </Button>
              <Button
                size="small"
                variant={showMedical ? "contained" : "outlined"}
                onClick={() => setShowMedical((s) => !s)}
              >
                Medical History
              </Button>
            </Stack>
          </Grid>
          {/* Emergency Contact */}
          {showEmergency && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ mt: 2, mb: 1 }}>Emergency Contact (optional)</Divider>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Name"
                  name="emergency_name"
                  fullWidth
                  value={values.emergency_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.emergency_name}
                  helperText={touched.emergency_name && errors.emergency_name}
                  inputProps={{
                    maxLength: 100,
                    "aria-label": "emergency contact name",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Phone"
                  name="emergency_phone"
                  fullWidth
                  value={values.emergency_phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.emergency_phone()}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Relationship"
                  name="emergency_relationship"
                  fullWidth
                  value={values.emergency_relationship}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.emergency_relationship}
                  helperText={touched.emergency_relationship && errors.emergency_relationship}
                  inputProps={{
                    maxLength: 100,
                    "aria-label": "emergency contact relationship",
                  }}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export default PatientRegister;
