type Values<T extends any> = ([T, T, T] | T)[];

const responsive = function(strings: TemplateStringsArray, ...values: Values<any>): string {
  return ['0px', '380px', '766px']
    .map((min, i) =>
      [
        `@media only screen and (min-width: ${min}) {`,
        ...strings.map((str, j) => {
          const value = Array.isArray(values[j]) ? (values[j] as Array<string | number>)[i] : values[j] || '';
          return `${str}${value}`;
        }),
        '}',
      ].join('\n'),
    )
    .join('\n');
};

export default responsive;
