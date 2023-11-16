const wait = (ms: number) => {
  const start = Date.now();
  let now = start;

  while (now - start < ms) now = Date.now();
};

export const SlowComponent = () => {
  wait(500);
  return null;
};
