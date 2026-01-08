import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreditCard = ({ cardNumber, bankName, expiryDate, onDelete }) => (
  <View className="flex-1">
    <View className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-5 min-w-[280px]">
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-white text-lg font-dm tracking-wider">{cardNumber}</Text>
        <TouchableOpacity onPress={onDelete} className="w-8 h-8 bg-white/20 rounded-full items-center justify-center">
          <Ionicons name="close" size={18} color="white" />
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-between items-end">
        <Text className="text-white text-base font-semibold font-dm">{bankName}</Text>
        <View className="items-end">
          <Text className="text-white/70 text-xs font-dm">Exp. date</Text>
          <Text className="text-white text-sm font-dm mt-1">{expiryDate}</Text>
        </View>
      </View>
    </View>
  </View>
);

const BankOption = ({ bankName, isSelected, onSelect }) => (
  <TouchableOpacity 
    className={`flex-row justify-between items-center py-3 px-4 border-b border-[#E2E2E2] ${isSelected ? 'bg-[rgba(0,43,128,0.05)]' : ''}`}
    onPress={() => onSelect(bankName)}
  >
    <Text className="text-base text-black font-['DM']">{bankName}</Text>
    {isSelected && (
      <Ionicons name="checkmark-circle" size={24} color="#002B80" />
    )}
  </TouchableOpacity>
);

