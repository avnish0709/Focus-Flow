import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import SettingsFormValidated from "../components/settings-form-validated";

describe("SettingsFormValidated", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("alert", vi.fn());
  });

  it("shows validation errors for invalid input", async () => {
    render(<SettingsFormValidated />);

    fireEvent.change(screen.getByLabelText(/Display name/i), { target: { value: "ab" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "not-an-email" } });
    fireEvent.change(screen.getByLabelText(/Daily goal/i), { target: { value: "0" } });

    fireEvent.click(screen.getByRole("button", { name: /save settings/i }));

    expect(await screen.findByText(/Display name must be at least 3 characters/)).toBeInTheDocument();
    expect(await screen.findByText(/Invalid email address/)).toBeInTheDocument();
    expect(await screen.findByText(/Daily goal must be at least 1/)).toBeInTheDocument();
  });

  it("saves valid data to localStorage and calls alert", async () => {
    render(<SettingsFormValidated />);

    fireEvent.change(screen.getByLabelText(/Display name/i), { target: { value: "Alice" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "alice@example.com" } });
    fireEvent.change(screen.getByLabelText(/Daily goal/i), { target: { value: "4" } });

    fireEvent.click(screen.getByRole("button", { name: /save settings/i }));

    // alert should be called
    expect((globalThis.alert as unknown as any)).toHaveBeenCalled();
    const saved = JSON.parse(localStorage.getItem("settings") || "null");
    expect(saved).toMatchObject({ displayName: "Alice", email: "alice@example.com", dailyGoal: 4 });
  });
});
