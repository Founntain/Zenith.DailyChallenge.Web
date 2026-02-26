export class RunAnalyzer {
  normalize(value: number, min: number, max: number) {
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  }

  calculateAggressionScore(apm: number, vs: number, app: number, maxSpike: number, garbageSend: number, totalTime: number){
    const garbagePerSecond = garbageSend / (totalTime / 1000)

    return (
      this.normalize(apm, 20, 80) * 0.3 +
      this.normalize(vs, 30, 120) * 0.25 +
      this.normalize(app, 0.8, 2.0) * 0.2 +
      this.normalize(maxSpike, 4, 20) * 0.15 +
      this.normalize(garbagePerSecond, 0.3, 1.0) * 0.1
    ) * 100;
  }

  calculateDefenseScore(topCombo: number, garbageCleared: number, garbageReceived: number, totalTime: number, gameOverReason: string){
    const cancelRate = garbageCleared / garbageReceived;
    const receivePerSecond = garbageReceived / (totalTime / 1000);

    return (
      this.normalize(cancelRate, 0.05, 0.4) * 0.4 +
      (1 - this.normalize(receivePerSecond, 0.2, 2.0)) * 0.3 +
      this.normalize(topCombo, 0, 10) * 0.2 +
      (gameOverReason === "topout" ? 0.6 : 1.0) * 0.1
    ) * 100;
  }

  calculateExecutionScore(finesse: number, inputs: number, holds: number, piecesPlaced: number){
    const inputsPerPiece = inputs / piecesPlaced;
    const holdsPerPiece = holds / piecesPlaced;

    return (
      this.normalize(finesse, 40, 100) * 0.5 +
      (1 - this.normalize(inputsPerPiece, 3, 7)) * 0.3 +
      (1 - this.normalize(holdsPerPiece, 0.1, 0.8)) * 0.2
    ) * 100;
  }

  calculatePressureScore(apm: number, vs: number, app: number, garbageCleared: number, garbageReceived: number){
    const cancelRate = garbageCleared / garbageReceived;

    return (
      this.normalize(vs / apm, 0.8, 2.5) * 0.4 +
      this.normalize(cancelRate, 0.05, 0.4) * 0.3 +
      this.normalize(app, 0.8, 2.0) * 0.3
    ) * 100;
  }
}
