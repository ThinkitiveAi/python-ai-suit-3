import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function validateEmail(email) {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const initialState = {
  email: "",
  password: "",
};

const initialErrors = {
  email: "",
  password: "",
};

function PatientLogin() {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  const isEmailValid = validateEmail(values.email);
  const isPasswordValid = values.password.trim().length > 0;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, values[name]);
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
      if (!value.trim()) error = "Email is required.";
      else if (!validateEmail(value)) error = "Enter a valid email.";
    }
    if (name === "password") {
      if (!value.trim()) error = "Password is required.";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) validateField(name, value);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const sanitize = (str) => str.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = {};
    Object.keys(values).forEach((field) => {
      const err = validateField(field, values[field]);
      newErrors[field] = err;
      if (err) valid = false;
    });
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    if (!valid) return;
    setSubmitting(true);
    setLoginError("");
    // Simulate login (replace with real API call)
    const email = sanitize(values.email);
    const password = sanitize(values.password);
    setTimeout(() => {
      setSubmitting(false);
      if (email === "patient@example.com" && password === "password123") {
        // Success (simulate redirect)
        setLoginError("");
        alert("Login successful! Redirecting...");
      } else {
        setLoginError("Invalid credentials. Please try again.");
      }
    }, 1200);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f7fa",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        autoComplete="off"
        sx={{
          width: 360,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "white",
        }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          Patient Login
        </Typography>
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          required
          margin="normal"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={Boolean(errors.email)}
          helperText={touched.email && errors.email}
          autoComplete="off"
          inputProps={{
            autoComplete: "new-email",
            form: { autoComplete: "off" },
            "data-lpignore": "true", // LastPass, etc.
            spellCheck: "false",
          }}
        />
        <FormControl
          variant="outlined"
          fullWidth
          required
          margin="normal"
          error={Boolean(errors.password)}
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
              autoComplete: "new-password",
              form: { autoComplete: "off" },
              "data-lpignore": "true",
              spellCheck: "false",
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  tabIndex={-1}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          <FormHelperText>{touched.password && errors.password}</FormHelperText>
        </FormControl>
        {loginError && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {loginError}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, mb: 1 }}
          disabled={!isFormValid || submitting}
        >
          {submitting ? "Logging in..." : "Login"}
        </Button>
      </Box>
    </Box>
  );
}

export default PatientLogin;
