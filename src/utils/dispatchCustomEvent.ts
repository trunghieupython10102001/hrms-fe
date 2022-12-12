// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function dispatchCustomEvent(eventName: string, data?: any) {
  const pushChangeEvent = new CustomEvent(eventName, {
    detail: {
      data,
    },
  });

  window.dispatchEvent(pushChangeEvent);
}
