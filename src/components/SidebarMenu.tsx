import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import {
  Map,
  Landmark,
  Users,
  Vote,
  User,
  Building2,
  Factory,
  Swords,
  Package,
  FileText,
  LogOut,
  LogIn,
  X,
} from 'lucide-react-native';

interface SidebarMenuProps {
  visible: boolean;
  playerName: string;
  userGold: number;
  userGems: number;
  userIsLoggedIn?: boolean;
  onNavigate: (screen: string) => void;
  onClose: () => void;
  onLogKeluar?: () => void;
  onLogMasuk?: () => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  visible,
  playerName,
  userGold,
  userGems,
  userIsLoggedIn = false,
  onNavigate,
  onClose,
  onLogKeluar,
  onLogMasuk,
}) => {
  const handleNav = (screen: string) => {
    onNavigate(screen);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.drawerContainer}>
          {/* DRAWER HEADER */}
          <View style={styles.drawerHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.playerTitle}>{playerName}</Text>
              <Text style={styles.playerSub}>
                💰 ${userGold.toLocaleString()} RM • 💎 {userGems} Nilam
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#F3CE65" />
            </TouchableOpacity>
          </View>

          {/* MENU ITEMS */}
          <ScrollView style={styles.menuList} contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={styles.sectionTitle}>TEROKA</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNav('MAP')}>
              <Map size={18} color="#F3CE65" />
              <Text style={styles.menuText}>Peta Dunia & Region</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNav('WAR')}>
              <Swords size={18} color="#EF4444" />
              <Text style={styles.menuText}>Medan Peperangan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNav('FACTORY')}>
              <Factory size={18} color="#F3CE65" />
              <Text style={styles.menuText}>Sektor Perkilangan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNav('WAREHOUSE')}>
              <Package size={18} color="#38BDF8" />
              <Text style={styles.menuText}>Gedung Simpanan</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>PENTADBIRAN & NEGERI</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNav('PARLIAMENT')}>
              <Landmark size={18} color="#F3CE65" />
              <Text style={styles.menuText}>Parlimen & Perundangan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNav('PARTY')}>
              <Users size={18} color="#F3CE65" />
              <Text style={styles.menuText}>Dewan Parti Politik</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNav('ELECTIONS')}>
              <Vote size={18} color="#10B981" />
              <Text style={styles.menuText}>Pilihan Raya (PRU / PRN)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNav('BANK')}>
              <Building2 size={18} color="#F59E0B" />
              <Text style={styles.menuText}>Bank Pusat & Perbankan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNav('VISA')}>
              <FileText size={18} color="#A855F7" />
              <Text style={styles.menuText}>Pasport & Dokumen Visa</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>AKAUN & PROFIL</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNav('PROFILE')}>
              <User size={18} color="#F3CE65" />
              <Text style={styles.menuText}>Rekod & Ilmu Pendekar</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* AUTH ACTION AT BOTTOM */}
          <View style={styles.drawerFooter}>
            {userIsLoggedIn ? (
              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={() => {
                  if (onLogKeluar) onLogKeluar();
                  onClose();
                }}
              >
                <LogOut size={16} color="#EF4444" />
                <Text style={styles.logoutBtnTxt}>LOG KELUAR AKAUN</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => {
                  if (onLogMasuk) onLogMasuk();
                  onClose();
                }}
              >
                <LogIn size={16} color="#07060A" />
                <Text style={styles.loginBtnTxt}>LOG MASUK / DAFTAR</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  drawerContainer: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#0E0B14',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: '#3D311F',
    padding: 16,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#1E1826',
    marginBottom: 10,
  },
  playerTitle: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  playerSub: { color: '#F3CE65', fontSize: 11, marginTop: 2 },
  closeBtn: { padding: 4 },
  menuList: { flex: 1 },
  sectionTitle: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#14101B',
    borderWidth: 1,
    borderColor: '#22192D',
    borderRadius: 6,
    padding: 12,
    marginBottom: 6,
  },
  menuText: { color: '#FFF', fontSize: 12, fontWeight: '500' },
  drawerFooter: { paddingTop: 12, borderTopWidth: 1, borderColor: '#1E1826' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E141D',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 6,
    paddingVertical: 12,
  },
  logoutBtnTxt: { color: '#EF4444', fontSize: 11, fontWeight: 'bold', marginLeft: 8 },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3CE65',
    borderRadius: 6,
    paddingVertical: 12,
  },
  loginBtnTxt: { color: '#07060A', fontSize: 11, fontWeight: 'bold', marginLeft: 8 },
});
