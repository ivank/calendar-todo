export const toISODate = (date: Date): string => date.toISOString().substring(0, 10);
export const fromISODate = (date: string): Date => new Date(date);
export const toEpoch = (date: Date): number => Math.trunc(date.getTime() / 8.64e7);
export const toWeekday = (date: Date): string => date.toLocaleString('en-us', { weekday: 'long' });
export const toHumanDate = (date: Date): string =>
  date.toLocaleString('en-us', { year: 'numeric', month: 'short', day: 'numeric' });
export const fromEpoch = (epoch: number) => new Date(epoch * 8.64e7);
