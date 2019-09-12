export default (): string => {
  return Math.floor(Math.random() * 60466176)
    .toString(36)
    .toUpperCase()
    .padStart(5, '0');
};
