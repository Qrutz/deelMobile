import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ProductCard from '@/components/ProductCard';
import { useFetchUserListings } from '@/hooks/useFetchMyListings';

export default function SellerDashboard() {
    const { data, isLoading, isError } = useFetchUserListings();

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (isError) {
        return <Text>Error fetching listings</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Listings</Text>
            <FlatList
                data={data || []}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ProductCard product={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});
