import { Platform, StyleSheet } from 'react-native';

import { INTER_FONT } from '../../../theme/interFontCdn';
import { PROPERTIES_SCREEN_BG } from '../../properties/constants/propertyListFilters';

const TYPES_SCREEN_BG = PROPERTIES_SCREEN_BG;

export const typesListStyles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: TYPES_SCREEN_BG,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 32,
        flexGrow: 1,
    },
    listContentEmpty: {
        flexGrow: 1,
    },
    header: {
        paddingTop: 4,
        paddingBottom: 8,
    },
    headerTextBlock: {
        paddingHorizontal: 20,
    },
    screenTitle: {
        fontSize: 22,
        fontFamily: INTER_FONT.bold,
        color: '#111',
        marginBottom: 4,
    },
    screenSubtitle: {
        fontSize: 14,
        fontFamily: INTER_FONT.medium,
        color: '#888',
        marginBottom: 16,
    },
    tabsScroll: {
        marginBottom: 16,
        minHeight: 48,
    },
    tabsRow: {
        paddingHorizontal: 20,
        gap: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        backgroundColor: '#FFF',
        gap: 8,
    },
    tabActive: {
        backgroundColor: '#111',
        borderColor: '#111',
    },
    tabLabel: {
        fontFamily: INTER_FONT.semiBold,
        fontSize: 14,
        color: '#666',
    },
    tabLabelActive: {
        color: '#FFF',
    },
    tabCount: {
        fontFamily: INTER_FONT.bold,
        fontSize: 12,
        color: '#888',
        backgroundColor: '#F0F0EA',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        overflow: 'hidden',
    },
    tabCountActive: {
        color: '#111',
        backgroundColor: '#FFF',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F0EA',
        ...Platform.select({
            android: { elevation: 1 },
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
            },
        }),
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    cardTitle: {
        flex: 1,
        fontFamily: INTER_FONT.bold,
        fontSize: 16,
        color: '#111',
        marginRight: 12,
    },
    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#F0F0EA',
    },
    typeBadgeText: {
        fontFamily: INTER_FONT.bold,
        fontSize: 11,
        color: '#444',
        textTransform: 'capitalize',
    },
    cardMeta: {
        fontFamily: INTER_FONT.medium,
        fontSize: 13,
        color: '#888',
        marginBottom: 4,
    },
    cardDescription: {
        fontFamily: INTER_FONT.regular,
        fontSize: 13,
        color: '#666',
        marginTop: 4,
        lineHeight: 18,
    },
    centerState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 48,
    },
    errorText: {
        fontFamily: INTER_FONT.medium,
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 16,
    },
    emptyText: {
        fontFamily: INTER_FONT.medium,
        fontSize: 15,
        color: '#888',
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#111',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    retryButtonText: {
        fontFamily: INTER_FONT.bold,
        fontSize: 14,
        color: '#FFF',
    },
});
