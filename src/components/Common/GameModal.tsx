import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface GameModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type?: 'INFO' | 'SUCCESS' | 'WARNING';
}

export function GameModal({ visible, title, message, onClose, type = 'INFO' }: GameModalProps) {
  if (!visible) return null;

  const borderColor = type === 'SUCCESS' ? '#10B981' : type === 'WARNING' ? '#EF4444' : '#D97706';

  return (
    <View style={styles.overlay}>
      <View style={[styles.modalBox, { borderColor }]}>
        <Text style={[styles.title, { color: borderColor }]}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        
        <TouchableOpacity style={[styles.button, { backgroundColor: borderColor }]} onPress={onClose}>
          <Text style={styles.buttonText}>OK, FAHAM</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(5, 8, 15, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalBox: {
    width: 360,
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowRadius: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  message: {
    color: '#CBD5E1',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  buttonText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: 'bold',
  },
});