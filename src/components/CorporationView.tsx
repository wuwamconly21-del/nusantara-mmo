import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { PlayerCorporation, BankAccount } from '../types/politics';

interface CorporationViewProps {
  currentPlayerId: string;
  currentPlayerName: string;
  playerGold: number;
  corporations: PlayerCorporation[];
  bank: BankAccount;
  onBuyShares: (corpId: string, shares: number) => void;
  onCreateCorporation: (name: string, tag: string, initialCap: number) => void;
  onPayDividend: (corpId: string, totalDividend: number) => void;
  onDepositBank: (amount: number) => void;
  onWithdrawBank: (amount: number) => void;
}

export function CorporationView({
  currentPlayerId,
  currentPlayerName,
  playerGold,
  corporations,
  bank,
  onBuyShares,
  onCreateCorporation,
  onPayDividend,
  onDepositBank,
  onWithdrawBank,
}: CorporationViewProps) {
  const [subTab, setSubTab] = useState<'KORPORAT' | 'BANK'>('KORPORAT');
  const [modalBinaCorp, setModalBinaCorp] = useState(false);
  const [corpName, setCorpName] = useState('');
  const [corpTag, setCorpTag] = useState('');
  const [bankAmount, setBankAmount] = useState('5000');

  const handleCreate = () => {
    if (!corpName.trim() || !corpTag.trim()) return;
    onCreateCorporation(corpName.trim(), corpTag.toUpperCase().trim(), 20000);
    setCorpName('');
    setCorpTag('');
    setModalBinaCorp(false);
  };

  return (
    <View style={styles.container}>
      {/* Tab Suis Korporasi vs Bank */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[styles.tabBtn, subTab === 'KORPORAT' && styles.tabBtnActive]}
          onPress={() => setSubTab('KORPORAT')}
        >
          <Text style={[styles.tabBtnTxt, subTab === 'KORPORAT' && styles.tabBtnTxtActive]}>🏢 Konglomerat & Saham</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, subTab === 'BANK' && styles.tabBtnActive]}
          onPress={() => setSubTab('BANK')}
        >
          <Text style={[styles.tabBtnTxt, subTab === 'BANK' && styles.tabBtnTxtActive]}>🏦 Perbankan Negeri</Text>
        </TouchableOpacity>
      </View>

      {subTab === 'KORPORAT' ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.title}>BURSA SAHAM & KORPORAT</Text>
              <Text style={styles.desc}>Beli saham konglomerat untuk dividen harian automatik.</Text>
            </View>
            <TouchableOpacity style={styles.createCorpBtn} onPress={() => setModalBinaCorp(true)}>
              <Text style={styles.createCorpBtnTxt}>+ TUBUH KORPORASI</Text>
            </TouchableOpacity>
          </View>

          {corporations.map((corp) => {
            const myShares = corp.shareholders.find((s) => s.playerId === currentPlayerId)?.sharesOwned || 0;
            const isCEO = corp.ceoId === currentPlayerId;

            return (
              <View key={corp.id} style={styles.corpCard}>
                <View style={styles.corpTop}>
                  <View>
                    <Text style={styles.corpName}>[{corp.tag}] {corp.name}</Text>
                    <Text style={styles.corpCEO}>Ketua Pegawai Eksekutif: {corp.ceoName}</Text>
                  </View>
                  <View style={styles.pricePill}>
                    <Text style={styles.priceTxt}>{corp.sharePrice.toLocaleString()} Emas / Saham</Text>
                  </View>
                </View>

                <View style={styles.corpStats}>
                  <Text style={styles.statTxt}>Kilang Dimiliki: <Text style={styles.whiteTxt}>{corp.factoriesOwnedCount} Unit</Text></Text>
                  <Text style={styles.statTxt}>Dana Rizab: <Text style={styles.goldTxt}>{corp.treasury.toLocaleString()} Emas</Text></Text>
                  <Text style={styles.statTxt}>Dividen Lepas: <Text style={styles.greenTxt}>+{corp.lastDividendPerShare} Emas/Unit</Text></Text>
                </View>

                <View style={styles.actionRow}>
                  <Text style={styles.mySharesTxt}>Pegangan Anda: <Text style={styles.whiteTxt}>{myShares} Saham</Text></Text>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity style={styles.buyShareBtn} onPress={() => onBuyShares(corp.id, 5)}>
                      <Text style={styles.btnDarkTxt}>BELI 5 SAHAM</Text>
                    </TouchableOpacity>

                    {isCEO && (
                      <TouchableOpacity style={styles.dividendBtn} onPress={() => onPayDividend(corp.id, 5000)}>
                        <Text style={styles.btnWhiteTxt}>AGIH DIVIDEN</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        /* SISTEM PERBANKAN WILAYAH */
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          <View style={styles.bankBox}>
            <Text style={styles.bankTitle}>BANK RIZAB PUSAT WILAYAH</Text>
            <Text style={styles.bankDesc}>Simpanan anda dijamin oleh Perbendaharaan Kedaulatan dengan kadar dividen tahunan 4.5%.</Text>

            <View style={styles.bankRow}>
              <View style={styles.balanceCell}>
                <Text style={styles.balanceLbl}>SIMPANAN TETAP ANDA</Text>
                <Text style={styles.balanceVal}>{bank.depositBalance.toLocaleString()} Emas</Text>
              </View>
              <View style={styles.balanceCell}>
                <Text style={styles.balanceLbl}>KADAR FAEDAH</Text>
                <Text style={styles.interestVal}>+{bank.interestRate}% Sehari</Text>
              </View>
            </View>

            <TextInput
              style={styles.bankInput}
              keyboardType="numeric"
              value={bankAmount}
              onChangeText={setBankAmount}
              placeholder="Jumlah transaksi emas..."
              placeholderTextColor="#64748B"
            />

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <TouchableOpacity
                style={[styles.bankActionBtn, { backgroundColor: '#059669' }]}
                onPress={() => onDepositBank(Number(bankAmount) || 0)}
              >
                <Text style={styles.btnWhiteTxt}>DEPOSIT KE BANK</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bankActionBtn, { backgroundColor: '#1E293B' }]}
                onPress={() => onWithdrawBank(Number(bankAmount) || 0)}
              >
                <Text style={styles.btnWhiteTxt}>KELUARKAN EMAS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Modal Tubuh Korporasi */}
      <Modal visible={modalBinaCorp} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>BORANG PENUBUHAN KORPORAT BERHAD</Text>
            <Text style={styles.modalDesc}>Penubuhan korporat memerlukan 20,000 Emas modal pendaftaran dan akan menerbitkan 100 unit saham permulaan.</Text>

            <TextInput
              style={styles.input}
              placeholder="Nama Korporasi (cth: Nusantara Petroleum Corp)"
              placeholderTextColor="#64748B"
              value={corpName}
              onChangeText={setCorpName}
            />
            <TextInput
              style={styles.input}
              placeholder="Tag Saham (cth: NPC / SELAT)"
              placeholderTextColor="#64748B"
              value={corpTag}
              onChangeText={setCorpTag}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalBinaCorp(false)}>
                <Text style={styles.btnWhiteTxt}>BATAL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
                <Text style={styles.btnDarkTxt}>BAYAR 20,000 & TUBUH</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070A10', padding: 14 },
  tabHeader: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#1E293B', marginBottom: 12 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: '#F59E0B' },
  tabBtnTxt: { color: '#64748B', fontSize: 12, fontWeight: 'bold' },
  tabBtnTxtActive: { color: '#F59E0B' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { color: '#F8FAFC', fontSize: 14, fontWeight: 'bold' },
  desc: { color: '#94A3B8', fontSize: 10, marginTop: 2 },
  createCorpBtn: { backgroundColor: '#D97706', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  createCorpBtnTxt: { color: '#070A10', fontSize: 10, fontWeight: 'bold' },
  corpCard: { backgroundColor: '#0E1624', borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#1E293B' },
  corpTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  corpName: { color: '#F8FAFC', fontSize: 13, fontWeight: 'bold' },
  corpCEO: { color: '#94A3B8', fontSize: 10, marginTop: 2 },
  pricePill: { backgroundColor: '#1E293B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  priceTxt: { color: '#F59E0B', fontSize: 10, fontWeight: 'bold' },
  corpStats: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#1E293B', paddingTop: 8, marginTop: 8 },
  statTxt: { color: '#64748B', fontSize: 10 },
  whiteTxt: { color: '#F8FAFC', fontWeight: 'bold' },
  goldTxt: { color: '#F59E0B', fontWeight: 'bold' },
  greenTxt: { color: '#10B981', fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  mySharesTxt: { color: '#94A3B8', fontSize: 10 },
  buyShareBtn: { backgroundColor: '#F59E0B', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4 },
  dividendBtn: { backgroundColor: '#059669', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4 },
  btnDarkTxt: { color: '#070A10', fontSize: 9, fontWeight: 'bold' },
  btnWhiteTxt: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  bankBox: { backgroundColor: '#0E1624', borderRadius: 8, padding: 16, borderWidth: 1, borderColor: '#D97706' },
  bankTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: 'bold' },
  bankDesc: { color: '#94A3B8', fontSize: 11, marginVertical: 6 },
  bankRow: { flexDirection: 'row', gap: 10, marginVertical: 10 },
  balanceCell: { flex: 1, backgroundColor: '#070A10', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#1E293B' },
  balanceLbl: { color: '#64748B', fontSize: 9, fontWeight: 'bold' },
  balanceVal: { color: '#F59E0B', fontSize: 15, fontWeight: 'bold', marginTop: 4 },
  interestVal: { color: '#10B981', fontSize: 15, fontWeight: 'bold', marginTop: 4 },
  bankInput: { backgroundColor: '#070A10', borderWidth: 1, borderColor: '#334155', borderRadius: 6, color: '#F8FAFC', paddingHorizontal: 10, height: 40, fontSize: 12 },
  bankActionBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { width: '100%', maxWidth: 400, backgroundColor: '#0B121D', borderRadius: 8, borderWidth: 1.5, borderColor: '#D97706', padding: 16 },
  modalTitle: { color: '#F8FAFC', fontSize: 13, fontWeight: 'bold' },
  modalDesc: { color: '#94A3B8', fontSize: 10, marginVertical: 6 },
  input: { backgroundColor: '#070A10', borderWidth: 1, borderColor: '#334155', borderRadius: 4, color: '#F8FAFC', paddingHorizontal: 10, height: 38, fontSize: 11, marginBottom: 8 },
  cancelBtn: { backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  submitBtn: { backgroundColor: '#D97706', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
});