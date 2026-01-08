import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bookingsAPI } from '../../services/api';

// Components
import BookingCard from './components/BookingCard';
import BookingHeader from './components/BookingHeader';
import BookingTabs from './components/BookingTabs';
import BookingFilters from './components/BookingFilters';

export default function BookingList({ navigation }) {
    // Data State
    const [userId, setUserId] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Filter/Tab State
    const [activeTab, setActiveTab] = useState('upcoming');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchVisible, setSearchVisible] = useState(false);

    // Modal State
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [activeFilters, setActiveFilters] = useState(null);
    const [tempFilters, setTempFilters] = useState({
        date: '',
        serviceName: '',
        serviceType: 'Repairs',
        paymentType: 'Cash on delivery',
        tokenFrom: '',
        tokenTo: ''
    });

    // --- Effects ---

    useEffect(() => {
        fetchUserId();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchBookings();
        }
    }, [userId]);

    useEffect(() => {
        applyFilters();
    }, [allBookings, activeTab, activeFilters, searchQuery]);

    // --- Data Fetching ---

    const fetchUserId = async () => {
        try {
            const userData = await AsyncStorage.getItem('user_data');
            if (userData) {
                const user = JSON.parse(userData);
                setUserId(user.user_id || user.id);
            }
        } catch (error) {
            console.error('Error fetching user ID:', error);
        }
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await bookingsAPI.getUserBookings(userId);
            setAllBookings(response.data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        if (userId) fetchBookings();
        else setRefreshing(false);
    };

    // --- Filtering Logic ---

    const applyFilters = () => {
        let filtered = [...allBookings];

        // 1. Tab Filtering
        filtered = filtered.filter(booking => {
            if (activeTab === 'upcoming') return ['confirmed', 'pending', 'scheduled', 'accepted', 'in_queue'].includes(booking.status);
            if (activeTab === 'completed') return booking.status === 'completed';
            if (activeTab === 'rescheduled') return booking.status === 'rescheduled';
            return false;
        });

        // 2. Search Query Filtering
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(b =>
                b.service?.name?.toLowerCase().includes(query) ||
                b.service?.vendor_name?.toLowerCase().includes(query)
            );
        }

        // 3. Modal Filters (if applied)
        if (activeFilters) {
            if (activeFilters.date) {
                filtered = filtered.filter(b => b.booking_date.includes(activeFilters.date));
            }
            if (activeFilters.serviceName) {
                filtered = filtered.filter(b => b.service?.name?.toLowerCase().includes(activeFilters.serviceName.toLowerCase()));
            }
            if (activeFilters.serviceType) {
                filtered = filtered.filter(b => b.service?.category?.toLowerCase().includes(activeFilters.serviceType.toLowerCase()));
            }
            if (activeFilters.tokenFrom) {
                filtered = filtered.filter(b => b.service?.price >= parseFloat(activeFilters.tokenFrom));
            }
            if (activeFilters.tokenTo) {
                filtered = filtered.filter(b => b.service?.price <= parseFloat(activeFilters.tokenTo));
            }
        }

        setBookings(filtered);
    };

    const handleApplyFilters = () => {
        setActiveFilters(tempFilters);
        setFilterModalVisible(false);
    };

    const handleClearFilters = () => {
        setTempFilters({
            date: '',
            serviceName: '',
            serviceType: '',
            paymentType: '',
            tokenFrom: '',
            tokenTo: ''
        });
        setActiveFilters(null);
        setFilterModalVisible(false); // Optionally close on clear
    };

    // --- Render Helpers ---

    const renderBookingItem = useCallback(({ item }) => (
        <BookingCard
            booking={item}
            onViewDetails={() => navigation.navigate('BookingDetails', { booking: item })}
        />
    ), [navigation]);

    const getHeaderTitle = () => {
        if (activeTab === 'upcoming') return 'Upcoming';
        if (activeTab === 'completed') return 'Completed';
        return 'Resched';
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            
            <BookingHeader 
                onBack={() => navigation.goBack()}
                title={getHeaderTitle()}
                searchVisible={searchVisible}
                setSearchVisible={setSearchVisible}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onFilterPress={() => setFilterModalVisible(true)}
                isFilterActive={!!activeFilters}
            />

            <BookingTabs 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#DC2626" className="mt-10" />
            ) : (
                <FlatList
                    data={bookings}
                    renderItem={renderBookingItem}
                    keyExtractor={(item) => (item.id || Math.random()).toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    ListEmptyComponent={
                        <View className="items-center mt-10">
                            <Text className="text-gray-400 font-dm">No {activeTab} bookings found</Text>
                        </View>
                    }
                />
            )}

            <BookingFilters 
                visible={filterModalVisible}
                onClose={() => setFilterModalVisible(false)}
                filters={tempFilters}
                setFilters={setTempFilters}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
            />
            
        </SafeAreaView>
    );
}