const MenuItem = ({ icon, title, onPress, showBorder = true, isExpanded, navigation, menuType, savedCards, onDeleteCard, onSetDefault, isDefault }) => {
  const [selectedBank, setSelectedBank] = useState('State Bank of India');

  const handleBankSelect = (bankName) => {
    setSelectedBank(bankName);
  };

  return (
    <View>
      <TouchableOpacity
        className={`flex-row items-center justify-between px-5 py-4 ${showBorder ? 'border-b border-gray-100' : ''}`}
        onPress={onPress}
      >
        <View className="flex-row items-center gap-3 flex-1">
          <View className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center">
            {icon === 'card' && (
              <Ionicons name="card" size={20} color="#374151" />
            )}
            {icon === 'bank' && (
              <Ionicons name="business" size={20} color="#374151" />
            )}
            {icon === 'upi' && (
              <Text className="text-xl font-bold text-gray-700">₹</Text>
            )}
          </View>
          <Text className="text-base text-gray-900 font-dm flex-1">{title}</Text>
          {isDefault && (
            <View className="bg-green-50 border border-green-200 px-2 py-1 rounded-lg">
              <Text className="text-xs text-green-700 font-dm">Default</Text>
            </View>
          )}
        </View>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-forward"} 
          size={20}
          color="#9CA3AF"
        />
      </TouchableOpacity>
      
      {isExpanded && menuType === 'card' && (
        <View className="p-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row items-center gap-4">
              {savedCards && savedCards.length > 0 ? (
                savedCards.map((card, index) => (
                  <CreditCard 
                    key={index}
                    cardNumber={card.cardNumber}
                    bankName={card.bankName || 'Bank'}
                    expiryDate={card.expiryDate}
                    onDelete={() => onDeleteCard(index)}
                  />
                ))
              ) : (
                <View className="w-[200px] h-[100px] bg-gray-100 rounded-2xl justify-center items-center">
                  <Text className="text-gray-500 font-dm">No saved cards</Text>
                </View>
              )}
              <TouchableOpacity 
                className="w-[100px] h-[100px] bg-white rounded-2xl border border-[#E2E2E2] justify-center items-center" 
                onPress={()=> navigation.navigate("UpdatePayment2")}
              >
                <Ionicons name="add" size={24} color="black" />
                <Text className="text-sm text-black mt-1 font-['DM']">Add card</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <TouchableOpacity 
            className="flex-row items-center mt-4 gap-2"
            onPress={() => onSetDefault('card')}
          >
            <Ionicons 
              name={isDefault ? "checkbox" : "square-outline"} 
              size={24} 
              color={isDefault ? "#DC2626" : "black"} 
            />
            <Text className="text-sm text-[rgba(0,0,0,0.56)] font-['DM']">Set Default payment method</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {isExpanded && menuType === 'bank' && (
        <View className="p-4">
          <ScrollView style={{ maxHeight: 250 }}>
            <BankOption 
              bankName="State Bank of India" 
              isSelected={selectedBank === "State Bank of India"} 
              onSelect={handleBankSelect} 
            />
            <BankOption 
              bankName="HDFC Bank" 
              isSelected={selectedBank === "HDFC Bank"} 
              onSelect={handleBankSelect} 
            />
            <BankOption 
              bankName="ICICI Bank" 
              isSelected={selectedBank === "ICICI Bank"} 
              onSelect={handleBankSelect} 
            />
            <BankOption 
              bankName="Axis Bank" 
              isSelected={selectedBank === "Axis Bank"} 
              onSelect={handleBankSelect} 
            />
            <BankOption 
              bankName="Bank of Baroda" 
              isSelected={selectedBank === "Bank of Baroda"} 
              onSelect={handleBankSelect} 
            />
            <BankOption 
              bankName="Punjab National Bank" 
              isSelected={selectedBank === "Punjab National Bank"} 
              onSelect={handleBankSelect} 
            />
            <BankOption 
              bankName="Other" 
              isSelected={selectedBank === "Other"} 
              onSelect={handleBankSelect} 
            />
          </ScrollView>
          <TouchableOpacity 
            className="flex-row items-center mt-4 gap-2"
            onPress={() => onSetDefault('netbanking')}
          >
            <Ionicons 
              name={isDefault ? "checkbox" : "square-outline"} 
              size={24} 
              color={isDefault ? "#DC2626" : "black"} 
            />
            <Text className="text-sm text-[rgba(0,0,0,0.56)] font-['DM']">Set Default payment method</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function UpdatePayment({ navigation }) {
  const [expandedItem, setExpandedItem] = useState('card');
  const [savedCards, setSavedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState('card');

  useEffect(() => {
    loadSavedPaymentMethods();
  }, []);

  const loadSavedPaymentMethods = async () => {
    try {
      setLoading(true);
      // Load saved payment methods from AsyncStorage
      const savedMethods = await AsyncStorage.getItem('payment_methods');
      if (savedMethods) {
        const methods = JSON.parse(savedMethods);
        setSavedCards(methods.cards || []);
        setDefaultPaymentMethod(methods.default || 'card');
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (itemType) => {
    if (itemType === 'upi') {
      navigation.navigate("UpdatePayment3");
      return;
    }
    setExpandedItem(expandedItem === itemType ? null : itemType);
  };

  const handleDeleteCard = async (cardIndex) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to remove this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedCards = savedCards.filter((_, index) => index !== cardIndex);
              setSavedCards(updatedCards);
              
              const savedMethods = await AsyncStorage.getItem('payment_methods');
              const methods = savedMethods ? JSON.parse(savedMethods) : {};
              methods.cards = updatedCards;
              await AsyncStorage.setItem('payment_methods', JSON.stringify(methods));
              
              Alert.alert('Success', 'Card removed successfully');
            } catch (error) {
              console.error('Error deleting card:', error);
              Alert.alert('Error', 'Failed to delete card');
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (paymentType) => {
    try {
      setDefaultPaymentMethod(paymentType);
      
      const savedMethods = await AsyncStorage.getItem('payment_methods');
      const methods = savedMethods ? JSON.parse(savedMethods) : {};
      methods.default = paymentType;
      await AsyncStorage.setItem('payment_methods', JSON.stringify(methods));
      
      Alert.alert('Success', 'Default payment method updated');
    } catch (error) {
      console.error('Error setting default payment:', error);
      Alert.alert('Error', 'Failed to update default payment method');
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center" edges={['top']}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="text-gray-500 mt-2 font-dm">Loading payment methods...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      <View className="flex-row items-center px-5 pt-5 pb-4">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <View className="flex-1 items-center pr-10">
          <Text className="text-2xl font-semibold text-gray-900 font-dm">Payment Methods</Text>
        </View>
      </View>
      <View className="mt-5">
        <MenuItem 
          icon="card"
          title="Debit / Credit Card"
          onPress={() => handleItemPress('card')}
          isExpanded={expandedItem === 'card'}
          isDefault={defaultPaymentMethod === 'card'}
          navigation={navigation}
          menuType="card"
          savedCards={savedCards}
          onDeleteCard={handleDeleteCard}
          onSetDefault={handleSetDefault}
        />
        <MenuItem 
          icon="bank"
          title="Net Banking"
          onPress={() => handleItemPress('bank')}
          isExpanded={expandedItem === 'bank'}
          isDefault={defaultPaymentMethod === 'netbanking'}
          navigation={navigation}
          menuType="bank"
          savedCards={[]}
          onDeleteCard={() => {}}
          onSetDefault={handleSetDefault}
        />
        <MenuItem 
          icon="upi"
          title="UPI"
          onPress={() => handleItemPress('upi')}
          isExpanded={expandedItem === 'upi'}
          isDefault={defaultPaymentMethod === 'upi'}
          showBorder={false}
          navigation={navigation}
          menuType="upi"
          savedCards={[]}
          onDeleteCard={() => {}}
          onSetDefault={handleSetDefault}
        />
      </View>
    </SafeAreaView>
  );
}
