import * as React from 'react';
import styled from 'styled-components';
import responsive from '../../helpers/responsive';

const TabTitlesContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 500px;
  height: 50px;
  align-items: baseline;
  justify-content: center;
  white-space: nowrap;
`;

const TabTitle = styled.h3<{ isActive: boolean; width: number }>`
  ${({ isActive }) => !isActive && responsive`font-size: ${[11, 15, 20]}px;`}
  ${({ isActive }) => !isActive && 'text-decoration: underline;'}
  width: ${({ width }) => width}%;

  display: flex;
  justify-content: center;
  transition-property: font-size, width;
  transition-duration: 0.5s;
`;

const ContentContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  align-items: center;
  flex-grow: 1;
`;

export const Tab = styled.div<{ isActive: boolean }>`
  position: absolute;

  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  ${({ isActive }) => !isActive && 'pointer-events: none;'};
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  transition: opacity 0.5s;
`;

const Spacing = styled.div<{ width: number }>`
  width: ${({ width }) => width}%;
  transition: width 0.5s;
`;

interface Props {
  titles: string[];
  children: React.ReactNode;
}

export const Tabs: React.FC<Props> = (props) => {
  const tabs = React.Children.toArray(props.children);
  const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
  const itemsToLeft = currentTabIndex;
  const itemsToRight = tabs.length - (currentTabIndex + 1);
  const spacingLeft = Math.max(itemsToRight - itemsToLeft, 0);
  const spacingRight = Math.max(itemsToLeft - itemsToRight, 0);

  console.log('spacingLeft, spacingRight:', spacingLeft, spacingRight);
  const totalSections = tabs.length * 2 - 1;
  const width = 100 / totalSections;
  console.log('width:', width);

  return (
    <>
      <TabTitlesContainer>
        <Spacing width={width * spacingLeft} />
        {props.titles.map((title, i) => (
          <TabTitle
            key={title}
            id={`${title}Tab`}
            onClick={() => setCurrentTabIndex(i)}
            isActive={i === currentTabIndex}
            width={width}
          >
            {title}
          </TabTitle>
        ))}
        <Spacing width={width * spacingRight} />
      </TabTitlesContainer>
      <ContentContainer>
        {tabs.map((tab, i) => (
          <Tab key={`tab-${i}`} isActive={i === currentTabIndex}>
            {tab}
          </Tab>
        ))}
      </ContentContainer>
    </>
  );
};
