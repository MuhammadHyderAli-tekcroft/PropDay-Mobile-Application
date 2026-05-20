import { useCallback, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';

import SplashScreen from '../../../components/SplashScreen';
import ScreenShell from '../../../components/ScreenShell';
import Sidebar from '../../../components/Sidebar';
import AppTopHeader from '../../../components/AppTopHeader';
import ContactCard from './ContactCard';
import { useContacts } from '../hooks/useContacts';
import { useCompanyName } from '../../../hooks/useCompanyName';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useSidebar } from '../../../hooks/useSidebar';
import { filterByActiveOption } from '../../../utils/filterByActiveOption';
import { contactsStyles as styles } from '../styles/contacts.styles';

export default function ContactsListScreen() {
    const { isAuthenticated } = useRequireAuth();
    const { contacts, types, total, loading, error, refetch } = useContacts(isAuthenticated);
    const { companyName } = useCompanyName(isAuthenticated);
    const { isSidebarVisible, slideAnim, fadeAnim, openMenu, closeMenu, onSidebarNavigate } =
        useSidebar('Contacts');

    const [activeType, setActiveType] = useState('All');
    const [splashDone, setSplashDone] = useState(false);

    const filteredContacts = useMemo(
        () => filterByActiveOption(contacts, activeType, (contact) => contact.type),
        [contacts, activeType]
    );

    const showSplash = loading || !splashDone;

    const handleRefetch = useCallback(() => {
        setSplashDone(false);
        refetch();
    }, [refetch]);

    const subtitle =
        filteredContacts.length === 1
            ? '1 contact'
            : `${filteredContacts.length} contacts`;

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

            {types.length > 1 ? (
                <View style={styles.pillsSection}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        nestedScrollEnabled
                        contentContainerStyle={styles.pillRow}
                    >
                        {types.map((typeItem) => {
                            const isActive = activeType === typeItem.name;
                            return (
                                <TouchableOpacity
                                    key={typeItem.id}
                                    style={[styles.pill, isActive && styles.pillActive]}
                                    onPress={() => setActiveType(typeItem.name)}
                                    activeOpacity={0.85}
                                >
                                    <Text
                                        style={[styles.pillText, isActive && styles.pillTextActive]}
                                        numberOfLines={1}
                                    >
                                        {typeItem.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            ) : null}

            <Text style={styles.pageTitle}>Contacts</Text>
            <Text style={styles.pageSubtitle}>
                {activeType === 'All' ? `${total} total` : subtitle}
            </Text>

            {filteredContacts.length === 0 ? (
                <View style={styles.centerState}>
                    <Text style={styles.emptyText}>No contacts found.</Text>
                </View>
            ) : (
                <FlatList
                    style={styles.list}
                    data={filteredContacts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ContactCard item={item} />}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <Sidebar
                isVisible={isSidebarVisible}
                slideAnim={slideAnim}
                fadeAnim={fadeAnim}
                closeMenu={closeMenu}
                onNavigate={onSidebarNavigate}
                activeItem="Contacts"
            />
        </ScreenShell>
    );
}
