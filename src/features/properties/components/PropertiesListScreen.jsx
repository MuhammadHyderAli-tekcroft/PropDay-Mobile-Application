import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import SplashScreen from '../../../components/SplashScreen';
import ScreenShell from '../../../components/ScreenShell';
import Sidebar from '../../../components/Sidebar';
import AppTopHeader from '../../../components/AppTopHeader';
import PropertyCardLarge from './PropertyCardLarge';
import PropertyCardSmall from './PropertyCardSmall';
import { useListings } from '../hooks/useListings';
import { useCompanyName } from '../../../hooks/useCompanyName';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useSidebar } from '../../../hooks/useSidebar';
import { PROPERTY_SECTIONS } from '../constants/propertySections';
import { filterByActiveOption } from '../../../utils/filterByActiveOption';
import { propertiesStyles as styles } from '../styles/properties.styles';

export default function PropertiesListScreen() {
    const router = useRouter();
    const { isAuthenticated } = useRequireAuth();
    const { listings, categories, loading, error, refetch } = useListings(isAuthenticated);
    const { companyName } = useCompanyName(isAuthenticated);
    const { isSidebarVisible, slideAnim, fadeAnim, openMenu, closeMenu, onSidebarNavigate } =
        useSidebar('Properties');

    const [activeCategory, setActiveCategory] = useState('All');
    const [splashDone, setSplashDone] = useState(false);

    const filteredProperties = useMemo(
        () => filterByActiveOption(listings, activeCategory, (item) => item.propertyType),
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
            <ScreenShell>
                <View style={styles.centerState}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={handleRefetch}>
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </ScreenShell>
        );
    }

    return (
        <ScreenShell>
            <AppTopHeader companyName={companyName} onMenuPress={openMenu} />

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
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: '/properties/see-all',
                                    params: { section: PROPERTY_SECTIONS.RECOMMENDED },
                                })
                            }
                        >
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
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: '/properties/see-all',
                                    params: { section: PROPERTY_SECTIONS.NEARBY },
                                })
                            }
                        >
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

            <Sidebar
                isVisible={isSidebarVisible}
                slideAnim={slideAnim}
                fadeAnim={fadeAnim}
                closeMenu={closeMenu}
                onNavigate={onSidebarNavigate}
                activeItem="Properties"
            />
        </ScreenShell>
    );
}
