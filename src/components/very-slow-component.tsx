const wait = (ms: number) => {
  const start = Date.now();
  let now = start;

  while (now - start < ms) now = Date.now();
};

export const VerySlowComponent = () => {
  wait(500);
  return null;
};

export const AnotherVerySlowComponent = () => {
  wait(500);
  return null;
};
