const listString = (ary: (string | number)[], joiner = '&'): string => {
  if (ary.length <= 1) return ary.join('');
  let str = ary.slice(0, ary.length - 1).join(', ');
  str += ` ${joiner} ${ary[ary.length - 1]}`;
  return str;
};

export default listString;
