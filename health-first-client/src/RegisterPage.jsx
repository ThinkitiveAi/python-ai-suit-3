import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  FormControlLabel,
  Link,
  Grid,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions as MuiDialogActions
} from "@mui/material";
import { Visibility, VisibilityOff, MedicalServices, LocalHospital, PhotoCamera, CheckCircle, Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const specializations = [
  "Cardiology",
  "Pediatrics",
  "Dermatology",
  "General Medicine",
  "Orthopedics",
  "Gynecology",
  "Neurology",
  "Psychiatry",
  "Radiology",
  "Other"
];
const practiceTypes = ["Private Practice", "Clinic", "Hospital", "Other"];

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  return score;
}

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  profilePhoto: null,
  license: "",
  specialization: "",
  experience: "",
  degree: "",
  clinicName: "",
  clinicAddress: "",
  practiceType: "",
  password: "",
  confirmPassword: "",
  terms: false
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = "Invalid email";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?\d{10,15}$/.test(form.phone)) newErrors.phone = "Invalid phone number";
    if (!form.profilePhoto) newErrors.profilePhoto = "Profile photo is required";
    if (!form.license.trim()) newErrors.license = "Medical license number is required";
    else if (!/^[A-Z0-9-]{6,20}$/i.test(form.license)) newErrors.license = "Invalid license number";
    if (!form.specialization) newErrors.specialization = "Specialization is required";
    if (!form.experience.toString().trim()) newErrors.experience = "Experience is required";
    else if (isNaN(form.experience) || form.experience < 0 || form.experience > 60) newErrors.experience = "Invalid experience";
    if (!form.degree.trim()) newErrors.degree = "Medical degree is required";
    if (!form.clinicName.trim()) newErrors.clinicName = "Clinic/Hospital name is required";
    if (!form.clinicAddress.trim()) newErrors.clinicAddress = "Clinic address is required";
    if (!form.practiceType) newErrors.practiceType = "Practice type is required";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8) newErrors.password = "Min 8 characters";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) newErrors.password = "At least one special character";
    if (!form.confirmPassword) newErrors.confirmPassword = "Confirm your password";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords must match";
    if (!form.terms) newErrors.terms = "You must accept the terms";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const file = files[0];
      setForm((prev) => ({ ...prev, profilePhoto: file }));
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => setPhotoPreview(ev.target.result);
        reader.readAsDataURL(file);
      } else {
        setPhotoPreview(null);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setSubmitting(true);
    await new Promise((res) => setTimeout(res, 1500));
    setSubmitting(false);
    setSuccess(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#e0f2fe",
        overflow: "auto"
      }}
    >
      <Card sx={{ maxWidth: "40%", width: "100%", boxShadow: 6, borderRadius: 3, p: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <MedicalServices sx={{ color: "#2563eb", fontSize: 36, mr: 1 }} />
            <LocalHospital sx={{ color: "#059669", fontSize: 36, mr: 1 }} />
            <Typography variant="h5" fontWeight={700} sx={{ color: "#2563eb" }}>
              Provider Registration
            </Typography>
          </Box>
          {success ? (
            <Box textAlign="center" py={4}>
              <CheckCircle sx={{ color: "#059669", fontSize: 60, mb: 2 }} />
              <Typography variant="h6" color="#059669" fontWeight={600} mb={2}>
                Registration Successful!
              </Typography>
              <Typography variant="body1" mb={2}>
                Please check your email for verification and next steps.
              </Typography>
              <Button
                variant="contained"
                sx={{ background: "#2563eb", color: "#fff", fontWeight: 700, mt: 2 }}
                onClick={() => navigate("/login")}
              >
                Go to Login
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleSubmit} autoComplete="on">
              {/* Personal Information */}
              <Typography variant="subtitle1" fontWeight={600} mb={1} sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "#2563eb", width: 24, height: 24, mr: 1 }}>
                  <PhotoCamera fontSize="small" />
                </Avatar>
                Personal Information
              </Typography>
              <Grid container spacing={1} mb={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    fullWidth
                    value={form.firstName}
                    onChange={handleChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    inputProps={{ tabIndex: 1 }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    value={form.lastName}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    inputProps={{ tabIndex: 2 }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="email"
                    label="Email Address"
                    fullWidth
                    value={form.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    inputProps={{ tabIndex: 3, autoComplete: "email" }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="phone"
                    label="Phone Number"
                    fullWidth
                    value={form.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    inputProps={{ tabIndex: 4, autoComplete: "tel" }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      border: "2px dashed #2563eb",
                      borderRadius: 2,
                      p: 2,
                      textAlign: "center",
                      cursor: "pointer",
                      bgcolor: "#f8fafc",
                    }}
                    onClick={() => document.getElementById("profile-photo-input").click()}
                    tabIndex={5}
                    aria-label="Upload profile photo"
                  >
                    <input
                      id="profile-photo-input"
                      name="profilePhoto"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleChange}
                    />
                    {photoPreview ? (
                      <Avatar src={photoPreview} sx={{ width: 64, height: 64, mx: "auto", mb: 1 }} />
                    ) : (
                      <PhotoCamera sx={{ color: "#2563eb", fontSize: 32, mb: 1 }} />
                    )}
                    <Typography variant="body2">
                      {form.profilePhoto && form.profilePhoto.name
                        ? form.profilePhoto.name
                        : "Drag & drop or click to upload profile photo"}
                    </Typography>
                    {errors.profilePhoto && (
                      <Typography variant="caption" color="error">
                        {errors.profilePhoto}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
              {/* Professional Information */}
              <Typography variant="subtitle1" fontWeight={600} mb={1} sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "#059669", width: 24, height: 24, mr: 1 }}>
                  <MedicalServices fontSize="small" />
                </Avatar>
                Professional Information
              </Typography>
              <Grid container spacing={1} mb={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="license"
                    label="Medical License Number"
                    fullWidth
                    value={form.license}
                    onChange={handleChange}
                    error={!!errors.license}
                    helperText={errors.license}
                    inputProps={{ tabIndex: 6 }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.specialization}>
                    <InputLabel>Specialization</InputLabel>
                    <Select
                      name="specialization"
                      value={form.specialization}
                      onChange={handleChange}
                      label="Specialization"
                      inputProps={{ tabIndex: 7 }}
                      required
                    >
                      {specializations.map((spec) => (
                        <MenuItem key={spec} value={spec}>
                          {spec}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.specialization && (
                      <Typography variant="caption" color="error">
                        {errors.specialization}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="experience"
                    label="Years of Experience"
                    type="number"
                    fullWidth
                    value={form.experience}
                    onChange={handleChange}
                    error={!!errors.experience}
                    helperText={errors.experience}
                    inputProps={{ min: 0, max: 60, tabIndex: 8 }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="degree"
                    label="Medical Degree / Qualifications"
                    fullWidth
                    value={form.degree}
                    onChange={handleChange}
                    error={!!errors.degree}
                    helperText={errors.degree}
                    inputProps={{ tabIndex: 9 }}
                    required
                  />
                </Grid>
              </Grid>
              {/* Practice Information */}
              <Typography variant="subtitle1" fontWeight={600} mb={1} sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "#2563eb", width: 24, height: 24, mr: 1 }}>
                  <LocalHospital fontSize="small" />
                </Avatar>
                Practice Information
              </Typography>
              <Grid container spacing={1} mb={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="clinicName"
                    label="Clinic/Hospital Name"
                    fullWidth
                    value={form.clinicName}
                    onChange={handleChange}
                    error={!!errors.clinicName}
                    helperText={errors.clinicName}
                    inputProps={{ tabIndex: 10 }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.practiceType}>
                    <InputLabel>Practice Type</InputLabel>
                    <Select
                      name="practiceType"
                      value={form.practiceType}
                      onChange={handleChange}
                      label="Practice Type"
                      inputProps={{ tabIndex: 11 }}
                      required
                    >
                      {practiceTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.practiceType && (
                      <Typography variant="caption" color="error">
                        {errors.practiceType}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="clinicAddress"
                    label="Clinic Address"
                    fullWidth
                    value={form.clinicAddress}
                    onChange={handleChange}
                    error={!!errors.clinicAddress}
                    helperText={errors.clinicAddress}
                    inputProps={{ tabIndex: 12 }}
                    required
                  />
                </Grid>
              </Grid>
              {/* Account Security */}
              <Typography variant="subtitle1" fontWeight={600} mb={1} sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "#059669", width: 24, height: 24, mr: 1 }}>
                  <Lock fontSize="small" />
                </Avatar>
                Account Security
              </Typography>
              <Grid container spacing={1} mb={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" error={!!errors.password} required>
                    <InputLabel>Password</InputLabel>
                    <OutlinedInput
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      label="Password"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((show) => !show)}
                            edge="end"
                            tabIndex={13}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      inputProps={{ tabIndex: 13, autoComplete: "new-password" }}
                    />
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={getPasswordStrength(form.password) * 25}
                        sx={{ height: 6, borderRadius: 2, background: "#e0e7ef", '& .MuiLinearProgress-bar': { background: getPasswordStrength(form.password) >= 3 ? '#059669' : '#2563eb' } }}
                      />
                      <Typography variant="caption" color={getPasswordStrength(form.password) >= 3 ? "#059669" : "#2563eb"}>
                        {getPasswordStrength(form.password) === 0 && "Too weak"}
                        {getPasswordStrength(form.password) === 1 && "Weak"}
                        {getPasswordStrength(form.password) === 2 && "Fair"}
                        {getPasswordStrength(form.password) === 3 && "Strong"}
                        {getPasswordStrength(form.password) === 4 && "Very strong"}
                      </Typography>
                    </Box>
                    {errors.password && (
                      <Typography variant="caption" color="error">
                        {errors.password}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" error={!!errors.confirmPassword} required>
                    <InputLabel>Confirm Password</InputLabel>
                    <OutlinedInput
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      label="Confirm Password"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={showConfirm ? "Hide password" : "Show password"}
                            onClick={() => setShowConfirm((show) => !show)}
                            edge="end"
                            tabIndex={14}
                          >
                            {showConfirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      inputProps={{ tabIndex: 14, autoComplete: "new-password" }}
                    />
                    {errors.confirmPassword && (
                      <Typography variant="caption" color="error">
                        {errors.confirmPassword}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    name="terms"
                    checked={form.terms}
                    onChange={handleChange}
                    color="primary"
                    inputProps={{ tabIndex: 15 }}
                  />
                }
                label={
                  <>
                    I agree to the{' '}
                    <Link component="button" onClick={() => setTermsOpen(true)} sx={{ color: "#2563eb" }}>
                      Terms & Conditions
                    </Link>
                  </>
                }
                sx={{ mb: 2 }}
              />
              {errors.terms && (
                <Typography variant="caption" color="error" sx={{ display: "block", mb: 1 }}>
                  {errors.terms}
                </Typography>
              )}
              <CardActions sx={{ flexDirection: "column", alignItems: "stretch", gap: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ background: "#2563eb", color: "#fff", fontWeight: 700, py: 1.2, borderRadius: 2, fontSize: "1rem", boxShadow: 2, mb: 1, '&:hover': { background: "#1e40af" } }}
                  disabled={submitting}
                  aria-label="Register"
                >
                  {submitting ? "Registering..." : "Register"}
                </Button>
                <Typography variant="body2" align="center">
                  Already registered?{' '}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate("/login")}
                    sx={{ color: "#2563eb", fontWeight: 500 }}
                    tabIndex={16}
                    aria-label="Login"
                  >
                    Login here
                  </Link>
                </Typography>
              </CardActions>
            </form>
          )}
        </CardContent>
      </Card>
      {/* Terms & Conditions Modal */}
      <Dialog open={termsOpen} onClose={() => setTermsOpen(false)} aria-labelledby="terms-title">
        <DialogTitle id="terms-title">Terms & Conditions</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">
            By registering, you agree to our terms and conditions. (Add your terms here.)
          </Typography>
        </DialogContent>
        <MuiDialogActions>
          <Button onClick={() => setTermsOpen(false)} color="primary">
            Close
          </Button>
        </MuiDialogActions>
      </Dialog>
    </Box>
  );
} 