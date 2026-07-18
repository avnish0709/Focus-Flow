import React, { useState } from "react";

type Settings = {
  displayName: string;
  email: string;
  dailyGoal: number;
};

export default function SettingsForm(): JSX.Element {
  const [form, setForm] = useState<Settings>({
    displayName: "",
    email: "",
    dailyGoal: 1,
  });
  const [saving, setSaving] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: name === "dailyGoal" ? Number(value) : value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem("settings", JSON.stringify(form));
      setTimeout(() => {
        setSaving(false);
        // lightweight feedback for the naive round
        // consumers can replace with toasts in round 2
        alert("Settings saved (round1 naive implementation)");
      }, 400);
    } catch (err) {
      setSaving(false);
      alert("Failed to save settings");
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Settings form">
      <div>
        <label htmlFor="displayName">Display name</label>
        <input
          id="displayName"
          name="displayName"
          value={form.displayName}
          onChange={handleChange}
          placeholder="Your display name"
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="dailyGoal">Daily goal (hours)</label>
        <input
          id="dailyGoal"
          name="dailyGoal"
          type="number"
          min={1}
          max={24}
          value={form.dailyGoal}
          onChange={handleChange}
        />
      </div>

      <div>
        <button type="submit" disabled={saving} aria-busy={saving}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
