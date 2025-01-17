// DealDetailScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useFetchSwap } from '@/hooks/SwapHooks/useFetchSwap';
import QRCodeSVG from 'react-native-qrcode-svg'; // library import
import { useUser } from '@clerk/clerk-expo';

export default function DealDetailScreen() {
  const { dealId } = useLocalSearchParams() as { dealId: string };
  const [showQR, setShowQR] = useState(false);
  const [qrValue, setQRValue] = useState('');

  const { user } = useUser();

  // Example: This would come from your user context or Clerk info
  const currentUserId = user?.id;
  // Suppose you know who is the "seller" or "proposer"
  // or store it in "deal" as "proposerId" if that's the seller.

  // Fetch the deal data from the API
  const { data: deal, isLoading, isError } = useFetchSwap(dealId);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D97FB8" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading deal...</Text>
      </View>
    );
  }

  if (!deal || isError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#666' }}>Failed to load the deal details.</Text>
      </View>
    );
  }

  // Handlers for actions
  const handleAccept = () => {
    // call API: accept the deal
  };
  const handleDecline = () => {
    // call API: decline the deal
  };
  const handleComplete = () => {
    // call API: mark as completed
  };

  // Navigate to Chat
  const handleOpenChat = () => {
    if (!deal.chatId) {
      // If no chat linked, show an alert
      return;
    }
    router.push(`/chat/${deal.chatId}`);
  };

  // SELLER "Generate QR"
  const handleGenerateQR = () => {
    // You might want a custom code or just the deal.id:
    setQRValue(deal.confirmationCode || deal.id);
    setShowQR(true);
  };

  // BUYER "Scan QR"
  const handleScanQR = () => {
    // Navigate to a screen that uses expo-barcode-scanner,
    // passing the deal.id or some needed param.
    router.push(`/QRScanner?dealId=${deal.id}`);
  };

  // If partialCash is > 0
  const cashLabel =
    deal.partialCash && deal.partialCash > 0
      ? `+ ${deal.partialCash} kr`
      : null;

  // Optionally color-code background based on status
  let containerColor = '#FFF';
  switch (deal.status) {
    case 'pending':
      containerColor = '#FCE4EC'; // pastel pink
      break;
    case 'accepted':
      containerColor = '#C8E6C9'; // pastel green
      break;
    case 'declined':
      containerColor = '#FFCDD2'; // pastel red
      break;
    case 'completed':
      containerColor = '#D1C4E9'; // pastel purple
      break;
    default:
      containerColor = '#FFF';
  }

  // Example: 
  // "If the user is the 'seller' (deal.proposerId === currentUserId) show Generate QR
  //  if the user is the 'buyer' (deal.recipientId === currentUserId) show Scan QR"

  const isSeller = deal.proposerId === currentUserId;
  const isBuyer = deal.recipientId === currentUserId;

  return (
    <View style={[styles.container, { backgroundColor: containerColor }]}>
      <Text style={styles.headerTitle}>Trade Overview</Text>

      {/* Items row */}
      <View style={styles.itemsCard}>
        <View style={styles.itemsRow}>
          {/* Listing A */}
          <View style={styles.itemColumn}>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {deal.listingA?.title || 'Item A'}
            </Text>
            <Image
              source={{ uri: deal.listingA?.ImageUrl }}
              style={styles.itemImage}
            />
          </View>

          {/* Middle area */}
          <View style={styles.middleContainer}>
            <Ionicons name="swap-horizontal" size={28} color="#333" />
            {cashLabel && <Text style={styles.cashLabel}>{cashLabel}</Text>}
          </View>

          {/* Listing B */}
          <View style={styles.itemColumn}>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {deal.listingB?.title || 'Item B'}
            </Text>
            <Image
              source={{ uri: deal.listingB?.ImageUrl }}
              style={styles.itemImage}
            />
          </View>
        </View>
      </View>

      {/* Additional info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>
          Pickup Time:{' '}
          <Text style={styles.infoValue}>{deal.pickupTime || 'Not set'}</Text>
        </Text>

        {deal.note && (
          <Text style={styles.noteText}>
            Note: “{deal.note}”
          </Text>
        )}

        <Text style={[styles.statusText, styles.bold]}>
          Status: <Text style={styles.statusValue}>{deal.status}</Text>
        </Text>
      </View>

      {/* If “pending” => Accept/Decline */}
      {deal.status === 'pending' && (
        <View style={styles.actionRow}>
          {/* Accept button (only for the recipient) */}
          {isBuyer && (
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={handleAccept}
            >
              <Ionicons name="checkmark" size={18} color="#FFF" style={{ marginRight: 4 }} />
              <Text style={styles.actionButtonText}>Accept</Text>
            </TouchableOpacity>
          )}

          {/* Decline button (also for the recipient?) */}
          {isBuyer && (
            <TouchableOpacity
              style={[styles.actionButton, styles.declineButton]}
              onPress={handleDecline}
            >
              <Ionicons name="close" size={18} color="#FFF" style={{ marginRight: 4 }} />
              <Text style={styles.actionButtonText}>Decline</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* If “accepted” => Mark Completed or Payment CTA */}
      {deal.status === 'accepted' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={handleComplete}
          >
            <Ionicons name="checkmark-done" size={18} color="#FFF" style={{ marginRight: 4 }} />
            <Text style={styles.actionButtonText}>Mark Completed</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Chat Button */}
      <TouchableOpacity style={styles.chatButton} onPress={handleOpenChat}>
        <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFF" style={{ marginRight: 6 }} />
        <Text style={styles.chatButtonText}>Open Chat</Text>
      </TouchableOpacity>

      {/* Generate or Scan QR Section */}
      {deal.status === 'accepted' && (
        <View style={styles.qrRow}>
          {/* If I'm the seller => "Generate QR" */}
          {isSeller && (
            <TouchableOpacity
              style={[styles.qrButton, { backgroundColor: '#9C27B0' }]}
              onPress={() => {
                setQRValue(deal.confirmationCode || deal.id);
                setShowQR(true);
              }}
            >
              <Ionicons name="qr-code-outline" size={18} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.qrButtonText}>Show QR</Text>
            </TouchableOpacity>
          )}

          {/* If I'm the buyer => "Scan QR" */}
          {isBuyer && (
            <TouchableOpacity
              style={[styles.qrButton, { backgroundColor: '#4CAF50' }]}
              onPress={handleScanQR}
            >
              <Ionicons name="camera-outline" size={18} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.qrButtonText}>Scan QR</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* QR Modal (only shown if "Show QR" button pressed) */}
      <Modal visible={showQR} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          {/* Clickable background to close */}
          <TouchableOpacity
            style={styles.modalBg}
            onPress={() => setShowQR(false)}
            activeOpacity={1}
          />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Scan this code to confirm exchange</Text>
            <QRCodeSVG value={qrValue} size={200} />
            <Text style={styles.modalSubtitle}>Deal Code: {qrValue}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowQR(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* -------- STYLES -------- */
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  itemsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 16,
  },
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemColumn: {
    alignItems: 'center',
    width: 90,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  middleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cashLabel: {
    marginTop: 4,
    backgroundColor: '#eee',
    borderRadius: 6,
    paddingHorizontal: 6,
    color: '#333',
    fontWeight: '600',
    fontSize: 12,
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  infoValue: {
    fontWeight: '400',
    color: '#444',
  },
  noteText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  statusValue: {
    color: '#333',
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  completeButton: {
    backgroundColor: '#FF9800',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  chatButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#E91E63',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 12,
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  // The row that contains "Show QR" / "Scan QR"
  qrRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 6,
  },
  qrButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#444',
    marginTop: 10,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#999',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
