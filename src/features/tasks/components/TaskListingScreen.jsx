import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { taskStyles as styles } from '../styles/task.styles';
import ScreenShell from '../../../components/ScreenShell';
import AppTopHeader from '../../../components/AppTopHeader';
import QueryRefreshControl from '../../../components/QueryRefreshControl';
import { useCompanyNameQuery } from '../../../hooks/useCompanyNameQuery';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useSidebar } from '../../../hooks/useSidebar';
import Sidebar from '../../../components/Sidebar';
import { useTasksQuery } from '../queries/tasksQueries';

const TABS = ['All', 'Pending', 'In Progress', 'Completed'];

export default function TaskListScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const [viewMode, setViewMode] = useState('Standard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showViewMenu, setShowViewMenu] = useState(false);
  const { isAuthenticated } = useRequireAuth();
  const { tasks, total, urgentCount, activeCount, isRefetching, refetch } =
    useTasksQuery(isAuthenticated);
  const { companyName } = useCompanyNameQuery(isAuthenticated);
  const { isSidebarVisible, slideAnim, fadeAnim, openMenu, closeMenu, onSidebarNavigate } =
    useSidebar('Tasks');

  if (!isAuthenticated) {
    return null;
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesTab = activeTab === 'All' ? true : task.status === activeTab;
    const matchesSearch =
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.unit.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getPriorityColor = (priority, isUrgent) => {
    if (isUrgent) return '#E63946';
    if (priority === 'High') return '#F77F00';
    if (priority === 'Medium') return '#F4A261';
    return '#2A9D8F';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <Feather name="check-circle" size={16} color="#2A9D8F" />;
      case 'In Progress':
        return <Feather name="clock" size={16} color="#0077B6" />;
      default:
        return <Feather name="circle" size={16} color="#888" />;
    }
  };

  const getViewModeIcon = () => {
    if (viewMode === 'Grid') return 'grid';
    if (viewMode === 'Compact') return 'list';
    return 'layout';
  };

  const renderStandardCard = ({ item }) => (
    <TouchableOpacity style={styles.taskCard} activeOpacity={0.9}>
      <View style={styles.cardHeader}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{item.taskType}</Text>
        </View>
        <View style={styles.statusWrap}>
          {getStatusIcon(item.status)}
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.taskDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.unitRow}>
        <Feather name="map-pin" size={14} color="#666" />
        <Text style={styles.unitText}>{item.unit}</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.cardFooter}>
        <View style={styles.assigneeRow}>
          <Image source={{ uri: item.assignee.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.assigneeLabel}>Assigned to</Text>
            <Text style={styles.assigneeName}>{item.assignee.name}</Text>
          </View>
        </View>
        <View style={styles.metaRight}>
          <View style={styles.dateRow}>
            <Feather name="calendar" size={12} color={item.isUrgent ? '#E63946' : '#666'} />
            <Text
              style={[styles.dateText, item.isUrgent && { color: '#E63946', fontWeight: '700' }]}
            >
              {item.dueDate}
            </Text>
          </View>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(item.priority, item.isUrgent) + '15' },
            ]}
          >
            <View
              style={[
                styles.priorityDot,
                { backgroundColor: getPriorityColor(item.priority, item.isUrgent) },
              ]}
            />
            <Text
              style={[styles.priorityText, { color: getPriorityColor(item.priority, item.isUrgent) }]}
            >
              {item.isUrgent ? 'URGENT' : item.priority}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCompactCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.compactCard, { borderLeftColor: getPriorityColor(item.priority, item.isUrgent) }]}
      activeOpacity={0.8}
    >
      <View style={styles.compactContent}>
        <Text style={styles.compactDescription} numberOfLines={1}>
          {item.description}
        </Text>
        <View style={styles.compactSubRow}>
          <Text style={styles.compactUnit}>{item.unit.split(' - ')[0]}</Text>
          <View style={styles.compactDot} />
          {getStatusIcon(item.status)}
          <Text style={styles.compactStatus}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.compactRight}>
        <Image source={{ uri: item.assignee.avatar }} style={styles.compactAvatar} />
        <Text style={[styles.compactDate, item.isUrgent && { color: '#E63946', fontWeight: '700' }]}>
          {item.dueDate.substring(0, 6)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderGridCard = ({ item }) => (
    <TouchableOpacity style={styles.gridCard} activeOpacity={0.9}>
      <View style={styles.gridHeader}>
        <View
          style={[styles.gridPriorityStrip, { backgroundColor: getPriorityColor(item.priority, item.isUrgent) }]}
        />
        {getStatusIcon(item.status)}
      </View>
      <Text style={styles.gridDescription} numberOfLines={3}>
        {item.description}
      </Text>
      <Text style={styles.gridUnit} numberOfLines={1}>
        {item.unit.split(' - ')[0]}
      </Text>
      <View style={styles.gridFooter}>
        <Image source={{ uri: item.assignee.avatar }} style={styles.gridAvatar} />
        <View style={styles.gridDateWrap}>
          <Feather name="calendar" size={10} color={item.isUrgent ? '#E63946' : '#888'} />
          <Text style={[styles.gridDate, item.isUrgent && { color: '#E63946' }]}>
            {item.dueDate.substring(0, 6)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const listHeader = (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Tasks</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Feather name="plus" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSectionZIndex}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Feather name="search" size={18} color="#888" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tasks..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity style={styles.viewModeButton} onPress={() => setShowViewMenu(!showViewMenu)}>
            <Feather name={getViewModeIcon()} size={20} color="#111" />
          </TouchableOpacity>
        </View>

        {showViewMenu ? (
          <View style={styles.dropdownMenu}>
            {['Standard', 'Compact', 'Grid'].map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[styles.dropdownItem, viewMode === mode && styles.dropdownItemActive]}
                onPress={() => {
                  setViewMode(mode);
                  setShowViewMenu(false);
                }}
              >
                <Text style={[styles.dropdownText, viewMode === mode && styles.dropdownTextActive]}>
                  {mode}
                </Text>
                {viewMode === mode ? <Feather name="check" size={16} color="#111" /> : null}
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#E63946' }]}>{urgentCount}</Text>
          <Text style={styles.statLabel}>Urgent</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#0077B6' }]}>{activeCount}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={TABS}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tabButton, activeTab === item && styles.tabButtonActive]}
              onPress={() => setActiveTab(item)}
            >
              <Text style={[styles.tabText, activeTab === item && styles.tabTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </>
  );

  return (
    <ScreenShell>
      <AppTopHeader companyName={companyName} onMenuPress={openMenu} />

      <FlatList
        key={viewMode}
        style={styles.list}
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'Grid' ? 2 : 1}
        ListHeaderComponent={listHeader}
        contentContainerStyle={[styles.listContent, styles.listContentGrow]}
        showsVerticalScrollIndicator={false}
        refreshControl={<QueryRefreshControl refetch={refetch} isRefetching={isRefetching} />}
        renderItem={
          viewMode === 'Standard'
            ? renderStandardCard
            : viewMode === 'Compact'
              ? renderCompactCard
              : renderGridCard
        }
      />

      <Sidebar
        isVisible={isSidebarVisible}
        slideAnim={slideAnim}
        fadeAnim={fadeAnim}
        closeMenu={closeMenu}
        onNavigate={onSidebarNavigate}
        activeItem="Tasks"
      />
    </ScreenShell>
  );
}
