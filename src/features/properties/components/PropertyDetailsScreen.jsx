import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import QueryRefreshControl from '../../../components/QueryRefreshControl';
import SplashScreen from '../../../components/SplashScreen';
import ScreenShell from '../../../components/ScreenShell';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { getApiErrorMessage } from '../../../utils/getApiErrorMessage';
import { useListingQuery } from '../queries/listingsQueries';
import { propertiesStyles as styles } from '../styles/properties.styles';

export default function PropertyDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const listingId = Array.isArray(id) ? id[0] : id;
    const { isAuthenticated } = useRequireAuth();
    const { listing, isPending, isRefetching, error, refetch } = useListingQuery(
        listingId,
        isAuthenticated
    );

    const errorMessage = error
        ? getApiErrorMessage(error, 'Failed to load property.')
        : !listingId
          ? 'Property not found.'
          : null;

    if (!isAuthenticated) {
        return null;
    }

    if (!listingId) {
        return (
            <ScreenShell>
                <View style={styles.centerState}>
                    <Text style={styles.errorText}>Property not found.</Text>
                </View>
            </ScreenShell>
        );
    }

    if (isPending) {
        return <SplashScreen waiting={isPending} onFinish={() => {}} />;
    }

    if (errorMessage || !listing) {
        return (
            <ScreenShell>
                <View style={styles.centerState}>
                    <Text style={styles.errorText}>{errorMessage ?? 'Property not found.'}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </ScreenShell>
        );
    }

    const galleryImages =
        listing.images.length > 0 ? listing.images : listing.image ? [listing.image] : [];
    const thumbnails = galleryImages.slice(0, 4);
    const showMoreOverlay = galleryImages.length > 4;
    const moreCount = galleryImages.length - 3;

    return (
        <ScreenShell>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <QueryRefreshControl refetch={refetch} isRefetching={isRefetching} />
                }
            >
                <View style={styles.heroContainer}>
                    {listing.image ? (
                        <Image source={{ uri: listing.image }} style={styles.heroImage} />
                    ) : (
                        <View style={styles.heroImage} />
                    )}
                    <SafeAreaView style={styles.heroNav}>
                        <TouchableOpacity style={styles.circleBtn} onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <View style={styles.heroNavActions}>
                            <TouchableOpacity style={styles.circleBtn}>
                                <Ionicons name="share-social-outline" size={20} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.circleBtn}>
                                <Ionicons name="heart-outline" size={20} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>

                <View style={styles.thumbnailContainer}>
                    {thumbnails.map((uri, index) => {
                        const isLast = index === thumbnails.length - 1 && showMoreOverlay;
                        return (
                            <View key={`${uri}-${index}`} style={styles.thumbnailWrap}>
                                <Image source={{ uri }} style={styles.thumbnail} />
                                {isLast ? (
                                    <View style={styles.thumbnailOverlay}>
                                        <Text style={styles.thumbnailOverlayText}>{moreCount}+</Text>
                                    </View>
                                ) : null}
                            </View>
                        );
                    })}
                </View>

                <View style={styles.detailsBody}>
                    <View style={styles.detailsHeaderRow}>
                        <Text style={styles.tagTextSmallBox}>{listing.propertyType}</Text>
                        <Text style={styles.detailsPrice}>
                            {listing.price}
                            {listing.price !== 'Price on request' ? (
                                <Text style={styles.cardPricePeriod}> /Month</Text>
                            ) : null}
                        </Text>
                    </View>

                    <Text style={styles.detailsTitle}>{listing.title}</Text>
                    <View style={styles.cardLocationRow}>
                        <Ionicons name="location" size={16} color="#888" />
                        <Text style={styles.detailsLocationText}>{listing.location}</Text>
                    </View>

                    <View style={styles.specsContainer}>
                        <View style={styles.specBox}>
                            <Ionicons name="bed-outline" size={20} color="#000" />
                            <Text style={styles.specLabel}>{listing.beds} Bed</Text>
                        </View>
                        <View style={styles.specBox}>
                            <MaterialCommunityIcons name="bathtub-outline" size={20} color="#000" />
                            <Text style={styles.specLabel}>{listing.baths} Bath</Text>
                        </View>
                        <View style={styles.specBox}>
                            <MaterialCommunityIcons name="vector-square" size={20} color="#000" />
                            <Text style={styles.specLabel}>{listing.sqft} Sqft</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitleDetails}>Description</Text>
                    <Text style={styles.descriptionText}>
                        {listing.description ||
                            'A modern, highly professional property featuring top-tier architecture, spacious rooms, and close proximity to major city landmarks. Ideal for corporate leasing.'}{' '}
                        <Text style={styles.readMore}>Read More...</Text>
                    </Text>

                    {listing.broker.name ? (
                        <>
                            <Text style={styles.sectionTitleDetails}>Listing Broker</Text>
                            <View style={styles.brokerContainer}>
                                {listing.broker.image ? (
                                    <Image
                                        source={{ uri: listing.broker.image }}
                                        style={styles.brokerImage}
                                    />
                                ) : (
                                    <View style={styles.brokerImage} />
                                )}
                                <View style={styles.brokerInfo}>
                                    <Text style={styles.brokerName}>{listing.broker.name}</Text>
                                    {listing.broker.phone ? (
                                        <Text style={styles.brokerPhone}>{listing.broker.phone}</Text>
                                    ) : null}
                                </View>
                                <View style={styles.brokerActions}>
                                    <TouchableOpacity style={styles.actionCircle}>
                                        <Ionicons name="chatbubble-outline" size={18} color="#FFF" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.actionCircle}>
                                        <Ionicons name="call-outline" size={18} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    ) : null}
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </ScreenShell>
    );
}
