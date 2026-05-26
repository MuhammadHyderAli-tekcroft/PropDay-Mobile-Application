import { View, Text, Image } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { formatSqft } from '../utils/propertyListUtils';
import { propertiesListStyles as styles } from '../styles/propertiesList.styles';

function getStatusStyles(status) {
    if (status === 'Vacant') {
        return {
            badge: styles.statusBadgeVacant,
            dot: styles.statusDotVacant,
            text: styles.statusTextVacant,
        };
    }
    if (status === 'Part') {
        return {
            badge: styles.statusBadgePart,
            dot: styles.statusDotPart,
            text: styles.statusTextPart,
        };
    }
    return { badge: null, dot: null, text: null };
}

function getPropertyTypeLabel(propertyType, license) {
    const label = String(propertyType ?? '').trim();
    if (!label || label === 'Property' || label === 'Home') {
        return null;
    }

    if (license && label.toLowerCase() === String(license).trim().toLowerCase()) {
        return null;
    }

    return label;
}

function SpecDivider() {
    return <View style={styles.specDivider} />;
}

export default function PropertyListingCard({ item }) {
    const isTenanted = item.status === 'Tenanted';
    const statusStyles = getStatusStyles(item.status);
    const sqftLabel = formatSqft(item.sqft);
    const propertyTypeLabel = getPropertyTypeLabel(item.propertyType, item.license);
    const isPriceOnRequest = item.price === 'Price on request';

    const specSegments = [];

    if (item.beds > 0) {
        specSegments.push(
            <View key="beds" style={styles.specItem}>
                <MaterialCommunityIcons name="bed-empty" size={13} color="#9CA3AF" />
                <Text style={styles.specText}>{item.beds}</Text>
            </View>
        );
    }

    if (item.baths > 0) {
        specSegments.push(
            <View key="baths" style={styles.specItem}>
                <MaterialCommunityIcons name="bathtub-outline" size={13} color="#9CA3AF" />
                <Text style={styles.specText}>{item.baths}</Text>
            </View>
        );
    }

    if (sqftLabel || item.baths > 0) {
        specSegments.push(
            <Text key="sqft" style={styles.specText}>
                {sqftLabel} 102 ft²
            </Text>
        );
    }

    return (
        <View style={styles.card}>
            <View style={styles.cardTop}>
                <View style={styles.iconBox}>
                    {item.image ? (
                        <Image source={{ uri: item.image }} style={styles.thumbImage} />
                    ) : (
                        <MaterialCommunityIcons name="office-building" size={22} color="#6B7280" />
                    )}
                </View>

                <View style={styles.cardContent}>
                    <View style={styles.titleRow}>
                        <Text style={styles.propertyTitle} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <View style={[styles.statusBadge, statusStyles.badge]}>
                            <View style={[styles.statusDot, statusStyles.dot]} />
                            <Text style={[styles.statusText, statusStyles.text]} numberOfLines={1}>
                                {item.status}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.locationRow}>
                        <View style={styles.locationLeft}>
                            <Feather name="map-pin" size={11} color="#9CA3AF" />
                            <Text style={styles.locationText} numberOfLines={2}>
                                {item.location}
                            </Text>
                        </View>
                        {propertyTypeLabel || item.license ? (
                            <View style={styles.locationBadgesColumn}>
                                {propertyTypeLabel ? (
                                    <View style={styles.typeBadge}>
                                        <Text style={styles.typeBadgeText} numberOfLines={1}>
                                            {propertyTypeLabel}
                                        </Text>
                                    </View>
                                ) : null}
                                {item.license ? (
                                    <View style={styles.licenseBadge}>
                                        <Text style={styles.licenseText} numberOfLines={1}>
                                            {item.license}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                        ) : null}
                    </View>

                    <View style={styles.specsRow}>
                        <View style={styles.specsLeft}>
                            {specSegments.map((segment, index) => (
                                <View key={index} style={styles.specSegment}>
                                    {index > 0 ? <SpecDivider /> : null}
                                    {segment}
                                </View>
                            ))}
                            {specSegments.length > 0 ? <SpecDivider /> : null}
                        </View>
                        <Text
                            style={[styles.priceText, isPriceOnRequest && styles.priceTextLong]}
                            numberOfLines={1}
                        >
                            {/* {item.price} */}
                            {isPriceOnRequest ? (
                                <Text style={styles.pricePeriod}>2000/mo</Text>
                            ) : null}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardFooter}>
                {isTenanted && item.tenantName ? (
                    <>
                        <View style={styles.tenantRow}>
                            <View style={styles.tenantDot} />
                            <Text style={styles.tenantName} numberOfLines={1}>
                                {item.tenantName}
                            </Text>
                        </View>
                        {item.paidStatus ? (
                            <Text style={styles.paidStatus} numberOfLines={1}>
                                {item.paidStatus}
                            </Text>
                        ) : null}
                    </>
                ) : (
                    <Text style={styles.vacantFooterText}>No active tenancy</Text>
                )}
            </View>
        </View>
    );
}
