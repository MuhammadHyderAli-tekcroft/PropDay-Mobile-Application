import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { propertiesListStyles as styles } from '../styles/propertiesList.styles';

export default function PropertiesListHeader({
    total,
    summarySubtitle,
    statusFilters,
    typeFilters,
    activeStatus,
    activeType,
    onStatusChange,
    onTypeChange,
    onAddPress,
}) {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.topBar}>
                <Text style={styles.screenTitle}>Properties</Text>
                <View style={styles.topBarActions}>
                    <TouchableOpacity
                        style={styles.actionBtnLight}
                        activeOpacity={0.85}
                        accessibilityLabel="Search properties"
                    >
                        <Feather name="search" size={20} color="#111" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionBtnDark}
                        activeOpacity={0.85}
                        accessibilityLabel="Add property"
                        onPress={onAddPress}
                    >
                        <Feather name="plus" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.summarySection}>
                <Text style={styles.summaryLargeNumber}>{total}</Text>
                <Text style={styles.summarySubtext}>{summarySubtitle}</Text>
            </View>

            {statusFilters.length > 0 ? (
                <View style={styles.statusSegmentTrack}>
                    {statusFilters.map((option) => {
                        const isActive = activeStatus === option.name;
                        return (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.statusSegmentItem,
                                    isActive && styles.statusSegmentItemActive,
                                ]}
                                onPress={() => onStatusChange(option.name)}
                                activeOpacity={0.85}
                            >
                                <Text
                                    style={[
                                        styles.statusSegmentLabel,
                                        isActive && styles.statusSegmentLabelActive,
                                    ]}
                                    numberOfLines={1}
                                >
                                    {option.name}
                                </Text>
                                <Text
                                    style={[
                                        styles.statusSegmentCount,
                                        isActive && styles.statusSegmentCountActive,
                                    ]}
                                >
                                    {option.count}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ) : null}

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled
                style={styles.filterScroll}
                contentContainerStyle={styles.filterScrollContent}
            >
                {typeFilters.map((option) => {
                    const isActive = activeType === option.name;
                    return (
                        <TouchableOpacity
                            key={option.id}
                            style={isActive ? styles.filterPillDark : styles.filterPillOutline}
                            onPress={() => onTypeChange(option.name)}
                            activeOpacity={0.85}
                        >
                            <Text
                                style={
                                    isActive ? styles.filterTextActiveDark : styles.filterTextOutline
                                }
                            >
                                {option.name}
                            </Text>
                            <Text
                                style={isActive ? styles.filterCountDark : styles.filterCountOutline}
                            >
                                {option.count}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}
