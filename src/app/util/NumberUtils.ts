export class NumberUtils {
  public toOrdinal(n: number): string {
    const num = Math.trunc(n);
    const abs = Math.abs(num);

    const mod100 = abs % 100;
    if (mod100 >= 11 && mod100 <= 13) return `${num}th`;

    switch (abs % 10) {
      case 1: return `${num}st`;
      case 2: return `${num}nd`;
      case 3: return `${num}rd`;
      default: return `${num}th`;
    }
  }
}
