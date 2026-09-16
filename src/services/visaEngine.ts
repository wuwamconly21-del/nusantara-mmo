export type VisaStatus = 'TOURIST' | 'WORK_PERMIT' | 'RESIDENTIAL';
export type GovernmentRole = 'SULTAN' | 'DICTATOR' | 'INTERIOR_MINISTER' | 'GOVERNOR' | 'CITIZEN';

export interface ResidencyApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  targetRegionCode: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: number;
}

// Semak sama ada akaun pemain mempunyai kuasa meluluskan Residency
export function canApproveResidency(userRole: GovernmentRole): boolean {
  return (
    userRole === 'SULTAN' ||
    userRole === 'DICTATOR' ||
    userRole === 'INTERIOR_MINISTER'
  );
}

// Logik Kelulusan Permohonan Residency
export function processResidencyApproval(
  application: ResidencyApplication,
  approverRole: GovernmentRole
): { success: boolean; message: string } {
  if (!canApproveResidency(approverRole)) {
    return {
      success: false,
      message: '🛑 PERMOHONAN DITOLAK: Hanya Sultan, Diktator, atau Menteri Dalam Negeri sahaja yang mempunyai kuasa prerogatif untuk meluluskan Kerakyatan/Residency!',
    };
  }

  return {
    success: true,
    message: `✅ LULUS! Permohonan Residency untuk ${application.applicantName} telah diluluskan secara rasmi oleh ${approverRole}.`,
  };
}