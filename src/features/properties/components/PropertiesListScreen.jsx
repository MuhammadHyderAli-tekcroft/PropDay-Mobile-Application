import { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';

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
import { PROPERTIES_SCREEN_BG } from '../constants/propertyListFilters';
import { useListingsQuery } from '../queries/listingsQueries';
import {
    buildSummarySubtitle,
    filterPropertyListings,
} from '../utils/propertyListUtils';
import PropertyListingCard from './PropertyListingCard';
import { ALL_TYPES_LABEL } from '../constants/propertyListFilters';
import PropertiesListHeader from './PropertiesListHeader';
import CreatePropertyWizard from './CreatePropertyWizard';
import { propertiesListStyles as styles } from '../styles/propertiesList.styles';

export default function PropertiesListScreen() {
    const fontsLoaded = useInterFontFromCdn();
    const { isAuthenticated } = useRequireAuth();
    const {
        listings,
        total,
        summary,
        statusFilters,
        typeFilters,
        isPending,
        isRefetching,
        error,
        refetch,
    } = useListingsQuery(isAuthenticated);
    const { companyName } = useCompanyNameQuery(isAuthenticated);
    const { isSidebarVisible, slideAnim, fadeAnim, openMenu, closeMenu, onSidebarNavigate } =
        useSidebar('Properties');

    const [activeStatus, setActiveStatus] = useState('All');
    const [activeType, setActiveType] = useState(ALL_TYPES_LABEL);
    const [isCreatePropertyOpen, setIsCreatePropertyOpen] = useState(false);

    const filteredListings = useMemo(
        () => filterPropertyListings(listings, activeStatus, activeType),
        [listings, activeStatus, activeType]
    );

    const summarySubtitle = useMemo(() => buildSummarySubtitle(summary), [summary]);

    const errorMessage = error ? getApiErrorMessage(error, 'Failed to load properties.') : null;

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
                data={filteredListings}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PropertyListingCard item={item} />}
                ListHeaderComponent={
                    <PropertiesListHeader
                        total={total}
                        summarySubtitle={summarySubtitle}
                        statusFilters={statusFilters}
                        typeFilters={typeFilters}
                        activeStatus={activeStatus}
                        activeType={activeType}
                        onStatusChange={setActiveStatus}
                        onTypeChange={setActiveType}
                        onAddPress={() => setIsCreatePropertyOpen(true)}
                    />
                }
                contentContainerStyle={[
                    styles.listContainer,
                    filteredListings.length === 0 && styles.listContainerEmpty,
                ]}
                showsVerticalScrollIndicator={false}
                refreshControl={<QueryRefreshControl refetch={refetch} isRefetching={isRefetching} />}
                ListEmptyComponent={
                    <View style={styles.centerState}>
                        <Text style={styles.emptyText}>
                            {listings.length > 0
                                ? 'No properties found.'
                                : 'No properties found.'}
                        </Text>
                    </View>
                }
            />

            <CreatePropertyWizard
                visible={isCreatePropertyOpen}
                onClose={() => setIsCreatePropertyOpen(false)}
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
