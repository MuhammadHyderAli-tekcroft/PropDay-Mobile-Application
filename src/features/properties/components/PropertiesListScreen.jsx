import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import SplashScreen from '../../../components/SplashScreen';
import ScreenShell from '../../../components/ScreenShell';
import Sidebar from '../../../components/Sidebar';
import AppTopHeader from '../../../components/AppTopHeader';
import { useCompanyNameQuery } from '../../../hooks/useCompanyNameQuery';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useSidebar } from '../../../hooks/useSidebar';
import { getApiErrorMessage } from '../../../utils/getApiErrorMessage';
import { filterByActiveOption } from '../../../utils/filterByActiveOption';
import { PROPERTY_SECTIONS } from '../constants/propertySections';
import { useListingsQuery } from '../queries/useListingsQuery';
import PropertyCardLarge from './PropertyCardLarge';
import PropertyCardSmall from './PropertyCardSmall';
import { propertiesStyles as styles } from '../styles/properties.styles';

export default function PropertiesListScreen() {
    const router = useRouter();
    const { isAuthenticated } = useRequireAuth();
    const { listings, recommended, nearby, categories, isPending, error, refetch } =
        useListingsQuery(isAuthenticated);
    const { companyName } = useCompanyNameQuery(isAuthenticated);
    const { isSidebarVisible, slideAnim, fadeAnim, openMenu, closeMenu, onSidebarNavigate } =
        useSidebar('Properties');

    const [activeCategory, setActiveCategory] = useState('All');

    const filteredRecommended = useMemo(
        () => filterByActiveOption(recommended, activeCategory, (item) => item.propertyType),
        [recommended, activeCategory]
    );

    const filteredNearby = useMemo(
        () => filterByActiveOption(nearby, activeCategory, (item) => item.propertyType),
        [nearby, activeCategory]
    );

    const errorMessage = error ? getApiErrorMessage(error, 'Failed to load properties.') : null;

    if (!isAuthenticated) {
        return null;
    }

    if (isPending) {
        return <SplashScreen waiting={isPending} onFinish={() => {}} />;
    }

    if (errorMessage) {
        return (
            <ScreenShell>
                <View style={styles.centerState}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
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

                {filteredRecommended.length === 0 ? (
                    <Text style={[styles.emptyText, { marginBottom: 24 }]}>No properties found.</Text>
                ) : (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalList}
                    >
                        {filteredRecommended.map((item) => (
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
                    {filteredNearby.length === 0 ? (
                        <Text style={styles.emptyText}>No properties found.</Text>
                    ) : (
                        filteredNearby.map((item) => (
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
