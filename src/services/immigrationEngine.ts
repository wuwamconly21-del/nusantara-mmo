export type VisaType = 'TOURIST' | 'WORK_PERMIT' | 'RESIDENTIAL';
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type RulerRole = 'SULTAN' | 'DICTATOR' | 'INTERIOR_MINISTER' | 'CITIZEN';

export interface ImmigrationApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  type: VisaType;
  targetRegionCode: string;
  targetRegionName: string;
  targetCountry: string;
  reason?: string; // Alasan permohonan dari pemain
  status: ApplicationStatus;
  rejectionReason?: string; // Alasan penolakan dari Pemimpin
  reviewedByRole?: RulerRole;
  reviewedByName?: string;
  appliedAt: number;
  reviewedAt?: number;
}

// Semak Kuasa Kelulusan Pemimpin
export function canManageImmigration(role: RulerRole): boolean {
  return role === 'SULTAN' || role === 'DICTATOR' || role === 'INTERIOR_MINISTER';
}

// Pengendali Kelulusan / Penolakan Rasmi
export function reviewImmigrationApplication(
  app: ImmigrationApplication,
  reviewerRole: RulerRole,
  reviewerName: string,
  decision: 'APPROVED' | 'REJECTED',
  rejectionReason?: string
): ImmigrationApplication {
  if (!canManageImmigration(reviewerRole)) {
    throw new Error('🛑 TIADA KUASA: Hanya Sultan, Diktator, atau Menteri Dalam Negeri berhak menguruskan permohonan!');
  }

  return {
    ...app,
    status: decision,
    reviewedByRole: reviewerRole,
    reviewedByName: reviewerName,
    rejectionReason: decision === 'REJECTED' ? (rejectionReason || 'Ditolak atas sebab keselamatan wilayah.') : undefined,
    reviewedAt: Date.now(),
  };
}