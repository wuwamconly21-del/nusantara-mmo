import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { PUTRAJAYA_JOB_OFFERS, JobOption, PlayerWorkState } from '../../systems/putrajayaJobs';

interface PutrajayaWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerState: PlayerWorkState;
  onJobComplete: (rewardRM: number, energyUsed: number) => void;
}

export function PutrajayaWorkModal({
  isOpen,
  onClose,
  playerState,
  onJobComplete,
}: PutrajayaWorkModalProps) {
  const [workingJobId, setWorkingJobId] = useState<string | null>(null);

  if (!isOpen) return null;

  const startJob = (job: JobOption) => {
    if (playerState.energy < job.energyCost) {
      alert('Tenaga tidak mencukupi untuk memulakan syif ini!');
      return;
    }

    setWorkingJobId(job.id);

    setTimeout(() => {
      onJobComplete(job.payoutRM, job.energyCost);
      setWorkingJobId(null);
    }, job.durationSeconds * 1000);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <View>
            <Text style={styles.subTitle}>KOMPLEKS PENTADBIRAN PUSAT</Text>
            <Text style={styles.title}>Biro Pekerjaan Awam Putrajaya</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} disabled={!!workingJobId}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsBar}>
          <Text style={styles.statLabel}>
            Baki Dompet: <Text style={styles.goldText}>RM {playerState.walletRM.toLocaleString()}</Text>
          </Text>
          <Text style={styles.statLabel}>
            Tenaga: <Text style={styles.cyanText}>{playerState.energy} / {playerState.maxEnergy}</Text>
          </Text>
        </View>

        <FlatList
          data={PUTRAJAYA_JOB_OFFERS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isCurrentWorking = workingJobId === item.id;
            const hasEnoughEnergy = playerState.energy >= item.energyCost;

            return (
              <View style={styles.jobCard}>
                <View style={styles.jobInfo}>
                  <Text style={styles.jobTitle}>{item.title}</Text>
                  <Text style={styles.jobDesc}>{item.description}</Text>
                  <View style={styles.jobBadges}>
                    <Text style={styles.badgeReward}>+ RM {item.payoutRM}</Text>
                    <Text style={styles.badgeEnergy}>⚡ -{item.energyCost} Tenaga</Text>
                    <Text style={styles.badgeTime}>⏱️ {item.durationSeconds}s</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.workButton,
                    (!hasEnoughEnergy || !!workingJobId) && styles.disabledButton,
                  ]}
                  disabled={!hasEnoughEnergy || !!workingJobId}
                  onPress={() => startJob(item)}
                >
                  {isCurrentWorking ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.workButtonText}>Bekerja</Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1100,
  },
  modal: {
    width: 550,
    backgroundColor: '#0C0E14',
    borderColor: '#D97706',
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    paddingBottom: 10,
    marginBottom: 12,
  },
  subTitle: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  title: {
    color: '#FBBF24',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    color: '#A1A1AA',
    fontSize: 16,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#161922',
    padding: 10,
    borderRadius: 6,
    marginBottom: 14,
  },
  statLabel: {
    color: '#D4D4D8',
    fontSize: 12,
  },
  goldText: {
    color: '#FBBF24',
    fontWeight: 'bold',
  },
  cyanText: {
    color: '#38BDF8',
    fontWeight: 'bold',
  },
  jobCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#12151D',
    borderWidth: 1,
    borderColor: '#27272A',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  jobInfo: {
    flex: 1,
    paddingRight: 12,
  },
  jobTitle: {
    color: '#FAFAFA',
    fontSize: 13,
    fontWeight: 'bold',
  },
  jobDesc: {
    color: '#A1A1AA',
    fontSize: 11,
    marginVertical: 4,
  },
  jobBadges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  badgeReward: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: 'bold',
  },
  badgeEnergy: {
    color: '#FBBF24',
    fontSize: 10,
  },
  badgeTime: {
    color: '#A1A1AA',
    fontSize: 10,
  },
  workButton: {
    backgroundColor: '#B45309',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#3F3F46',
  },
  workButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});