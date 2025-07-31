import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PatientLogin from "./PatientLogin";

describe("PatientLogin UI and validation", () => {
  test("renders email and password fields", () => {
    render(<PatientLogin />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test("shows error for invalid email and empty password on blur", async () => {
    render(<PatientLogin />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  test("shows error for invalid email format", async () => {
    render(<PatientLogin />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "invalid" } });
    fireEvent.blur(emailInput);
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
  });

  test("disables submit button until form is valid", () => {
    render(<PatientLogin />);
    const button = screen.getByRole("button", { name: /login/i });
    expect(button).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "secret" } });
    expect(button).not.toBeDisabled();
  });

  test("shows/hides password when toggle is clicked", () => {
    render(<PatientLogin />);
    const passwordInput = screen.getByLabelText(/password/i);
    const toggleBtn = screen.getByLabelText(/toggle password visibility/i);
    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "text");
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("shows error on invalid credentials", async () => {
    render(<PatientLogin />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "wrong@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  test("shows success alert on valid credentials", async () => {
    window.alert = jest.fn();
    render(<PatientLogin />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "patient@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Login successful! Redirecting..."));
  });
});
