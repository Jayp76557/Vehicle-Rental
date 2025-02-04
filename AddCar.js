
import React, { useEffect, useState } from 'react';
import { View, ScrollView, TextInput, Button, StyleSheet, Image, TouchableOpacity,Text, Pressable,Modal,FlatList} from 'react-native';
import { collection, addDoc } from "firebase/firestore"; 
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { db, auth } from '../firebaseConfig';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

const AddCar = () => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [carImage, setCarImage] = useState([]);
  const [address, setAddress] = useState('');
  const [label, setName] = useState('');
  const [license, setLicense] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [seatingCapacity, setSeatingCapacity] = useState('');
  const [trim, setTrim] = useState('');

  const [cars,setCars] = useState([]);
  const [showSelectCar,setShowSelectCar] = useState(false)
  const [carsDisplay,setCarsDisplay] = useState([])
  const [searchMake, setSearchMake] = useState("")

  const handleGeocode = async () => {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: address,
          key: 'AIzaSyDfAaTwDOjm_OnbVnDK3UDD-iVgJMcD81U', // Replace with your Google Maps API key
        },
      });
  
      if (response.data && response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        setLatitude(lat);
        setLongitude(lng);
        console.log('lat,long',lat,lng)
      } else {
        console.log('No results found for the given address');
      }

    } catch (error) {
      console.error('Error fetching geocode:', error);
    }
  };

  const addCar = async() => {
    await handleGeocode()
    await handleAddCar()
    
  }


  const fetchCars = async () => {
    try {
      const response = await fetch("https://darreneddy.github.io/vehicles.json")
      const results = await response.json()
      setCars(results)
      } catch (err) {
      console.log(err)
      }
  }

  const renderItem =({item})  => (
    <View style = {styles.rowItem}>
        <Pressable>
        <Text>{item.make} {item.model} {item.trim}</Text>
        </Pressable>
   
    </View>
  )
  
  const selectCar = (item) =>
  {
    setMake(item.make)
    setModel(item.model)
    setTrim(item.trim)
    setCarImage(item.images)
    setSeatingCapacity(item.seats_max)

}

  const handleAddCar = async () => {
    try {
      // Add car to firestore
      const constructedName = `${make} ${model} ${trim}`;
      const docRef = await addDoc(collection(db, "cars"), {
        address,
        latitude:latitude,
        longitude:longitude,
        carImage:carImage, 
        label: constructedName,
        license,
        make:make,
        model:model,
        ownerId: auth.currentUser.email,
        ownerImage: '', 
        ownerName: auth.currentUser.email,
        renterEmail:'',
        renterName:'',
        status:"OPEN",
        renterImage:'',
        price,
        seatingCapacity:seatingCapacity,
        trim:trim,
        confirmationCode:"",
        date: Date()
      });

      // Reset form fields
      setAddress('');

      setName('');
      setLicense('');
      setMake('');
      setModel('');
      setPrice('');
      setSeatingCapacity('');
      setTrim('');
      setCarImage('');
      console.log("Document written with ID: ", docRef);
    } catch (error) {
      console.error('Error adding car:', error);
    }
  };

  useEffect(() => { fetchCars() }, [])

  return (
    <ScrollView contentContainerStyle={styles.container}>
  
  <Text style={styles.text}>Car:</Text>
      <Dropdown
        data={cars}
        style={styles.input}
        labelField={"handle"}
        placeholder='Select A Car'
        onChange={item => {
          selectCar(item);
        }}
      />


      <Text style={styles.text}>Address:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Pickup Address"
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.text}>License:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter License Plate"
        value={license}
        onChangeText={setLicense}
      />
      <Text style={styles.text}>Price:</Text>
      <TextInput
        style={styles.input}
        placeholder="Car Rent Price per Week"
        value={price}
        onChangeText={setPrice}
      />

      <TouchableOpacity
        style={[styles.itemContainer2, styles.pickimage]}
        onPress={() => {
          addCar()
          
          
       }}
      >
        <Text style={styles.title2}>Add Car</Text>
      </TouchableOpacity>


    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f1f4f6',
      },
      text:{
        fontSize:16,
        fontWeight:"700",
        marginBottom:5
      },
      input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
      },
      itemContainer2:{
        marginBottom: 10,
        // paddingVertical: 20,
        // paddingHorizontal: 10,
        backgroundColor: '#16184c', 
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        width: '100%', // Full width
        fontSize: 16,
        fontWeight: 'bold',
      },
      title2: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign:'center',
        color: '#FFFFFF',
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      rowItem:{
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: '#ecf0f1',
        borderRadius: 10,
        justifyContent: 'center',
        width: '100%', // Full width
      }
      

});

export default AddCar;

