import { View, Text, TouchableOpacity, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { propertiesStyles as styles } from '../styles/properties.styles';

export default function PropertyCardLarge({ item, onPress }) {
    const Wrapper = onPress ? TouchableOpacity : View;

    return (
        <Wrapper style={styles.cardLarge} onPress={onPress} activeOpacity={onPress ? 0.85 : 1}>
            <View style={styles.cardImageContainer}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.cardImageLarge} />
                ) : (
                    <View style={styles.cardImageLarge} />
                )}
                <TouchableOpacity style={styles.heartButton} activeOpacity={0.85}>
                    <Ionicons name="heart-outline" size={18} color="#111827" />
                </TouchableOpacity>
                <View style={styles.tagSmall}>
                    <Text style={styles.tagTextSmall}>{item.propertyType}</Text>
                </View>
            </View>
            <View style={styles.cardLargeBody}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <View style={styles.cardLocationRow}>
                    <Ionicons name="location-outline" size={13} color="#6B7280" />
                    <Text style={styles.cardLocationText} numberOfLines={1}>
                        {item.location}
                    </Text>
                </View>
                <Text style={styles.cardPrice}>
                    {item.price}
                    {item.price !== 'Price on request' ? (
                        <Text style={styles.cardPricePeriod}> /Month</Text>
                    ) : null}
                </Text>
            </View>
        </Wrapper>
    );
}
