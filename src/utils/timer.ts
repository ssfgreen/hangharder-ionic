export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export const minsFromDs = (decisecond: number) => {
  const mins = Math.floor(decisecond / 10 / 60);
  return mins < 10 ? `0${mins}` : mins;
};

export const secsFromDs = (decisecond: number) => {
  const secs = Math.floor(decisecond / 10) % 60;
  return secs < 10 ? `0${secs}` : secs;
};

export const millisRemaining = (millis: number) => {
  let m = millis % 1000;
  m = Math.round(m / 100);
  return m == 10 ? 0 : m;
};

export const decisRemaining = (decisecond: number) => {
  const d = decisecond % 10;
  return d == 10 ? 0 : d;
};
