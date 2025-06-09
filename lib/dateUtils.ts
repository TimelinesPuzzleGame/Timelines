// lib/dateUtils.ts

/**
 * Turn a raw numeric date into a human-friendly label.
 * - Negative numbers → B.C.E. or “yrs ago” for deep time
 * -  0 → “0” (present)
 * - Positive numbers → A.D. years
 */
export function formatDate(d: number): string {
  if (d < 0) {
    const abs = Math.abs(d);
    // Helper to scale & round, dropping decimals if integer part ≥ 3 digits
    const scaleAndFormat = (val: number, unit: string) => {
      let rep = val.toFixed(1).replace(/\.0$/, '');
      const intPart = rep.split('.')[0];
      if (intPart.length >= 3) rep = intPart;
      return `${rep}${unit}`;
    };

    // Billions (B)
    if (abs >= 1e9) {
      return `${scaleAndFormat(abs / 1e9, 'B yrs ago')}`;
    }
    // Millions (M)
    if (abs >= 1e6) {
      return `${scaleAndFormat(abs / 1e6, 'M yrs ago')}`;
    }
     // Thousands (K) — only once abs ≥ 10 000 (i.e. more than 4 digits)
    if (abs >= 1e4) {
      return `${scaleAndFormat(abs / 1e3, 'k yrs ago')}`;
    }
    // B.C.E. (small integer)
    return `${abs} B.C.E.`;
  }
  return `${d}`; // A.D. or “0” for present
}
