import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';

const { width, height } = Dimensions.get('window');

export default function Marketplace() {
    const [filterMode, setFilterMode] = useState<'proximity' | 'category'>('proximity');
    const [search, setSearch] = useState('');

    const toggleFilterMode = () => {
        setFilterMode(filterMode === 'proximity' ? 'category' : 'proximity');
    };

    const dummyProducts = [
        { id: '1', name: 'Atomic Ski boots', price: '$32', size: '7', color: 'Black', image: 'https://via.placeholder.com/150' },
        { id: '2', name: 'Snowboard Jacket', price: '$50', size: 'M', color: 'Red', image: 'https://via.placeholder.com/150' },
        { id: '3', name: 'Winter Gloves', price: '$15', size: 'L', color: 'Blue', image: 'https://via.placeholder.com/150' },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <View>
                    <Text style={styles.headerTitle}>👋 Hi Johan!</Text>
                    <Text style={styles.headerSubtitle}>
                        {filterMode === 'proximity' ? 'Proximity Deals' : 'Category Listings'}
                    </Text>
                </View>
                <TouchableOpacity onPress={toggleFilterMode} style={styles.filterToggle}>
                    <Ionicons name="options-outline" size={16} color="black" />
                    <Text style={styles.filterText}>{filterMode === 'proximity' ? 'Category' : 'Proximity'}</Text>
                </TouchableOpacity>
            </View>

            {filterMode === 'proximity' ? (
                // Proximity View with Swiper
                <View style={styles.swiperContainer}>
                    <Swiper
                        useViewOverflow
                        cards={dummyProducts}
                        renderCard={(product) => (
                            <View style={styles.productCard}>
                                <Image source={{ uri: product.image }} style={styles.productImage} />
                                <Text style={styles.productTitle}>{product.name}</Text>
                                <Text style={styles.productDescription}>Great boots for skiing! Used it once. Too small for me.</Text>
                                <View style={styles.productDetails}>
                                    <Text style={styles.productPrice}>{product.price}</Text>
                                    <Text style={styles.productTag}>{product.size}</Text>
                                    <Text style={styles.productTag}>{product.color}</Text>
                                </View>
                            </View>
                        )}
                        verticalSwipe={true}
                        horizontalSwipe={true}
                        swipeBackCard
                        stackSize={3}
                        cardIndex={0}
                        backgroundColor={'#ffffff'}
                        animateCardOpacity
                        infinite
                        stackSeparation={15}
                        showSecondCard={true} // Enables showing the second card in the stack
                    />
                </View>
            ) : (
                // Category View
                <FlatList
                    data={dummyProducts}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.gridContainer}
                    renderItem={({ item }) => (
                        <View style={styles.gridItem}>
                            <Image source={{ uri: item.image }} style={styles.gridImage} />
                            <Text style={styles.text}>{item.name}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    filterToggle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: 'bold',
    },
    swiperContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productCard: {
        width: width * 0.9,
        height: height * 0.6,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    productImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    productTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    productDescription: {
        fontSize: 14,
        color: '#666',
        marginVertical: 8,
    },
    productDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    productPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    productTag: {
        backgroundColor: '#f3f3f3',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
        fontSize: 12,
        fontWeight: '500',
    },
    gridContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    gridItem: {
        flex: 1,
        margin: 10,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f3f3',
        borderRadius: 10,
    },
    gridImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    }
});
