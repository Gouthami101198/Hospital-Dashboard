export const cx = (...a) => a.filter(Boolean).join(" ");
export const uid = (prefix) => `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
export const fmtCurrency = (n) =>
  `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRe = /^[0-9+\-() ]{7,20}$/;
