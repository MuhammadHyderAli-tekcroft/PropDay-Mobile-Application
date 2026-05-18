import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import SplashScreen from '../../../components/SplashScreen';
import Sidebar from '../../../components/Sidebar';
import PropertyCardLarge from './PropertyCardLarge';
import PropertyCardSmall from './PropertyCardSmall';
import { useListings } from '../hooks/useListings';
import { usePropertiesSidebar } from '../hooks/usePropertiesSidebar';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { propertiesStyles as styles } from '../styles/properties.styles';

function filterByCategory(listings, activeCategory) {
    if (!activeCategory) {
        return listings;
    }
    return listings.filter((item) => item.propertyType === activeCategory);
}

export default function PropertiesListScreen() {
    const { isAuthenticated } = useRequireAuth();
    const { listings, categories, loading, error, refetch } = useListings(isAuthenticated);
    const { isSidebarVisible, slideAnim, fadeAnim, openMenu, closeMenu, onSidebarNavigate } =
        usePropertiesSidebar();

    const [activeCategory, setActiveCategory] = useState(null);
    const [splashDone, setSplashDone] = useState(false);

    useEffect(() => {
        if (categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0].name);
        }
    }, [categories, activeCategory]);

    const filteredProperties = useMemo(
        () => filterByCategory(listings, activeCategory),
        [listings, activeCategory]
    );

    const showSplash = loading || !splashDone;

    const handleRefetch = useCallback(() => {
        setSplashDone(false);
        refetch();
    }, [refetch]);

    if (!isAuthenticated) {
        return null;
    }

    if (showSplash) {
        return <SplashScreen waiting={loading} onFinish={() => setSplashDone(true)} />;
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.centerState}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={handleRefetch}>
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.locationLabel}>Location</Text>
                        <TouchableOpacity style={styles.locationSelector} onPress={openMenu}>
                            <Ionicons name="menu" size={20} color="#000" style={{ marginRight: 8 }} />
                            <Ionicons name="location-sharp" size={16} color="#000" />
                            <Text style={styles.locationText}>Lahore, Pakistan</Text>
                            <Ionicons name="chevron-down" size={16} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.iconCircle}>
                            <Ionicons name="notifications-outline" size={20} color="#000" />
                            <View style={styles.notificationDot} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    {categories.length > 0 ? (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoryContainer}
                        >
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={styles.categoryWrap}
                                    onPress={() => setActiveCategory(cat.name)}
                                >
                                    <View
                                        style={[
                                            styles.categoryIconBox,
                                            activeCategory === cat.name && styles.categoryIconBoxActive,
                                        ]}
                                    >
                                        <Ionicons
                                            name={cat.icon}
                                            size={24}
                                            color={activeCategory === cat.name ? '#FFF' : '#000'}
                                        />
                                    </View>
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            activeCategory === cat.name && styles.categoryTextActive,
                                        ]}
                                    >
                                        {cat.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ) : null}

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recommended Property</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    {filteredProperties.length === 0 ? (
                        <Text style={[styles.emptyText, { marginBottom: 24 }]}>No properties found.</Text>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalList}
                        >
                            {filteredProperties.map((item) => (
                                <PropertyCardLarge key={item.id} item={item} />
                            ))}
                        </ScrollView>
                    )}

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Nearby Property</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.verticalList}>
                        {filteredProperties.length === 0 ? (
                            <Text style={styles.emptyText}>No properties found.</Text>
                        ) : (
                            filteredProperties.map((item) => (
                                <PropertyCardSmall key={`nearby-${item.id}`} item={item} />
                            ))
                        )}
                    </View>
                </ScrollView>
            </View>

            <Sidebar
                isVisible={isSidebarVisible}
                slideAnim={slideAnim}
                fadeAnim={fadeAnim}
                closeMenu={closeMenu}
                onNavigate={onSidebarNavigate}
                activeItem="Properties"
            />
        </SafeAreaView>
    );
}
