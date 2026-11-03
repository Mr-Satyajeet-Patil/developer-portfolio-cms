const monthYear = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
});

const fullDate = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const parse = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export function formatDate(value, style = "long") {
  const date = parse(value);
  if (!date) return "";
  if (style === "month") return monthYear.format(date);
  if (style === "year") return String(date.getFullYear());
  return fullDate.format(date);
}

export function formatYear(value) {
  if (value === null || value === undefined || value === "") return "";
  const year = Number(value);
  if (!Number.isFinite(year)) return "";
  if (year >= 1000) return String(year);
  return String(year > 50 ? 1900 + year : 2000 + year);
}

export function formatRange(start, end, current) {
  const from = formatDate(start, "month");
  const to = current ? "Present" : formatDate(end, "month") || "Present";
  if (!from) return to;
  return `${from} — ${to}`;
}

export function splitList(value) {
  return String(value || "")
    .split(/[,;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function paragraphs(value) {
  return String(value || "")
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function initials(name) {
  return String(name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function yearsSince(value) {
  const date = parse(value);
  if (!date) return null;
  const years = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(1, Math.floor(years));
}

export function totalExperienceYears(items) {
  const starts = items
    .map((item) => parse(item.start_date))
    .filter(Boolean)
    .map((date) => date.getTime());
  if (!starts.length) return 0;
  return yearsSince(new Date(Math.min(...starts)).toISOString()) ?? 0;
}
