export interface StateCentralBank {
    stateCode: string;
    stateName: string;
    treasuryGold: number;
    reserveGold: number;
    depositInterestRate: number; // Kadar dividen simpanan (cth: 4.5%)
    loanInterestRate: number;    // Kadar faedah pinjaman (cth: 8.0%)
    totalDepositedByPlayers: number;
    totalLoansIssued: number;
    isNationalized: boolean;     // Dikawal penuh oleh kabinet kerajaan negeri
  }
  
  export interface BankShareAsset {
    id: string;
    corpId: string;
    corpName: string;
    ticker: string;
    totalShares: number;
    availableShares: number;
    pricePerShare: number;
    dividendYield: number;
    dailyFluctuation: number; // Peratus turun/naik (-5% ke +5%)
  }
  
  export interface PlayerBankLedger {
    playerId: string;
    savingsBalance: number;
    activeLoanAmount: number;
    loanDueTimestamp: number;
    ownedShares: {
      shareId: string;
      quantity: number;
      buyPrice: number;
    }[];
  }