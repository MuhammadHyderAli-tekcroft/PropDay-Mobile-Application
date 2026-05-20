import { View, Text, TouchableOpacity, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { propertiesSeeAllStyles as styles } from '../styles/propertiesSeeAll.styles';

function ImagePagination({ count = 3, activeIndex = 0 }) {
    const dots = Math.min(Math.max(count, 1), 5);

    return (
        <View style={styles.paginationDots}>
            {Array.from({ length: dots }).map((_, index) => (
                <View
                    key={index}
                    style={[styles.dot, index === activeIndex && styles.dotActive]}
                />
            ))}
        </View>
    );
}

export default function PropertyListCard({ item }) {
    const imageCount = item.images?.length > 0 ? item.images.length : 1;
    const specs =
        item.beds > 0 || item.baths > 0
            ? `${item.beds} Beds • ${item.baths} Baths`
            : null;

    return (
        <View style={styles.listCard}>
            <View style={styles.listCardImageWrap}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.listCardImage} />
                ) : (
                    <View style={styles.listCardImage} />
                )}
                <TouchableOpacity style={styles.listHeartBtn} activeOpacity={0.85}>
                    <Ionicons name="heart-outline" size={20} color="#111827" />
                </TouchableOpacity>
                <ImagePagination count={imageCount} activeIndex={0} />
            </View>

            <View style={styles.listCardBody}>
                <View style={styles.listCardTitleRow}>
                    <Text style={styles.listCardTitle} numberOfLines={2}>
                        {item.title}
                    </Text>
                </View>

                <Text style={styles.listCardLocation} numberOfLines={1}>
                    {item.location}
                </Text>

                <View style={styles.listCardFooter}>
                    <Text style={styles.listCardPrice}>
                        {item.price}
                        {item.price !== 'Price on request' ? (
                            <Text style={styles.listCardPricePeriod}>/mo</Text>
                        ) : null}
                    </Text>
                    {specs ? <Text style={styles.listCardSpecs}>{specs}</Text> : null}
                </View>
            </View>
        </View>
    );
}
