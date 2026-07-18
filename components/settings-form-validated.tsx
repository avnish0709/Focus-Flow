import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SettingsSchema = z.object({
  displayName: z.string().min(3, "Display name must be at least 3 characters").max(30),
  email: z.string().email("Invalid email address"),
  dailyGoal: z
    .number({ invalid_type_error: "Daily goal must be a number" })
    .int()
    .min(1, "Daily goal must be at least 1")
    .max(24, "Daily goal must be 24 or less"),
});

type Settings = z.infer<typeof SettingsSchema>;

export default function SettingsFormValidated(): JSX.Element {
  const { register, handleSubmit, setError, formState, reset } = useForm<Settings>({
    defaultValues: { displayName: "", email: "", dailyGoal: 1 },
  });
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(values: any) {
    setSubmitting(true);
    const parsed = SettingsSchema.safeParse({
      displayName: values.displayName,
      email: values.email,
      dailyGoal: Number(values.dailyGoal),
    });
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const path = issue.path[0] as keyof Settings;
        setError(path, { message: issue.message });
      }
      setSubmitting(false);
      return;
    }

    try {
      localStorage.setItem("settings", JSON.stringify(parsed.data));
      // lightweight success feedback
      alert("Settings saved (round2 validated)");
      reset(parsed.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-label="Settings form validated">
      <div>
        <label htmlFor="displayName">Display name</label>
        <input id="displayName" {...register("displayName")} />
        {formState.errors.displayName && (
          <p role="alert">{formState.errors.displayName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" {...register("email")} />
        {formState.errors.email && <p role="alert">{formState.errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="dailyGoal">Daily goal (hours)</label>
        <input id="dailyGoal" type="number" {...register("dailyGoal", { valueAsNumber: true })} />
        {formState.errors.dailyGoal && (
          <p role="alert">{formState.errors.dailyGoal.message}</p>
        )}
      </div>

      <div>
        <button type="submit" disabled={submitting} aria-busy={submitting}>
          {submitting ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
