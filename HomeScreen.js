import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { db } from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { collection, getDocs } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
const HomeScreen = () => {

  const navigation = useNavigation();
  const [cars, setData] = useState([]);
  // AIzaSyDfAaTwDOjm_OnbVnDK3UDD-iVgJMcD81U
  useEffect(() => {
    fetchCars();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchCars();
    }, [])
  );

  const fetchCars = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "cars"));
      const resultsFromFirestore = [];
      querySnapshot.forEach((doc) => {
        const itemToAdd = {
          id: doc.id,
          ...doc.data()
        }
        resultsFromFirestore.push(itemToAdd);
      });
      setData(resultsFromFirestore);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const navigateToDetails = (carId) => {
    navigation.navigate("Booking",carId)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.main}>My Cars</Text>
      
      {cars.length === 0 ? (
        <Text style={styles.notext}>No cars found</Text>
      ) : (
        <FlatList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigateToDetails(item)}>
              <View style={styles.itemContainer}>
              <Image source={{ uri: item.carImage[0].url_full }} style={styles.carImage} />
              <View style={styles.itemContainer2}>
                <Text style={styles.make}>{item.label}</Text>
                <Text style={styles.label}>{item.make}</Text>
                <Text style={styles.price}>Price: {item.price}</Text>
                <Text style={styles.seatingCapacity}>Seating Capacity: {item.seatingCapacity}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f4f6',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  main: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center"
  },
  itemContainer: {
    // flexDirection:'row',
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    justifyContent: 'center',
    width: '100%', // Full width
  },
  itemContainer2: {
    marginBottom: 10,
    // paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    justifyContent: 'center',
    width: '100%', // Full width
  },
  carImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain', // Use 'cover' to fit and maintain aspect ratio
    borderRadius: 10,
    marginBottom: 10,
  },
  
  make: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    marginBottom: 5,
  },
  seatingCapacity: {
    fontSize: 16,
    marginBottom: 10,
  },
  notext: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: "center",
    marginTop: 10
  }
});

export default HomeScreen;
