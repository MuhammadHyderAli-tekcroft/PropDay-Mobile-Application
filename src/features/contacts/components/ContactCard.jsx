import { View, Text, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { contactsStyles as styles } from '../styles/contacts.styles';

export default function ContactCard({ item }) {
    return (
        <View style={styles.card}>
            <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                    {item.avatarUrl ? (
                        <Image source={{ uri: item.avatarUrl }} style={styles.avatarImage} />
                    ) : (
                        <Text style={styles.avatarText}>{item.initials}</Text>
                    )}
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>{item.type}</Text>
                </View>
                <Text style={styles.name} numberOfLines={1}>
                    {item.fullName}
                </Text>

                {item.email ? (
                    <View style={styles.detailRow}>
                        <Ionicons name="mail-outline" size={14} color="#9CA3AF" />
                        <Text style={styles.detailText} numberOfLines={1}>
                            {item.email}
                        </Text>
                    </View>
                ) : null}

                {item.phone ? (
                    <View style={styles.detailRow}>
                        <Ionicons name="call-outline" size={14} color="#9CA3AF" />
                        <Text style={styles.detailText} numberOfLines={1}>
                            {item.phone}
                        </Text>
                    </View>
                ) : null}
            </View>
        </View>
    );
}
