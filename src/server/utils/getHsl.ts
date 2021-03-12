export const getHsl = (str: string, radix = 36) => {
  const sMin = 0.75;
  const lMin = 0.5;
  const threeLetters = str.toUpperCase().slice(-3);
  const hsl = [...threeLetters]
    .map((c) => c.charCodeAt(0))
    .map((n) => (n < 65 ? n - 48 : n - 55)) // Convert charcodes to the range 0-radix
    .map((n, i) => (i === 1 ? n * (1 - sMin) + radix * sMin : n)) // Adjust saturation to be in top three quarters
    .map((n, i) => (i === 2 ? n * (1 - lMin) + radix * lMin : n)) // Adjust lightness to be in top half
    .map((n, i) => Math.floor((n / radix) * (i === 0 ? 360 : 100)));
  return hsl as [number, number, number];
};
