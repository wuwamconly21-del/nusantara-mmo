import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { ImmigrationApplication, RulerRole, reviewImmigrationApplication } from '../../services/immigrationEngine';

interface GovernmentApprovalPanelProps {
  visible: boolean;
  userRole: RulerRole;
  userName: string;
  pendingApplications: ImmigrationApplication[];
  onReviewComplete: (updatedApp: ImmigrationApplication) => void;
  onClose: () => void;
}

export function GovernmentApprovalPanel({
  visible,
  userRole,
  userName,
  pendingApplications,
  onReviewComplete,
  onClose,
}: GovernmentApprovalPanelProps) {
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  if (!visible) return null;

  const handleApprove = (app: ImmigrationApplication) => {
    const approvedApp = reviewImmigrationApplication(app, userRole, userName, 'APPROVED');
    onReviewComplete(approvedApp);
  };

  const handleRejectConfirm = (app: ImmigrationApplication) => {
    const rejectedApp = reviewImmigrationApplication(app, userRole, userName, 'REJECTED', rejectReason);
    onReviewComplete(rejectedApp);
    setRejectingAppId(null);
    setRejectReason('');
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.panelCard}>
        {/* HEADER PEMIMPIN */}
        <View style={styles.header}>
          <Text style={styles.title}>👑 PANEL KELULUSAN IMIGRESEN DIRAJA / KABINET</Text>
          <TouchableOpacity onPress={onClose}><Text style={styles.closeTxt}>✕</Text></TouchableOpacity>
        </View>
        <Text style={styles.roleBadge}>JAWATAN ANDA: <Text style={{ color: '#FBBF24' }}>{userRole}</Text></Text>

        <ScrollView style={styles.listArea}>
          {pendingApplications.length === 0 ? (
            <Text style={styles.emptyTxt}>Tiada permohonan visa/kewarganegaraan dalam senarai menunggu.</Text>
          ) : (
            pendingApplications.map((app) => (
              <View key={app.id} style={styles.appCard}>
                <View style={styles.appHeader}>
                  <Text style={styles.applicantName}>👤 {app.applicantName}</Text>
                  <Text style={styles.typeBadge}>{app.type}</Text>
                </View>

                <Text style={styles.appReason}>" {app.reason || 'Tiada alasan diberikan.'} "</Text>

                {/* MODUL PENOLAKAN DENGAN ALASAN */}
                {rejectingAppId === app.id ? (
                  <View style={styles.rejectInputBox}>
                    <TextInput
                      style={styles.rejectInput}
                      placeholder="Masukkan alasan penolakan rasmi..."
                      placeholderTextColor="#64748B"
                      value={rejectReason}
                      onChangeText={setRejectReason}
                    />
                    <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                      <TouchableOpacity style={styles.btnConfirmReject} onPress={() => handleRejectConfirm(app)}>
                        <Text style={styles.btnTxtSmall}>SAHKAN TOLAK</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.btnCancelReject} onPress={() => setRejectingAppId(null)}>
                        <Text style={styles.btnTxtSmall}>BATAL</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.btnApprove} onPress={() => handleApprove(app)}>
                      <Text style={styles.btnTxt}>✓ LULUSKAN (APPROVE)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnReject} onPress={() => setRejectingAppId(app.id)}>
                      <Text style={styles.btnTxt}>✕ TOLAK (REJECT)</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(5, 8, 15, 0.85)', justifyContent: 'center', alignItems: 'center', zIndex: 130 },
  panelCard: { width: 480, maxHeight: '85%', backgroundColor: '#0F172A', borderWidth: 1.5, borderColor: '#D97706', borderRadius: 8, padding: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  title: { color: '#F59E0B', fontSize: 12, fontWeight: 'bold' },
  closeTxt: { color: '#94A3B8', fontSize: 16, fontWeight: 'bold' },
  roleBadge: { color: '#94A3B8', fontSize: 9, fontWeight: 'bold', marginBottom: 12 },
  listArea: { maxHeight: 320 },
  emptyTxt: { color: '#64748B', fontSize: 10, textAlign: 'center', marginVertical: 30 },
  appCard: { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155', padding: 12, borderRadius: 6, marginBottom: 10 },
  appHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  applicantName: { color: '#F8FAFC', fontSize: 12, fontWeight: 'bold' },
  typeBadge: { color: '#FBBF24', fontSize: 9, fontWeight: 'bold', backgroundColor: '#2E2315', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  appReason: { color: '#94A3B8', fontSize: 10, fontStyle: 'italic', marginVertical: 8 },
  actionRow: { flexDirection: 'row', gap: 8 },
  btnApprove: { flex: 1, backgroundColor: '#059669', paddingVertical: 8, borderRadius: 4, alignItems: 'center' },
  btnReject: { flex: 1, backgroundColor: '#991B1B', paddingVertical: 8, borderRadius: 4, alignItems: 'center' },
  btnTxt: { color: '#FFFFFF', fontSize: 9, fontWeight: 'bold' },
  rejectInputBox: { backgroundColor: '#0F172A', padding: 8, borderRadius: 4, borderWidth: 1, borderColor: '#7F1D1D' },
  rejectInput: { color: '#F8FAFC', fontSize: 10, height: 32 },
  btnConfirmReject: { backgroundColor: '#DC2626', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  btnCancelReject: { backgroundColor: '#475569', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  btnTxtSmall: { color: '#FFFFFF', fontSize: 8, fontWeight: 'bold' },
});