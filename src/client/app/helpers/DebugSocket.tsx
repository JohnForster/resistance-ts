import * as React from 'react';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';

interface Props {
  socket: Socket;
}

const Container = styled.div`
  position: absolute;
  display: flex;
  font-size: 11px;
  width: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Grow = styled.div`
  flex-grow: 1;
`;

export const DebugSocket: React.FC<Props> = ({ socket }) => {
  const isConnected = socket.connected;
  const [latestEvent, setLatestEvent] = React.useState('');
  const [beatCount, setBeatCount] = React.useState(0);

  React.useEffect(() => {
    socket.io.engine.on('heartbeat', () => {
      console.log('beat');
      setBeatCount(Math.floor(Math.random() * 100));
    });
  }, [socket, setBeatCount]);

  React.useEffect(() => {
    console.log('Running event effect...');
    socket.onAny((event) => {
      setLatestEvent(event);
    });
  }, [socket, setLatestEvent]);

  const [renderCount, setRenderCount] = React.useState(0);
  setTimeout(() => setRenderCount(renderCount + 1), 1000);

  console.log('Still rendering...');

  return (
    <Container>
      <Grow />
      <Column>
        <span>Is connected: {String(isConnected) || 'undefined'}</span>
        <span>id: {socket.id}</span>
        {latestEvent && <span>Latest event: {latestEvent}</span>}
        <span>Beat count: {beatCount}</span>
      </Column>
    </Container>
  );
};
