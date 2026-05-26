import { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    ScrollView,
} from 'react-native';

import QueryRefreshControl from '../../../components/QueryRefreshControl';
import SplashScreen from '../../../components/SplashScreen';
import ScreenShell from '../../../components/ScreenShell';
import Sidebar from '../../../components/Sidebar';
import AppTopHeader from '../../../components/AppTopHeader';
import { useCompanyNameQuery } from '../../../hooks/useCompanyNameQuery';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useSidebar } from '../../../hooks/useSidebar';
import { useInterFontFromCdn } from '../../../hooks/useInterFontFromCdn';
import { getApiErrorMessage } from '../../../utils/getApiErrorMessage';
import { PROPERTIES_SCREEN_BG } from '../../properties/constants/propertyListFilters';
import { useTypesQuery } from '../queries/typesQueries';
import {
    filterTypesByCategory,
    formatTypeCategoryLabel,
    pickDefaultCategorySlug,
} from '../utils/typeListUtils';
import { typesListStyles as styles } from '../styles/typesList.styles';

function TypeCard({ item }) {
    const typeLabel = formatTypeCategoryLabel(item.type);

    return (
        <View style={styles.card}>
            <View style={styles.cardTopRow}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.name}
                </Text>
                <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>{typeLabel}</Text>
                </View>
            </View>
            <Text style={styles.cardMeta}>ID · {item.id}</Text>
            {item.slug ? <Text style={styles.cardMeta}>Slug · {item.slug}</Text> : null}
            {item.parentId ? <Text style={styles.cardMeta}>Parent · {item.parentId}</Text> : null}
            {item.description ? (
                <Text style={styles.cardDescription} numberOfLines={3}>
                    {item.description}
                </Text>
            ) : null}
        </View>
    );
}

function CategoryTabs({ categories, activeSlug, onChange }) {
    if (!categories.length) {
        return null;
    }

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            style={styles.tabsScroll}
            contentContainerStyle={styles.tabsRow}
        >
            {categories.map((category) => {
                const isActive = activeSlug === category.slug;

                return (
                    <TouchableOpacity
                        key={category.id}
                        style={[styles.tab, isActive && styles.tabActive]}
                        onPress={() => onChange(category.slug)}
                        activeOpacity={0.85}
                    >
                        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                            {category.label}
                        </Text>
                        <Text style={[styles.tabCount, isActive && styles.tabCountActive]}>
                            {category.count}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

export default function TypesListScreen() {
    const fontsLoaded = useInterFontFromCdn();
    const { isAuthenticated } = useRequireAuth();
    const { types, categories, total, isPending, isRefetching, error, refetch } =
        useTypesQuery(isAuthenticated);
    const { companyName } = useCompanyNameQuery(isAuthenticated);
    const { isSidebarVisible, slideAnim, fadeAnim, openMenu, closeMenu, onSidebarNavigate } =
        useSidebar('Types');

    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        if (!categories.length) {
            return;
        }

        setActiveCategory((current) => {
            if (current && categories.some((tab) => tab.slug === current)) {
                return current;
            }
            return pickDefaultCategorySlug(categories);
        });
    }, [categories]);

    const filteredTypes = useMemo(
        () => filterTypesByCategory(types, activeCategory),
        [types, activeCategory]
    );

    const activeLabel = activeCategory ? formatTypeCategoryLabel(activeCategory) : 'Types';

    const subtitle =
        filteredTypes.length === 1
            ? `1 ${activeLabel.toLowerCase()} type`
            : `${filteredTypes.length} ${activeLabel.toLowerCase()} types · ${total} total loaded`;

    const errorMessage = error ? getApiErrorMessage(error, 'Failed to load types.') : null;

    if (!isAuthenticated) {
        return null;
    }

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#111" />
            </View>
        );
    }

    if (isPending) {
        return <SplashScreen waiting={isPending} onFinish={() => {}} />;
    }

    if (errorMessage) {
        return (
            <ScreenShell backgroundColor={PROPERTIES_SCREEN_BG}>
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
        <ScreenShell backgroundColor={PROPERTIES_SCREEN_BG}>
            <AppTopHeader companyName={companyName} onMenuPress={openMenu} />

            <FlatList
                style={styles.list}
                data={filteredTypes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TypeCard item={item} />}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <View style={styles.headerTextBlock}>
                            <Text style={styles.screenTitle}>Types</Text>
                            <Text style={styles.screenSubtitle}>{subtitle}</Text>
                        </View>
                        <CategoryTabs
                            categories={categories}
                            activeSlug={activeCategory}
                            onChange={setActiveCategory}
                        />
                    </View>
                }
                contentContainerStyle={[
                    styles.listContent,
                    filteredTypes.length === 0 && styles.listContentEmpty,
                ]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <QueryRefreshControl refetch={refetch} isRefetching={isRefetching} />
                }
                ListEmptyComponent={
                    <View style={styles.centerState}>
                        <Text style={styles.emptyText}>
                            {categories.length === 0
                                ? 'No types found.'
                                : `No types in the ${activeLabel} category.`}
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
                activeItem="Types"
            />
        </ScreenShell>
    );
}
