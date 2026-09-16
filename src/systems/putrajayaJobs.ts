export interface JobOption {
    id: string;
    title: string;
    description: string;
    payoutRM: number;
    energyCost: number;
    durationSeconds: number;
  }
  
  export const PUTRAJAYA_JOB_OFFERS: JobOption[] = [
    {
      id: 'arkib-negara',
      title: 'Pembantu Arkib Dokumen Diraja',
      description: 'Menyusun rekod kedaulatan dan peta sempadan rantau Nusantara.',
      payoutRM: 350,
      energyCost: 15,
      durationSeconds: 10,
    },
    {
      id: 'kuarters-fed',
      title: 'Penyelenggara Kompleks Persekutuan',
      description: 'Membaiki kemudahan utiliti di sekitar presint pentadbiran pusat.',
      payoutRM: 750,
      energyCost: 30,
      durationSeconds: 20,
    },
    {
      id: 'logistik-hab',
      title: 'Pegawai Logistik Gudang Bebas Cukai',
      description: 'Memeriksa kargo barangan dagangan yang tiba dari negeri-negeri luar.',
      payoutRM: 1400,
      energyCost: 50,
      durationSeconds: 35,
    },
  ];
  
  export interface PlayerWorkState {
    walletRM: number;
    energy: number;
    maxEnergy: number;
    completedJobsCount: number;
  }