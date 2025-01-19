import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useFetchSwap } from '@/hooks/SwapHooks/useFetchSwap';
import { useUser } from '@clerk/clerk-expo';

export default function DealDetailScreen() {
  const { dealId } = useLocalSearchParams() as { dealId: string };
  const { data: deal, isLoading, isError } = useFetchSwap(dealId);
  const { user } = useUser();
  const currentUserId = user?.id;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
        <Text style={styles.loadingText}>Loading Deal...</Text>
      </View>
    );
  }

  if (!deal || isError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Failed to load this deal.</Text>
      </View>
    );
  }

  const isSeller = deal.proposerId === currentUserId;
  const isBuyer = deal.recipientId === currentUserId;

  // Basic placeholders for accepting/declining/completing
  const handleAccept = async () => {
    // e.g. call PATCH /swap/:dealId/accept
    Alert.alert('Success', 'Deal accepted (mock).');
  };

  const handleDecline = async () => {
    // e.g. call PATCH /swap/:dealId/decline
    Alert.alert('Success', 'Deal declined (mock).');
  };

  const handleComplete = async () => {
    // e.g. call PATCH /swap/:dealId/complete
    Alert.alert('Success', 'Deal completed (mock).');
  };

  // Open Chat
  const handleOpenChat = () => {
    if (!deal.chatId) {
      Alert.alert('No Chat Linked', 'This deal has no chatId.');
      return;
    }
    router.push(`/chat/${deal.chatId}`);
  };

  // Navigate to the CounterProposal screen
  // We'll pass the current swap's id in the query param `swapId`
  const handleCounter = () => {
    router.push({
      pathname: '/(home)/counterProposal',
      params: { swapId: deal.id }, // or dealId if you keep consistent naming
    });
  };

  // Optionally display partialCash
  const cashLabel = deal.partialCash && deal.partialCash > 0
    ? `+ ${deal.partialCash} kr`
    : null;

  // Color code container
  let containerColor = '#FFF';
  switch (deal.status) {
    case 'pending':
      containerColor = '#FFF9C4'; // pastel yellow
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

  return (
    <View style={[styles.container, { backgroundColor: containerColor }]}>
      <Text style={styles.headerTitle}>Deal Details</Text>

      {/* Items row */}
      <View style={styles.itemsRow}>
        <View style={styles.itemColumn}>
          <Text style={styles.itemTitle}>{deal.listingA?.title || 'Item A'}</Text>
          <Image
            source={{ uri: deal.listingA?.ImageUrl }}
            style={styles.itemImage}
          />
        </View>

        <View style={styles.swapContainer}>
          <Ionicons name="swap-horizontal" size={26} color="#333" />
          {cashLabel && (
            <Text style={styles.cashLabel}>{cashLabel}</Text>
          )}
        </View>

        <View style={styles.itemColumn}>
          <Text style={styles.itemTitle}>{deal.listingB?.title || 'Item B'}</Text>
          <Image
            source={{ uri: deal.listingB?.ImageUrl }}
            style={styles.itemImage}
          />
        </View>
      </View>

      {/* Info box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>
          Pickup Time: <Text style={styles.infoValue}>{deal.pickupTime || 'Not Set'}</Text>
        </Text>
        {deal.note && (
          <Text style={styles.noteText}>Note: “{deal.note}”</Text>
        )}
        <Text style={styles.infoLabel}>
          Status: <Text style={styles.infoValue}>{deal.status}</Text>
        </Text>
      </View>

      {/* Action Buttons Based on Status & Role */}
      {deal.status === 'pending' && isBuyer && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={handleAccept}
          >
            <Text style={styles.actionButtonText}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            onPress={handleDecline}
          >
            <Text style={styles.actionButtonText}>Decline</Text>
          </TouchableOpacity>

          {/* The new "Counter" button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.counterButton]}
            onPress={handleCounter}
          >
            <Ionicons name="create-outline" size={18} color="#FFF" style={{ marginRight: 4 }} />
            <Text style={styles.actionButtonText}>Counter</Text>
          </TouchableOpacity>
        </View>
      )}

      {deal.status === 'accepted' && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={handleComplete}
          >
            <Text style={styles.actionButtonText}>Mark Completed</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Chat Button if chatId exists */}
      {deal.chatId && (
        <TouchableOpacity style={styles.chatButton} onPress={handleOpenChat}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.chatButtonText}>Open Chat</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Minimal styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
  },
  errorText: {
    color: '#999',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    color: '#333',
  },
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  itemColumn: {
    alignItems: 'center',
    width: 100,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  itemImage: {
    width: 70,
    height: 70,
    backgroundColor: '#EEE',
    borderRadius: 8,
  },
  swapContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cashLabel: {
    marginTop: 2,
    backgroundColor: '#FFF',
    paddingHorizontal: 6,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
    overflow: 'hidden',
  },
  infoBox: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    // small shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  infoValue: {
    fontWeight: '400',
    color: '#555',
  },
  noteText: {
    fontStyle: 'italic',
    color: '#777',
    marginBottom: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  counterButton: {
    backgroundColor: '#9C27B0',
  },
  completeButton: {
    backgroundColor: '#FF9800',
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E91E63',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'center',
    marginTop: 12,
  },
  chatButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
