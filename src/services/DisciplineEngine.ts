import { PlayerDisciplines } from '../types/skills';

export interface ActiveStudySession {
  disciplineKey: keyof PlayerDisciplines;
  method: 'WANG' | 'NILAM';
  targetLevel: number;
  startTime: number;
  durationMs: number;
  endTime: number;
}

export class DisciplineEngine {
  public static readonly BASE_LEVEL = 50;
  public static readonly MAX_LEVEL = 999;

  /**
   * Mengira kos Wang Tunai (RM / Emas)
   * Bermula sekitar 2,500 pada Lvl 50 dan berskala ke atas
   */
  public static getGoldCost(currentLevel: number): number {
    return Math.floor(2500 + Math.pow(currentLevel - 49, 1.45) * 450);
  }

  /**
   * Mengira kos Nilam (Berlian)
   */
  public static getGemsCost(currentLevel: number): number {
    return Math.max(1, Math.floor(2 + (currentLevel - 50) * 0.15));
  }

  /**
   * Mengira tempoh latihan dalam saat:
   * Level 50 -> 51 bermula tepat pada 30 saat.
   * Seterusnya meningkat secara eksponen terkawal.
   */
  public static getDurationSeconds(currentLevel: number, method: 'WANG' | 'NILAM'): number {
    const diff = Math.max(0, currentLevel - 50);
    // Asas 30 saat + peningkatan masa
    const baseSeconds = Math.floor(30 + Math.pow(diff, 1.6) * 8);

    // Kaedah Nilam memotong masa sehingga 50% lebih pantas tetapi BUKAN serta-merta
    if (method === 'NILAM') {
      return Math.max(15, Math.floor(baseSeconds * 0.5));
    }
    return baseSeconds;
  }

  /**
   * Format saat ke format jam, minit, dan saat yang kemas
   */
  public static formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins < 60) return `${mins}m ${secs}s`;
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hours}j ${remMins}m ${secs}s`;
  }
}