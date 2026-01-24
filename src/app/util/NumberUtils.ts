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

  public splitInto4PlaceValues(n: number): [number, number, number, number] {
    // handle sign, ignore decimals
    const sign = Math.sign(n) || 1;
    n = Math.abs(Math.trunc(n));

    const thousands = Math.floor(n / 1000) * 1000;
    const hundreds  = Math.floor((n % 1000) / 100) * 100;
    const tens      = Math.floor((n % 100) / 10) * 10;
    const ones      = n % 10;

    return [
      thousands * sign,
      hundreds * sign,
      tens * sign,
      ones * sign,
    ];
  }
}
