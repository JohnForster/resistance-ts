import events from 'events';

export type EventFns = ReturnType<typeof getEventFns>;

export const getEventFns = (players: number) => {
  const activeEvents: Record<string, number> = {};

  const createListener = (eventName: string, n: number) => {
    let count = 0;
    eventEmitter.on(eventName, () => {
      count += 1;
      if (count === n) {
        eventEmitter.emit(`all-${eventName}`);
      }
      activeEvents[eventName] = count;
      if (count > n) {
        throw new Error(`Event ${eventName} has been fired ${count} times`);
      }
    });
    return count;
  };

  const eventEmitter = new events.EventEmitter();

  const waitForEvent = (eventName: string): Promise<any[]> =>
    new Promise((resolve, reject) => {
      eventEmitter.on(eventName, (...args) => resolve(args));
    });

  const waitForAll = async (eventName: string, n = players) => {
    const promise = waitForEvent(`all-${eventName}`);
    if (activeEvents[eventName] == null) {
      createListener(eventName, n);
    }
    eventEmitter.emit(eventName);
    await promise;
  };

  const emitEvent = (event: string, ...args: any[]) =>
    eventEmitter.emit(event, ...args);

  return {
    emitEvent,
    waitForEvent,
    waitForAll,
  };
};
