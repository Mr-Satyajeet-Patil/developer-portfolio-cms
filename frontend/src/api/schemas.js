import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*  Tolerant schemas                                                          */
/*                                                                            */
/*  The public API is managed through Django admin, so a field can be left    */
/*  blank or a record can be incomplete. Parsing defensively keeps one bad    */
/*  row from blanking an entire section of the site.                          */
/* -------------------------------------------------------------------------- */

const text = z.string().catch("");
const optionalText = z
  .union([z.string(), z.null()])
  .optional()
  .transform((value) => value ?? "");
const integer = z.coerce.number().int().catch(0);
const optionalInteger = z
  .union([z.coerce.number().int(), z.null()])
  .optional()
  .transform((value) => (value === null ? null : value));
const flag = z.boolean().catch(false);
const timestamp = z.string().catch("");

export const profileSchema = z.object({
  id: integer,
  name: text,
  headline: text,
  bio: text,
  email: text,
  location: optionalText,
  github_url: optionalText,
  linkedin_url: optionalText,
  profile_image: optionalText,
  updated_at: timestamp,
});

export const projectSchema = z.object({
  id: integer,
  title: text,
  description: text,
  technologies: optionalText,
  github_url: optionalText,
  live_url: optionalText,
  featured: flag,
  created_at: timestamp,
});

export const skillSchema = z.object({
  id: integer,
  name: text,
  category: optionalText,
  level: z.coerce.number().min(0).max(100).catch(0),
});

export const experienceSchema = z.object({
  id: integer,
  company: text,
  role: text,
  description: text,
  start_date: text,
  end_date: z
    .union([z.string(), z.null()])
    .optional()
    .transform((value) => value ?? null),
  current: flag,
});

export const educationSchema = z.object({
  id: integer,
  institution: text,
  degree: text,
  description: optionalText,
  start_year: optionalInteger,
  end_year: optionalInteger,
});

export const postSchema = z.object({
  id: integer,
  title: text,
  slug: text,
  excerpt: text,
  content: text,
  published: flag,
  created_at: timestamp,
});

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "Name is too long."),
  email: z.email("Enter a valid email address."),
  subject: z
    .string()
    .trim()
    .min(3, "Add a short subject.")
    .max(200, "Subject is too long."),
  message: z
    .string()
    .trim()
    .min(10, "Tell me a little more (at least 10 characters).")
    .max(5000, "Message is too long."),
});

/** Accepts either a bare array or a paginated `{ results: [...] }` payload. */
export function parseList(payload, schema) {
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.results)
      ? payload.results
      : [];

  return rows
    .filter((row) => row && typeof row === "object")
    .map((row) => schema.safeParse(row))
    .filter((result) => result.success)
    .map((result) => result.data);
}

/** Turns a Zod error into a `{ field: message }` map for form rendering. */
export function fieldErrors(error) {
  const result = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (key && !result[key]) result[key] = issue.message;
  }
  return result;
}
