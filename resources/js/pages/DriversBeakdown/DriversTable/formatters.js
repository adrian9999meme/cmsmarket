export function money(value) {
    const num = Number(value || 0);
    return num ? `£${num.toFixed(2)}` : '-';
}