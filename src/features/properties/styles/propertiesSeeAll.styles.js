import { StyleSheet } from 'react-native';

import { propertyCardHeart, propertyCardShell } from './cardShared';

export const propertiesSeeAllStyles = StyleSheet.create({
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
        marginBottom: 20,
    },

    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 120,
        gap: 20,
    },

    listCard: {
        width: '100%',
        borderRadius: 20,
        ...propertyCardShell,
    },
    listCardImageWrap: {
        position: 'relative',
    },
    listCardImage: {
        width: '100%',
        height: 220,
        backgroundColor: '#ECEFF3',
    },
    listCardBody: {
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEF0F3',
    },
    listHeartBtn: {
        position: 'absolute',
        top: 14,
        right: 14,
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        ...propertyCardHeart,
    },
    paginationDots: {
        position: 'absolute',
        bottom: 14,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.45)',
    },
    dotActive: {
        backgroundColor: '#FFF',
        width: 8,
        height: 8,
        borderRadius: 4,
    },

    listCardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    listCardTitle: {
        flex: 1,
        fontSize: 17,
        fontWeight: '700',
        color: '#000',
        marginRight: 8,
    },
    listCardLocation: {
        fontSize: 14,
        color: '#888',
        marginBottom: 10,
    },
    listCardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    listCardPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#E63946',
    },
    listCardPricePeriod: {
        fontSize: 14,
        fontWeight: '500',
        color: '#888',
    },
    listCardSpecs: {
        fontSize: 13,
        color: '#888',
        fontWeight: '500',
    },
    centerState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyText: {
        fontSize: 15,
        color: '#888',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});
