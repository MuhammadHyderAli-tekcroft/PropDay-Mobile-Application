import { Platform } from 'react-native';
export const propertyCardShell = {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
    ...Platform.select({
        ios: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
        },
        android: {
            elevation: 4,
        },
        default: {},
    }),
};

export const propertyCardHeart = {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.12,
            shadowRadius: 3,
        },
        android: {
            elevation: 2,
        },
        default: {},
    }),
};
