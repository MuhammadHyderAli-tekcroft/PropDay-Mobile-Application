import { View, Text, TouchableOpacity, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { propertiesStyles as styles } from '../styles/properties.styles';

export default function PropertyCardSmall({ item, onPress }) {
    const Wrapper = onPress ? TouchableOpacity : View;

    return (
        <Wrapper style={styles.cardSmall} onPress={onPress} activeOpacity={onPress ? 0.85 : 1}>
            <View style={styles.cardImageContainerSmall}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.cardImageSmall} />
                ) : (
                    <View style={styles.cardImageSmall} />
                )}
                <TouchableOpacity style={styles.heartButtonSmall}>
                    <Ionicons name="heart-outline" size={14} color="#000" />
                </TouchableOpacity>
            </View>
            <View style={styles.cardSmallContent}>
                <Text style={styles.tagTextSmallBox}>{item.propertyType}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.cardLocationRow}>
                    <Ionicons name="location-outline" size={12} color="#888" />
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
