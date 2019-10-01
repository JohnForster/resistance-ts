export default (): string => {
  return Math.floor(Math.random() * 46655)
    .toString(36)
    .toUpperCase()
    .padStart(3, '0');
};
