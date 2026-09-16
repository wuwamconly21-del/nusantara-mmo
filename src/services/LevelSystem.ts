export interface RankTier {
    minLevel: number;
    maxLevel: number;
    title: string;
    badge: string;
    color: string;
  }
  
  export const MILITARY_RANKS: RankTier[] = [
    { minLevel: 1, maxLevel: 20, title: 'Bentara Muda', badge: '🔰', color: '#94A3B8' },
    { minLevel: 21, maxLevel: 50, title: 'Bentara Kanan', badge: '🗡', color: '#38BDF8' },
    { minLevel: 51, maxLevel: 100, title: 'Hulubalang', badge: '🛡', color: '#10B981' },
    { minLevel: 101, maxLevel: 200, title: 'Panglima Muda', badge: '⚔', color: '#6366F1' },
    { minLevel: 201, maxLevel: 350, title: 'Panglima Perang', badge: '🎖', color: '#EC4899' },
    { minLevel: 351, maxLevel: 500, title: 'Temenggong', badge: '🏅', color: '#F59E0B' },
    { minLevel: 501, maxLevel: 650, title: 'Laksamana Agung', badge: '⚓', color: '#06B6D4' },
    { minLevel: 651, maxLevel: 800, title: 'Bendahara Negara', badge: '🏛', color: '#8B5CF6' },
    { minLevel: 801, maxLevel: 950, title: 'Mahaguru Perang', badge: '👑', color: '#E11D48' },
    { minLevel: 951, maxLevel: 999, title: 'Seri Maharaja Agung', badge: '🌟', color: '#FBBF24' },
  ];
  
  export class LevelSystem {
    public static readonly MAX_LEVEL = 999;
  
    /**
     * Kiraan jumlah XP yang diperlukan untuk melepasi satu-satu tahap (Level N -> Level N+1).
     * Formula: Base 100 XP + (Level^1.85 * 45)
     */
    public static getXpRequiredForNextLevel(currentLevel: number): number {
      if (currentLevel >= this.MAX_LEVEL) return 0;
      return Math.floor(100 + Math.pow(currentLevel, 1.85) * 45);
    }
  
    /**
     * Mengira pangkat berdasarkan tahap semasa
     */
    public static getRankForLevel(level: number): RankTier {
      const clampedLevel = Math.min(Math.max(level, 1), this.MAX_LEVEL);
      return (
        MILITARY_RANKS.find((r) => clampedLevel >= r.minLevel && clampedLevel <= r.maxLevel) ||
        MILITARY_RANKS[MILITARY_RANKS.length - 1]
      );
    }
  
    /**
     * Memproses penambahan XP dan mengembalikan status naik tahap (Level Up)
     */
    public static addXp(
      currentLevel: number,
      currentXp: number,
      xpToAdd: number,
      currentGold: number
    ): {
      newLevel: number;
      newXp: number;
      newGold: number;
      levelsGained: number;
      goldBonus: number;
    } {
      let level = currentLevel;
      let xp = currentXp + xpToAdd;
      let gold = currentGold;
      let levelsGained = 0;
      let totalGoldBonus = 0;
  
      while (level < this.MAX_LEVEL) {
        const needed = this.getXpRequiredForNextLevel(level);
        if (xp >= needed) {
          xp -= needed;
          level += 1;
          levelsGained += 1;
  
          // Ganjaran Emas Kenaikan Pangkat: Level * 1,000 Emas
          const reward = level * 1000;
          gold += reward;
          totalGoldBonus += reward;
        } else {
          break;
        }
      }
  
      if (level >= this.MAX_LEVEL) {
        level = this.MAX_LEVEL;
        xp = 0;
      }
  
      return {
        newLevel: level,
        newXp: xp,
        newGold: gold,
        levelsGained,
        goldBonus: totalGoldBonus,
      };
    }
  }