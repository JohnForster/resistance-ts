export default (): string => {
  const decNum = Math.floor(Math.random() * 60466176);
  const hexString = decNum.toString(36).toUpperCase();
  return ('00000' + hexString).slice(-5);
};
