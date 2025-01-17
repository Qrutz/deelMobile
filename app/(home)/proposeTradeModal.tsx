import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

import { useFetchListing } from '@/hooks/ListingHooks/useFetchListing';
import { useFetchUserListings } from '@/hooks/ListingHooks/useFetchMyListings';

import { Listing } from '@/types';
import DealHeader from '@/components/ProposeDeal/DealHeader';
import ExchangeRow from '@/components/ProposeDeal/ExchangeRow';
import PartialCashInput from '@/components/ProposeDeal/PartialCashInput';
import DealNoteInput from '@/components/ProposeDeal/DealNoteInput';
import ConfirmButton from '@/components/ProposeDeal/ConfirmButton';
import SingleItemSelectorModal from '@/components/ProposeDeal/SingleItemSelectorModal';
import PickupDateInput from '@/components/ProposeDeal/PickupDateInput';

export default function DealBuilderScreen() {
    const { listingId, recipientId } = useLocalSearchParams();
    const router = useRouter();
    const { getToken } = useAuth();

    // 1) Fetch target listing
    const { data: targetListing, isLoading: loadingTarget } = useFetchListing(listingId as string);

    // 2) Fetch user’s items
    const { data: userItems, isLoading: loadingUserItems } = useFetchUserListings();

    // Local state
    const [selectedItem, setSelectedItem] = useState<Listing | null>(null);
    const [partialCash, setPartialCash] = useState('');
    const [note, setNote] = useState('');
    const [showItemModal, setShowItemModal] = useState(false);
    const [pickupDate, setPickupDate] = useState<Date | null>(null); // new date state


    // Single item selection
    const handleSelectItem = (item: Listing) => {
        setSelectedItem(item);
        setShowItemModal(false);
    };

    // Confirm the deal
    const handleSendDeal = async () => {
        if (!listingId || !recipientId) {
            Alert.alert('Error', 'Missing listingId or recipientId.');
            return;
        }
        const hasItem = !!selectedItem;
        const hasCash = partialCash && Number(partialCash) > 0;
        if (!hasItem && !hasCash) {
            Alert.alert('Error', 'Select an item or add partial cash.');
            return;
        }

        try {
            const token = await getToken();
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/swap`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    listingAId: selectedItem?.id,
                    listingBId: Number(listingId),
                    recipientId,
                    partialCash: Number(partialCash) || 0,
                    pickupTime: pickupDate,
                    note,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                Alert.alert('Deal failed', errorData?.error || 'Unknown error');
                return;
            }
            Alert.alert('Success', 'Your deal has been proposed!');
            router.back();
        } catch (error) {
            console.error('Error proposing deal:', error);
            Alert.alert('Failed to propose. Please try again later.');
        }
    };

    // Loading states
    if (loadingTarget || loadingUserItems) {
        return (
            <View style={styles.centered}>
                <Text>Loading listing & your items...</Text>
            </View>
        );
    }

    if (!targetListing) {
        return (
            <View style={styles.centered}>
                <Text>Could not find the listing you’re aiming for.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}  >
            {/* Possibly a translucent status bar at the top */}
            < ScrollView contentContainerStyle={styles.scrollContent} >
                {/* Top header */}
                < DealHeader title="Propose a deal" onClose={() => router.back()} />

                {/* 1) A "deal card" container to hold the items, partial cash, and note */}
                <View style={styles.dealContainer}>
                    {/* Exchange Row (the big images) */}
                    <ExchangeRow
                        selectedItem={selectedItem}
                        targetListing={targetListing}
                        setSelectedItem={setSelectedItem}
                        onPressChangeItem={() => setShowItemModal(true)}
                    />



                    {/* Partial Cash + Note in the same "deal" container */}
                    <PartialCashInput partialCash={partialCash} onChangeCash={setPartialCash} />
                    {/* A line or divider if you want */}

                </View>
                <View style={styles.divider} />



                {/* 3) Pickup Date Input (NEW) */}
                <PickupDateInput pickupDate={pickupDate} onChangeDate={setPickupDate} />


                <DealNoteInput note={note} onChangeNote={setNote} />


                {/* Confirm Button */}



            </ScrollView >
            <ConfirmButton label="Confirm Exchange" onPress={handleSendDeal}>
                {/* You could place a custom icon here if you want */}
            </ConfirmButton>


            {/* Single item selection modal */}
            < SingleItemSelectorModal
                visible={showItemModal}
                userItems={userItems || []}
                selectedItem={selectedItem}
                onSelectItem={handleSelectItem}
                onClose={() => setShowItemModal(false)}
            />
        </SafeAreaView >
    );
}

/* ------------------- STYLES ------------------- */


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    dealContainer: {
        borderRadius: 12,


        marginTop: 12,
        // optional shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 12,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickupContainer: {
        marginTop: 12,
        marginBottom: 12,
    },
    pickupLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    pickupRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pickupInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        color: '#333',
    },
    calendarButton: {
        backgroundColor: '#9C27B0',
        borderRadius: 8,
        padding: 10,
    },
});
