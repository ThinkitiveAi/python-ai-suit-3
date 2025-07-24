import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  Link,
  Card,
  CardContent,
  CardActions,
  useTheme
} from "@mui/material";
import { Visibility, VisibilityOff, MedicalServices, Person, Lock, LocalHospital } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validatePhone = (phone) => /^\+?\d{10,15}$/.test(phone);

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginTouched, setLoginTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const isLoginValid = validateEmail(login) || validatePhone(login);
  const isPasswordValid = password.length >= 6;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginTouched(true);
    setPasswordTouched(true);
    setError("");
    if (!isLoginValid || !isPasswordValid) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (login === "provider@example.com" && password === "password123") {
        // Success animation could go here
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    }, 1500);
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
      }}
    >
      <Card
        sx={{
          minWidth: 340,
          maxWidth: 380,
          boxShadow: 6,
          borderRadius: 3,
          p: 2,
          background: "#fff",
        }}
        aria-label="login card"
      >
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <MedicalServices sx={{ color: "#2563eb", fontSize: 48, mr: 1 }} />
            <LocalHospital sx={{ color: "#059669", fontSize: 48 }} />
          </Box>
          <Typography
            variant="h5"
            align="center"
            fontWeight={700}
            sx={{ color: "#2563eb", mb: 1 }}
          >
            Provider Login
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{ color: "text.secondary", mb: 2 }}
          >
            Welcome back! Please login to your account.
          </Typography>
          <form onSubmit={handleLogin} autoComplete="on">
            <TextField
              label="Email or Phone"
              placeholder="Enter your email or phone"
              fullWidth
              margin="normal"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              onBlur={() => setLoginTouched(true)}
              error={loginTouched && !isLoginValid}
              helperText={
                loginTouched && !isLoginValid
                  ? "Enter a valid email or phone number."
                  : ""
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
                autoComplete: "username",
              }}
              inputProps={{
                "aria-label": "email or phone",
                tabIndex: 1,
              }}
              required
            />
            <FormControl
              fullWidth
              margin="normal"
              variant="outlined"
              required
              error={passwordTouched && !isPasswordValid}
            >
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                startAdornment={
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((show) => !show)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      tabIndex={2}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                autoComplete="current-password"
                inputProps={{
                  tabIndex: 2,
                }}
              />
              {passwordTouched && !isPasswordValid && (
                <Typography variant="caption" color="error">
                  Password must be at least 6 characters.
                </Typography>
              )}
            </FormControl>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    color="primary"
                    inputProps={{ tabIndex: 3 }}
                  />
                }
                label={<Typography variant="body2">Remember Me</Typography>}
              />
              <Link
                component="button"
                variant="body2"
                tabIndex={4}
                underline="hover"
                onClick={() => navigate("/register")}
                sx={{ color: "#059669", fontWeight: 500 }}
                aria-label="Forgot password"
              >
                Forgot Password?
              </Link>
            </Box>
            {error && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mt: 1, mb: 0 }}
                role="alert"
              >
                {error}
              </Typography>
            )}
            <CardActions sx={{ mt: 2, flexDirection: "column" }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: 700,
                  py: 1.2,
                  borderRadius: 2,
                  fontSize: "1rem",
                  boxShadow: 2,
                  mb: 1,
                  '&:hover': { background: "#1e40af" },
                }}
                disabled={loading}
                tabIndex={5}
                aria-label="Login"
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
              </Button>
              <Typography variant="body2" align="center">
                New provider?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate("/register")}
                  sx={{ color: "#2563eb", fontWeight: 500 }}
                  tabIndex={6}
                  aria-label="Register"
                >
                  Register here
                </Link>
              </Typography>
            </CardActions>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
} 