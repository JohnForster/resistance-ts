import * as React from 'react';
import styled from 'styled-components';

interface Props<T> {
  items: T[];
  mapFn: (n: T, i?: number, ary?: T[]) => React.ReactNode;
  forceSingle?: boolean;
}

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 0px;

  &:first-child {
    padding-right: 5px;
  }
  &:last-child {
    padding-left: 5px;
  }
`;

const TwoColumnsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const SingleColumnContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

export const Columns = <T extends any>({
  items,
  mapFn,
  forceSingle,
}: Props<T>) => {
  const midwayIndex = Math.ceil(items.length / 2);

  const firstColumn =
    items.length < 5 || forceSingle ? [...items] : items.slice(0, midwayIndex);
  const secondColumn =
    items.length < 5 || forceSingle
      ? []
      : items.slice(midwayIndex, items.length);

  return secondColumn.length ? (
    <TwoColumnsContainer>
      <Column>{firstColumn.map((n, i) => mapFn(n, i, items))}</Column>
      <Column>
        {secondColumn.map((n, i) => mapFn(n, i + firstColumn.length, items))}
      </Column>
    </TwoColumnsContainer>
  ) : (
    <SingleColumnContainer>
      <Column>{firstColumn.map((n, i) => mapFn(n, i, items))}</Column>
    </SingleColumnContainer>
  );
};
