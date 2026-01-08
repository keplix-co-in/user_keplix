import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { getImageUrl } from '../../../utils/imageHelper';

const BookingCard = memo(({ booking, onViewDetails }) => {
  const defaultImage = require('../../../assets/images/p1.png');
  const serviceImage = getImageUrl(booking.service?.image_url) || defaultImage;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <View className="bg-white border border-gray-100 rounded-2xl mb-4 mx-5 p-4 shadow-sm">
      {/* Top Section: Image and Details */}
      <View className="flex-row">
        <Image
          source={serviceImage}
          className="w-24 h-24 rounded-xl bg-gray-100"
          resizeMode="cover"
        />
        <View className="flex-1 ml-4 justify-between py-1">
          <View>
            <Text className="text-base font-bold font-dm text-gray-900" numberOfLines={1}>
              {booking.service?.name || 'Service Name'}
            </Text>
            <Text className="text-xs text-gray-500 font-dm mt-1" numberOfLines={1}>
              {booking.service?.vendor_name || 'Vendor Name'}
            </Text>
          </View>
          <View>
            <Text className="text-lg font-bold font-dm text-gray-900">
              ₹{booking.service?.price?.toLocaleString('en-IN') || '0'}
            </Text>
          </View>
        </View>
      </View>

      {/* Date/Time Row */}
      <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-50">
        <View className="flex-row items-center bg-red-50 px-2 py-1 rounded-md">
          <Text className="text-red-700 text-xs font-semibold font-dm">
            {formatDate(booking.booking_date)}
          </Text>
        </View>
        <Text className="text-gray-500 text-xs font-dm">
          {formatTime(booking.booking_time)}
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row items-center justify-between mt-4">
        <TouchableOpacity onPress={() => console.log('Need help')}>
          <Text className="text-xs text-gray-500 font-medium font-dm underline">Need help?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#DC2626] px-6 py-2.5 rounded-lg"
          onPress={onViewDetails}
        >
          <Text className="text-white text-xs font-bold font-dm">View details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

BookingCard.displayName = 'BookingCard';
export default BookingCard;
