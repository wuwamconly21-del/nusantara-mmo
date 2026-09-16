import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
  Landmark,
  TrendingUp,
  DollarSign,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
} from 'lucide-react-native';
import { StateCentralBank, BankShareAsset, PlayerBankLedger } from '../types/banking';

interface CentralBankViewProps {
  bank: StateCentralBank;
  ledger: PlayerBankLedger;
  shares: BankShareAsset[];
  playerGold: number;
  isCabinetMinister: boolean;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
  onTakeLoan: (amount: number) => void;
  onRepayLoan: (amount: number) => void;
  onBuyShares: (shareId: string, qty: number) => void;
  onSellShares: (shareId: string, qty: number) => void;
  onUpdateInterestRates?: (depositRate: number, loanRate: number) => void;
  onBack: () => void;
}

export function CentralBankView({
  bank,
  ledger,
  shares,
  playerGold,
  isCabinetMinister,
  onDeposit,
  onWithdraw,
  onTakeLoan,
  onRepayLoan,
  onBuyShares,
  onSellShares,
  onUpdateInterestRates,
  onBack,
}: CentralBankViewProps) {
  const [activeTab, setActiveTab] = useState<'SIMPANAN' | 'PINJAMAN' | 'SAHAM'>('SIMPANAN');
  const [amountInput, setAmountInput] = useState('');
  const [shareQtyInput, setShareQtyInput] = useState('1');

  // Input kawalan menteri
  const [govDepRate, setGovDepRate] = useState(bank.depositInterestRate.toString());
  const [govLoanRate, setGovLoanRate] = useState(bank.loanInterestRate.toString());

  const parsedAmount = Math.max(0, parseInt(amountInput, 10) || 0);
  const parsedQty = Math.max(1, parseInt(shareQtyInput, 10) || 1);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Header Bank Pusat Kedaulatan */}
      <View style={styles.headerCard}>
        <View style={styles.rowBetween}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={styles.avatarIcon}>
              <Landmark size={24} color="#F3CE65" />
            </View>
            <View>
              <Text style={styles.bankTitle}>BANK PUSAT {bank.stateName.toUpperCase()}</Text>
              <Text style={styles.bankSub}>Lembaga Monetari & Rizab Perbendaharaan Negeri</Text>
            </View>
          </View>
          <View style={styles.statusPill}>
            <ShieldCheck size={12} color="#10B981" />
            <Text style={styles.statusPillTxt}>MILIK KERAJAAN</Text>
          </View>
        </View>

        {/* Statistik Rizab & Dana */}
        <View style={styles.statGrid}>
          <View style={styles.statCell}>
            <Text style={styles.statLbl}>RIZAB EMAS NEGERI</Text>
            <Text style={styles.statValGold}>${bank.reserveGold.toLocaleString()}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statLbl}>KADAR SIMPANAN</Text>
            <Text style={styles.statValGreen}>+{bank.depositInterestRate}% / kitaran</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statLbl}>KADAR PINJAMAN</Text>
            <Text style={styles.statValRed}>{bank.loanInterestRate}% caj</Text>
          </View>
        </View>
      </View>

      {/* Navigasi Tab Perbankan */}
      <View style={styles.tabNav}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'SIMPANAN' && styles.tabBtnActive]}
          onPress={() => { setActiveTab('SIMPANAN'); setAmountInput(''); }}
        >
          <PiggyBank size={14} color={activeTab === 'SIMPANAN' ? '#F3CE65' : '#888'} />
          <Text style={[styles.tabTxt, activeTab === 'SIMPANAN' && styles.tabTxtActive]}>Akaun Simpanan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'PINJAMAN' && styles.tabBtnActive]}
          onPress={() => { setActiveTab('PINJAMAN'); setAmountInput(''); }}
        >
          <DollarSign size={14} color={activeTab === 'PINJAMAN' ? '#F3CE65' : '#888'} />
          <Text style={[styles.tabTxt, activeTab === 'PINJAMAN' && styles.tabTxtActive]}>Pinjaman Modal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'SAHAM' && styles.tabBtnActive]}
          onPress={() => setActiveTab('SAHAM')}
        >
          <TrendingUp size={14} color={activeTab === 'SAHAM' ? '#F3CE65' : '#888'} />
          <Text style={[styles.tabTxt, activeTab === 'SAHAM' && styles.tabTxtActive]}>Bursa Saham</Text>
        </TouchableOpacity>
      </View>

      {/* 1. MODUL SIMPANAN BERFAEDAH */}
      {activeTab === 'SIMPANAN' && (
        <View style={styles.cardGolden}>
          <Text style={styles.secTitle}>SIMPANAN DANA & DIVIDEN</Text>
          <Text style={styles.cardDesc}>
            Simpanan anda dijamin oleh perbendaharaan negeri dan meraih pulangan faedah berkala.
          </Text>

          <View style={styles.balanceHighlight}>
            <Text style={styles.mutedSmall}>BAKI SIMPANAN ANDA</Text>
            <Text style={styles.balanceBig}>${ledger.savingsBalance.toLocaleString()} RM</Text>
            <Text style={styles.greenSmall}>Jangkaan Dividen: +${Math.floor(ledger.savingsBalance * (bank.depositInterestRate / 100)).toLocaleString()} RM</Text>
          </View>

          <TextInput
            style={styles.mainInput}
            placeholder="Masukkan jumlah amaun..."
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={amountInput}
            onChangeText={setAmountInput}
          />

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.btnAction, styles.btnDeposit]}
              onPress={() => {
                if (parsedAmount > 0 && playerGold >= parsedAmount) {
                  onDeposit(parsedAmount);
                  setAmountInput('');
                }
              }}
            >
              <Text style={styles.btnActionTxt}>DEPOSIT (SIMPAN)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnAction, styles.btnWithdraw]}
              onPress={() => {
                if (parsedAmount > 0 && ledger.savingsBalance >= parsedAmount) {
                  onWithdraw(parsedAmount);
                  setAmountInput('');
                }
              }}
            >
              <Text style={styles.btnActionTxt}>PENGELUARAN</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 2. MODUL PINJAMAN MODAL */}
      {activeTab === 'PINJAMAN' && (
        <View style={styles.cardGolden}>
          <Text style={styles.secTitle}>PINJAMAN PEMBANGUNAN NEGERI</Text>
          <Text style={styles.cardDesc}>
            Dapatkan dana segera daripada perbendaharaan negeri untuk mendirikan loji kilang atau melatih angkatan tentera.
          </Text>

          <View style={[styles.balanceHighlight, { borderColor: '#7F1D1D' }]}>
            <Text style={styles.mutedSmall}>BAKI PINJAMAN TERTUNGGAK</Text>
            <Text style={[styles.balanceBig, { color: '#EF4444' }]}>${ledger.activeLoanAmount.toLocaleString()} RM</Text>
            <Text style={styles.redSmall}>Kadar Faedah Semasa: {bank.loanInterestRate}%</Text>
          </View>

          <TextInput
            style={styles.mainInput}
            placeholder="Jumlah pinjaman/bayaran..."
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={amountInput}
            onChangeText={setAmountInput}
          />

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.btnAction, { backgroundColor: '#B45309' }]}
              onPress={() => {
                if (parsedAmount > 0) {
                  onTakeLoan(parsedAmount);
                  setAmountInput('');
                }
              }}
            >
              <Text style={styles.btnActionTxt}>AMBIL PINJAMAN</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnAction, { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#10B981' }]}
              onPress={() => {
                if (parsedAmount > 0 && playerGold >= parsedAmount) {
                  onRepayLoan(parsedAmount);
                  setAmountInput('');
                }
              }}
            >
              <Text style={[styles.btnActionTxt, { color: '#10B981' }]}>BAYAR BALIK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 3. MODUL BURSA SAHAM KORPORAT */}
      {activeTab === 'SAHAM' && (
        <View>
          <View style={styles.cardGolden}>
            <Text style={styles.secTitle}>BURSA SAHAM & BON KORPORAT</Text>
            <Text style={styles.cardDesc}>
              Beli dan dagangkan unit saham syarikat logistik, perlombongan, dan persenjataan negeri:
            </Text>
          </View>

          {shares.map((s) => {
            const owned = ledger.ownedShares.find((item) => item.shareId === s.id)?.quantity || 0;
            const isBullish = s.dailyFluctuation >= 0;

            return (
              <View key={s.id} style={styles.shareCard}>
                <View style={styles.rowBetween}>
                  <View>
                    <Text style={styles.shareName}>{s.corpName}</Text>
                    <Text style={styles.shareTicker}>{s.ticker} • Baki Saham: {s.availableShares.toLocaleString()}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.sharePrice}>${s.pricePerShare.toLocaleString()} RM</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {isBullish ? <ArrowUpRight size={12} color="#10B981" /> : <ArrowDownRight size={12} color="#EF4444" />}
                      <Text style={[styles.flucTxt, { color: isBullish ? '#10B981' : '#EF4444' }]}>
                        {isBullish ? `+${s.dailyFluctuation}%` : `${s.dailyFluctuation}%`}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.shareFooter}>
                  <Text style={styles.ownedTxt}>Milikan Anda: <Text style={styles.whiteBold}>{owned} Unit</Text></Text>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity
                      style={styles.btnMiniTrade}
                      onPress={() => onBuyShares(s.id, parsedQty)}
                    >
                      <Text style={styles.btnMiniTradeTxt}>BELI</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={owned <= 0}
                      style={[styles.btnMiniTrade, { backgroundColor: '#1E1B13', borderColor: '#EF4444' }, owned <= 0 && { opacity: 0.4 }]}
                      onPress={() => onSellShares(s.id, parsedQty)}
                    >
                      <Text style={[styles.btnMiniTradeTxt, { color: '#EF4444' }]}>JUAL</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* PANEL KAWALAN MENTERI KEWANGAN / SYAHBANDAR */}
      {isCabinetMinister && onUpdateInterestRates && (
        <View style={styles.govPanel}>
          <Text style={styles.govTitle}>🏛 PANEL KAWALAN MONETARI KERAJAAN NEGERI</Text>
          <Text style={styles.mutedSmall}>Kuasa eksekutif untuk melaraskan kadar dasar bank pusat:</Text>

          <View style={styles.rowBetween}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.fieldLbl}>Kadar Simpanan (%):</Text>
              <TextInput
                style={styles.govInput}
                keyboardType="numeric"
                value={govDepRate}
                onChangeText={setGovDepRate}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLbl}>Kadar Pinjaman (%):</Text>
              <TextInput
                style={styles.govInput}
                keyboardType="numeric"
                value={govLoanRate}
                onChangeText={setGovLoanRate}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.btnSaveRates}
            onPress={() => {
              const dR = parseFloat(govDepRate);
              const lR = parseFloat(govLoanRate);
              if (!isNaN(dR) && !isNaN(lR)) {
                onUpdateInterestRates(dR, lR);
              }
            }}
          >
            <Text style={styles.btnSaveRatesTxt}>WARTAKAN KADAR MONETARI</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07090E', paddingHorizontal: 12 },
  headerCard: { backgroundColor: '#0E131C', borderRadius: 8, borderWidth: 1.2, borderColor: '#F59E0B', padding: 14, marginVertical: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatarIcon: { width: 42, height: 42, borderRadius: 6, backgroundColor: '#1C1626', borderWidth: 1, borderColor: '#F3CE65', alignItems: 'center', justifyContent: 'center' },
  bankTitle: { color: '#F8FAFC', fontSize: 13, fontWeight: 'bold', letterSpacing: 0.5 },
  bankSub: { color: '#94A3B8', fontSize: 9, marginTop: 1 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#064E3B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusPillTxt: { color: '#10B981', fontSize: 8, fontWeight: 'bold' },
  statGrid: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#1E293B', paddingTop: 10, marginTop: 12 },
  statCell: { alignItems: 'center' },
  statLbl: { color: '#64748B', fontSize: 8, fontWeight: 'bold' },
  statValGold: { color: '#F59E0B', fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  statValGreen: { color: '#10B981', fontSize: 11, fontWeight: 'bold', marginTop: 2 },
  statValRed: { color: '#EF4444', fontSize: 11, fontWeight: 'bold', marginTop: 2 },

  tabNav: { flexDirection: 'row', backgroundColor: '#0D111A', borderRadius: 6, padding: 4, marginBottom: 12, borderWidth: 1, borderColor: '#1E293B' },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 4 },
  tabBtnActive: { backgroundColor: '#1A1824', borderWidth: 1, borderColor: '#F3CE65' },
  tabTxt: { color: '#888', fontSize: 10, fontWeight: 'bold' },
  tabTxtActive: { color: '#F3CE65' },

  cardGolden: { backgroundColor: '#0E0B14', borderRadius: 8, borderWidth: 1, borderColor: '#3D311F', padding: 12, marginBottom: 10 },
  secTitle: { color: '#F3CE65', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  cardDesc: { color: '#888', fontSize: 10, marginVertical: 4 },
  balanceHighlight: { backgroundColor: '#080C12', padding: 12, borderRadius: 6, borderWidth: 1, borderColor: '#1E293B', marginVertical: 8, alignItems: 'center' },
  balanceBig: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold', marginTop: 2 },
  mutedSmall: { color: '#888', fontSize: 8, fontWeight: 'bold' },
  greenSmall: { color: '#10B981', fontSize: 9, fontWeight: 'bold', marginTop: 2 },
  redSmall: { color: '#EF4444', fontSize: 9, fontWeight: 'bold', marginTop: 2 },

  mainInput: { backgroundColor: '#05070A', borderWidth: 1, borderColor: '#334155', borderRadius: 4, color: '#FFF', paddingHorizontal: 10, height: 38, fontSize: 12, marginVertical: 8 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  btnAction: { flex: 1, paddingVertical: 10, borderRadius: 4, alignItems: 'center' },
  btnDeposit: { backgroundColor: '#065F46' },
  btnWithdraw: { backgroundColor: '#7F1D1D' },
  btnActionTxt: { color: '#FFF', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },

  shareCard: { backgroundColor: '#0D111A', borderRadius: 6, borderWidth: 1, borderColor: '#1E293B', padding: 12, marginBottom: 8 },
  shareName: { color: '#F8FAFC', fontSize: 12, fontWeight: 'bold' },
  shareTicker: { color: '#64748B', fontSize: 9, marginTop: 1 },
  sharePrice: { color: '#F8FAFC', fontSize: 13, fontWeight: 'bold' },
  flucTxt: { fontSize: 10, fontWeight: 'bold', marginLeft: 2 },
  shareFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#1E293B', paddingTop: 8, marginTop: 8 },
  ownedTxt: { color: '#888', fontSize: 10 },
  whiteBold: { color: '#FFF', fontWeight: 'bold' },
  btnMiniTrade: { backgroundColor: '#F3CE65', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, borderWidth: 1, borderColor: '#D97706' },
  btnMiniTradeTxt: { color: '#07090E', fontSize: 9, fontWeight: 'bold' },

  govPanel: { backgroundColor: '#120F1C', borderRadius: 8, borderWidth: 1.2, borderColor: '#8B5CF6', padding: 14, marginTop: 10 },
  govTitle: { color: '#C084FC', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  fieldLbl: { color: '#94A3B8', fontSize: 9, marginTop: 8 },
  govInput: { backgroundColor: '#070A10', borderWidth: 1, borderColor: '#4C1D95', borderRadius: 4, color: '#FFF', paddingHorizontal: 8, height: 34, fontSize: 11, marginTop: 2 },
  btnSaveRates: { backgroundColor: '#7C3AED', paddingVertical: 10, borderRadius: 4, alignItems: 'center', marginTop: 12 },
  btnSaveRatesTxt: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
});