import { StyleSheet } from 'react-native';

import { propertyCardShell } from '../../properties/styles/cardShared';

export const contactsStyles = StyleSheet.create({
    pillsSection: {
        minHeight: 52,
        marginBottom: 8,
    },
    pillRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 6,
        gap: 10,
    },
    pill: {
        paddingHorizontal: 18,
        paddingVertical: 12,
        minHeight: 44,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pillActive: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    pillText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        lineHeight: 20,
        includeFontPadding: false,
        textAlignVertical: 'center',
    },
    pillTextActive: {
        color: '#FFF',
    },

    pageTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#000',
        paddingHorizontal: 20,
        marginBottom: 6,
    },
    pageSubtitle: {
        fontSize: 14,
        color: '#888',
        fontWeight: '500',
        paddingHorizontal: 20,
        marginBottom: 20,
    },

    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 120,
        gap: 16,
    },

    card: {
        flexDirection: 'row',
        borderRadius: 18,
        padding: 14,
        ...propertyCardShell,
    },
    avatarWrap: {
        marginRight: 14,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    cardBody: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 2,
    },
    typeBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        marginBottom: 6,
    },
    typeBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    detailText: {
        fontSize: 13,
        color: '#6B7280',
        marginLeft: 6,
        flex: 1,
    },

    centerState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        fontSize: 15,
        color: '#E63946',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#000',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    retryButtonText: {
        color: '#FFF',
        fontWeight: '700',
    },
    emptyText: {
        fontSize: 15,
        color: '#888',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});
