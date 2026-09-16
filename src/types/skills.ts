export interface PlayerDisciplines {
    ilmuKetenteraan: number;   // Bonus kerosakan tempur
    ilmuKejuruteraan: number;  // Bonus kapasiti berek
    ilmuPerusahaan: number;    // Bonus hasil perahan lombong
    ilmuPerbendaharaan: number;// Bonus diskaun tarif dan cukai
    ilmuFirasat: number;       // Bonus lonjakan perolehan XP
  }
  
  export interface PassiveTalents {
    pengaruhDaulat: number; // Max 30
    pakarUpeti: number;     // Max 30
    langkahPantas: number;  // Max 25
    gedungSaujana: number;  // Max 25
    ketahananBatin: number; // Max 20 (Bonus HP maks)
    cekapBahan: number;     // Max 20 (Diskaun kos latihan unit)
    bungaWang: number;      // Max 20 (Bonus dividen bank)
    semangatWaja: number;   // Max 25 (Bonus kerosakan kritikal)
  }
  
  export interface ActiveStudySession {
    disciplineKey: keyof PlayerDisciplines;
    method: 'WANG' | 'NILAM';
    targetLevel: number;
    startTime: number;
    durationMs: number;
    endTime: number;
  }