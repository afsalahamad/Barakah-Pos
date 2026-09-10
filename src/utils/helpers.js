export const money = (n) => `$${Number(n).toFixed(2)}`;

export const fmtDate = (ts) =>
  new Date(ts).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });

export const fmtTime = (ts) =>
  new Date(ts).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

export const daysAgo = (n, h = 9, m = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(h, m, 0, 0);
  return d.getTime();
};

export const isToday = (ts) => new Date(ts).toDateString() === new Date().toDateString();

export const isWithinDays = (ts, n) => ts >= Date.now() - n * 86400000;

export const stockStatus = (product) => {
  if (product.stock <= 0) return "Out of Stock";
  if (product.stock <= product.lowStockThreshold) return "Low Stock";
  return "In Stock";
};

export const TONE = {
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  rose: "bg-rose-50 text-rose-700 border-rose-200",
  stone: "bg-stone-100 text-stone-500 border-stone-200",
};

export const STATUS_TONE = {
  "In Stock": "emerald",
  "Low Stock": "amber",
  "Out of Stock": "rose",
  Active: "emerald",
  Inactive: "stone",
  Completed: "emerald",
  Held: "amber",
};
