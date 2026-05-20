import { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';

import SplashScreen from '../../../components/SplashScreen';
import ScreenShell from '../../../components/ScreenShell';
import Sidebar from '../../../components/Sidebar';
import AppTopHeader from '../../../components/AppTopHeader';
import { useCompanyNameQuery } from '../../../hooks/useCompanyNameQuery';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useSidebar } from '../../../hooks/useSidebar';
import { getApiErrorMessage } from '../../../utils/getApiErrorMessage';
import { filterByActiveOption } from '../../../utils/filterByActiveOption';
import { useContactsQuery } from '../queries/useContactsQuery';
import ContactCard from './ContactCard';
import { contactsStyles as styles } from '../styles/contacts.styles';

export default function ContactsListScreen() {
    const { isAuthenticated } = useRequireAuth();
    const { contacts, types, total, isPending, error, refetch } = useContactsQuery(isAuthenticated);
    const { companyName } = useCompanyNameQuery(isAuthenticated);
    const { isSidebarVisible, slideAnim, fadeAnim, openMenu, closeMenu, onSidebarNavigate } =
        useSidebar('Contacts');

    const [activeType, setActiveType] = useState('All');

    const filteredContacts = useMemo(
        () => filterByActiveOption(contacts, activeType, (contact) => contact.type),
        [contacts, activeType]
    );

    const errorMessage = error ? getApiErrorMessage(error, 'Failed to load contacts.') : null;

    const subtitle =
        filteredContacts.length === 1
            ? '1 contact'
            : `${filteredContacts.length} contacts`;

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
