export class TimeHelper {
  constructor() {
  }

  public static unixSecondsToString(unixSeconds: number): [number, number, number, number]{
    const days = Math.floor(unixSeconds / (1000 * 60 * 60 * 24));
    const seconds = Math.floor((unixSeconds / 1000) % 60);
    const minutes = Math.floor((unixSeconds / (1000 * 60)) % 60);
    const hours = Math.floor((unixSeconds / (1000 * 60 * 60)) % 24);

    return [days, hours, minutes, seconds];
  }
}
