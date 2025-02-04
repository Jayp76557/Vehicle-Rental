import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TextInput, Button, Pressable, SafeAreaView, Image, TouchableOpacity } from "react-native"
import MapView, { Callout, Marker } from 'react-native-maps'
import SlidingUpPanel from "rn-sliding-up-panel";
import * as Location from 'expo-location';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from "firebase/firestore";

import { Icon } from 'react-native-elements'


const Search = () => {
    const [markersArray, setMarkersArray] = useState([])
    const [deviceLatitude, setDeviceLatitude] = useState(37.78825)
    const [deviceLongitude, setDeviceLongitude] = useState(-122.4324)
    const latitudeDelta = 0.0922
    const longitudeDelta = 0.0421

    const [title, setTitle] = useState('San Francisco')
    const [desc, setDesc] = useState('Home of Apple and Facebook')
    const [deviceLocation, setDeviceLocation] = useState({ lat: 37.78825, lng: -122.4324 });
    const [currAddress, setCurrAddress] = useState(null);

    const [searchLoacation, setSearchLocation] = useState('')
    const [mapCoords, setMapCoords] = useState({})
    const [cars, setData] = useState([]);
    const [currentCar, setCurrentCar] = useState({})


    const MARKERS_ARRAY = [
        {
            lat: 37.78825,
            lng: -122.4344,
            name: "San Francisco",
            desc: "Home of Apple and Facebook",
        },
        {
            lat: 37.78849,
            lng: -122.40679,
            name: "Union Square",
            desc: "A central meeting square surrounded by shops.",
        },
        {
            lat: 40.759211,
            lng: -73.984638,
            name: "current location",
            desc: "for vibes",
        }
    ];

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
          console.log(`resultsFromFirestore: ${resultsFromFirestore}`)
          setData(resultsFromFirestore);
        } catch (error) {
          console.error('Error fetching cars:', error);
        }
      };

    const getCurrentLocation = async () => {
        try {
            // 1. get permissions 
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert(`Permission to access location was denied`)
                return
            }
            // alert("Permission granted")

            // 2. if permission granted, then get the location            
            // 3. do something with the retreived location
            let location = await Location.getCurrentPositionAsync()
            // alert(JSON.stringify(location))
            // console.log(location)
            // display the location in the UI
            setDeviceLocation({ lat: location.coords.latitude, lng: location.coords.longitude })
            setDeviceLatitude(location.coords.latitude)
            setDeviceLongitude(location.coords.longitude)
            setMapCoords({ lat: location.coords.latitude, lng: location.coords.longitude })
        } catch (err) {
            console.log(err)
        }
    }

    const doForwardGeocode = async () => {
        try {
            // 0. on android, permissions must be granted
            // 1. do geocoding
            // console.log(`Attempting to geocode: ${searchLoacation}`)
            const geocodedLocation = await Location.geocodeAsync(searchLoacation)
            // 2. Check if a result is found
            const result = geocodedLocation[0]
            if (result === undefined) {
                alert("No coordinates found")
                return
            }
            // 3. do something with results 
            // console.log(result)           
            // alert(JSON.stringify(result))
            // update state variable to an object that contains the lat/lng
            // (alternatively you could have created 2 separate state variables)
            setMapCoords({lat: result.latitude, lng: result.longitude})

        } catch (err) {
            console.log(err)
        }
    }

    const doReverseGeocode = async (lat, lng) => {
        alert("reverse geocode button clicked")
        try {
            // 0. on android, permissions must be granted
            // 1. do geocoding
            const coords = {
                latitude: parseFloat(lat),
                longitude: parseFloat(lng),
            }
            // 2. check if result found
            const postalAddresses = await Location.reverseGeocodeAsync(coords, {})

            const result = postalAddresses[0]
            if (result === undefined) {
                alert("No results found.")
                return
            }
            console.log(result)
            alert(JSON.stringify(result))

            // 3. do something with results

            // output the street address and number to the user interace
            const output = `${result.streetNumber} ${result.street}, ${result.city}, ${result.region}`
            // save it to a state variable to display on screen
            setCurrAddress(output)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getCurrentLocation()
        fetchCars()
        setMarkersArray(MARKERS_ARRAY)

    }, [])


    const searchCity = () => {

    }

    return (
        <View style={styles.container}>
            {/* 3. MapView */}
            
            <View>
                <MapView
                    style={{ height: "100%", width: "100%" }}
                    region={{
                        latitude: mapCoords.lat,
                        longitude: mapCoords.lng,
                        latitudeDelta: 0.1122,
                        longitudeDelta: 0.0621,
                    }}
                >
                    {
                        // loop through the markers array            
                        cars.map(
                            // currItemInArray == the current item we are iterating over
                            // pos = position in the array             
                            (currItem, pos) => {
                                console.log(`current item: ${currItem}`)
                                const coords = {
                                    latitude: currItem.latitude,
                                    longitude: currItem.longitude
                                }

                                return (
                                    <Marker
                                        key={pos}
                                        coordinate={coords}
                                        title={currItem.make}
                                        description={currItem.model}
                                        
                                    >
                                        <Pressable style={styles.marker} onPress={() => {
                                            setCurrentCar(currItem)
                                            this._panel.show(250)
                                        }}
                                        onDeselect={() => {
                                            this._panel.hide()
                                        }} >
                                            <Text>{"$" +currItem.price}</Text>
                                        </Pressable>

                                    </Marker>
                                )
                            }
                        )
                    }

                </MapView>
            </View>
            <View>
                <SlidingUpPanel
                    draggableRange={{ top: 300, bottom: 0 }} // Customize the range
                    showBackdrop={true} // Set to true for a modal-like effect
                    ref={(c) => (this._panel = c)}
                    visible={false} // Set to true if you want it visible on load
                >
                    {/* Your slide-up panel content */}
                    
                    <View style={styles.panelView}>

                        <Text>{currentCar.price}</Text>
                        <Text>{currentCar.model}</Text>
                        <Text>{currentCar.make}</Text>
                        <Image source={{uri: currentCar.carImage[0].url_full}} style={{height:40, width: 40}}/>

                        <Text>{"" + currentCar.address}</Text>
                    </View>
                    {/* You can use this._panel.show() and this._panel.hide() to control visibility */}
                </SlidingUpPanel>
            </View>
            <View style={styles.searchBar}>
                <TextInput style={{flex: 1}} value={searchLoacation} onChangeText={setSearchLocation} placeholder="Search city"/>
                {/* <Icon name='search'/> */}
                <Pressable onPress={doForwardGeocode}>
                    
                    <Icon name='search'/>
                    
                </Pressable>
                <Pressable onPress={()=> {
                    setMapCoords(deviceLocation)
                }}>
                    
                    <Icon name='home'/>
                    
                </Pressable>
            </View>


        </View>

    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        // padding: 20,
    },
    map: {
        height: "90%",
        width: "100%",
    },
    btn: {
        borderWidth: 1,
        borderColor: "#141D21",
        borderRadius: 8,
        paddingVertical: 16,
        marginVertical: 10,
    },
    btnLabel: {
        fontSize: 16,
        textAlign: "center",
    },
    tb: {
        width: "100%",
        borderRadius: 5,
        backgroundColor: "#efefef",
        color: "#333",
        fontWeight: "bold",
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginVertical: 10,
    },
    panelView: {
        backgroundColor: 'white',
        height: '100%'
    },
    marker: {
        backgroundColor: 'white',
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        borderWidth: 1,
        borderColor: 'black'

    },

    searchBar: {
        flexDirection: 'row',
        position: 'absolute',
        bottom:750,
        alignSelf: 'center',
        width: '70%',
        // height: 30,
        borderRadius: 10,

        backgroundColor: 'white',
        padding:4,
        borderColor: 'black',
        borderWidth:1
    }
});

export default Search

