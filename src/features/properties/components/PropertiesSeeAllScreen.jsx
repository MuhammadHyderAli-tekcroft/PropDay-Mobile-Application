import { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import QueryRefreshControl from '../../../components/QueryRefreshControl';
import { useLocalSearchParams } from 'expo-router';

import ScreenShell from '../../../components/ScreenShell';
import Sidebar from '../../../components/Sidebar';
import AppTopHeader from '../../../components/AppTopHeader';
import { useCompanyNameQuery } from '../../../hooks/useCompanyNameQuery';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useSidebar } from '../../../hooks/useSidebar';
import { filterByActiveOption } from '../../../utils/filterByActiveOption';
import { PROPERTY_SECTIONS, PROPERTY_SECTION_TITLES } from '../constants/propertySections';
import { useListingsQuery } from '../queries/listingsQueries';
import PropertyListCard from './PropertyListCard';
import { propertiesSeeAllStyles as styles } from '../styles/propertiesSeeAll.styles';

export default function PropertiesSeeAllScreen() {
    const { section } = useLocalSearchParams();
    const sectionKey = Array.isArray(section) ? section[0] : section;
    const isNearby = sectionKey === PROPERTY_SECTIONS.NEARBY;

    const { isAuthenticated } = useRequireAuth();
    const { recommended, nearby, categories, isPending, isRefetching, refetch } =
        useListingsQuery(isAuthenticated);
    const { companyName } = useCompanyNameQuery(isAuthenticated);
    const { isSidebarVisible, slideAnim, fadeAnim, openMenu, closeMenu, onSidebarNavigate } =
        useSidebar('Properties');

    const [activeCategory, setActiveCategory] = useState('All');

    const pageTitle =
        PROPERTY_SECTION_TITLES[sectionKey] ??
        (isNearby
            ? PROPERTY_SECTION_TITLES[PROPERTY_SECTIONS.NEARBY]
            : PROPERTY_SECTION_TITLES[PROPERTY_SECTIONS.RECOMMENDED]);

    const sourceList = isNearby ? nearby : recommended;

    const filteredProperties = useMemo(
        () => filterByActiveOption(sourceList, activeCategory, (item) => item.propertyType),
        [sourceList, activeCategory]
    );

    if (!isAuthenticated) {
        return null;
    }

    return (
        <ScreenShell>
            <AppTopHeader companyName={companyName} onMenuPress={openMenu} />

            {categories.length > 0 ? (
                <View style={styles.pillsSection}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        nestedScrollEnabled
                        contentContainerStyle={styles.pillRow}
                    >
                        {categories.map((cat) => {
                            const isActive = activeCategory === cat.name;
                            return (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[styles.pill, isActive && styles.pillActive]}
                                    onPress={() => setActiveCategory(cat.name)}
                                    activeOpacity={0.85}
                                >
                                    <Text
                                        style={[styles.pillText, isActive && styles.pillTextActive]}
                                        numberOfLines={1}
                                    >
                                        {cat.name === 'All' ? 'All Spaces' : cat.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            ) : null}

            <Text style={styles.pageTitle}>{pageTitle}</Text>

            <FlatList
                style={styles.list}
                data={filteredProperties}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PropertyListCard item={item} />}
                contentContainerStyle={[
                    styles.listContent,
                    filteredProperties.length === 0 && styles.listContentEmpty,
                ]}
                showsVerticalScrollIndicator={false}
                refreshControl={<QueryRefreshControl refetch={refetch} isRefetching={isRefetching} />}
                ListEmptyComponent={
                    <View style={styles.centerState}>
                        <Text style={styles.emptyText}>
                            {isPending ? 'Loading properties…' : 'No properties found.'}
                        </Text>
                    </View>
                }
            />
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
