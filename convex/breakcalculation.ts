export function calculateVacationDays(startWorkday: number): number {
  const now = Date.now();
  const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
  const yearsWorked = Math.floor((now - startWorkday) / msPerYear);

  if (yearsWorked < 1) return 0;

  if (yearsWorked <= 5) {
    return 10 + (yearsWorked * 2);
  }

  return 20 + (2 * Math.ceil((yearsWorked - 5) / 5));
}