export function formatTb(tb: number): string {
  return `${tb % 1 === 0 ? tb : tb.toFixed(1)} TB`;
}

export function formatMoney(amount: number): string {
  return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
