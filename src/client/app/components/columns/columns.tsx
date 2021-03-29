import * as React from 'react';
import styled from 'styled-components';

interface Props<T> {
  items: T[];
  mapFn: (n: T, i?: number, ary?: T[]) => React.ReactNode;
}

const Column = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const TwoColumnsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

export const Columns = <T extends any>({ items, mapFn }: Props<T>) => {
  console.log('TODO: Fill out Columns');
  const midwayIndex = Math.ceil(items.length / 2);

  const firstColumn =
    items.length > 5 ? items.slice(0, midwayIndex) : [...items];
  const secondColumn =
    items.length > 5 ? items.slice(midwayIndex, items.length) : [];

  console.log('midwayIndex, items.length:', midwayIndex, items.length);
  console.log('firstColumn, secondColumn:', firstColumn, secondColumn);

  return secondColumn.length ? (
    <TwoColumnsContainer>
      <Column>{firstColumn.map((n, i) => mapFn(n, i, items))}</Column>
      <Column>
        {secondColumn.map((n, i) => mapFn(n, i + firstColumn.length, items))}
      </Column>
    </TwoColumnsContainer>
  ) : (
    <Column>{firstColumn.map(mapFn)}</Column>
  );
};
