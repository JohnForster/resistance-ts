import * as React from 'react';

import styled from '../../styles/themed-styled-components';

const Hamburger = styled.div<{ checked: boolean }>`
  position: relative;
  display: inline-block;
  width: 1.25em;
  height: 0.8em;
  margin-right: 0.3em;
  border-top: 0.2em solid ${({ theme }) => theme.colours.menu};
  border-bottom: 0.2em solid ${({ theme }) => theme.colours.menu};

  :before {
    content: '';
    position: absolute;
    top: 0.3em;
    left: 0px;
    width: 100%;
    border-top: 0.2em solid ${({ theme }) => theme.colours.menu};
  }

  margin: 1rem;
`;

const MenuButtonContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

interface Props {
  checked: boolean;
  onClick: () => void;
}

export const MenuButton: React.FC<Props> = (props) => {
  return (
    <MenuButtonContainer>
      <Hamburger
        role="button"
        onClick={props.onClick}
        checked={props.checked}
      />
    </MenuButtonContainer>
  );
};
