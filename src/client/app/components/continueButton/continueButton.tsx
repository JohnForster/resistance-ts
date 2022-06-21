import * as React from 'react';
import styled from 'styled-components';

interface Props {
  text?: string;
  subtext?: React.ReactElement | string;
  onClick: React.ReactEventHandler<HTMLButtonElement>;
  hidden?: boolean;
  disabled?: boolean;
  hideSubtext?: boolean;
  name?: string;
  children?: React.ReactNode;
}

const SubText = styled.p<{ hideSubtext: boolean }>`
  height: 0;
  margin: 0;
  visibility: ${({ hideSubtext }) => (hideSubtext ? 'hidden' : 'visible')};
`;

const GrowUp = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;
`;

export const ContinueButton: React.FC<Props> = ({
  text = 'Continue',
  subtext,
  onClick,
  name,
  hidden = false,
  disabled = false,
  hideSubtext = false,
}) => {
  return (
    <GrowUp>
      {!hidden && (
        <button onClick={onClick} disabled={disabled} name={name}>
          {text}
        </button>
      )}
      {subtext && <SubText hideSubtext={hideSubtext}>{subtext}</SubText>}
    </GrowUp>
  );
};
