import { useState, useEffect } from 'react';
import {View, Text, TextInput, StyleSheet, Pressable} from 'react-native';
// import the auth variable
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
const Logout = () => {
    const navigation = useNavigation();
    const onLogoutClicked = async () => {
        try {
            // 1. check if a user is currently logged in
            if (auth.currentUser === null) {
                alert("Sorry, no user is logged in.")
            }
            else {                
                await signOut(auth)
                navigation.navigate('SignIn')
                alert("Logout complete!")
            }
        } catch (err) {
            console.log("error is",err)
        }
    }
    return(
        <View style={styles.container}>
            <Text style={styles.headerText}> 
            Logout Screen</Text>
            <Pressable style={styles.btn}>
                <Text style={styles.btnLabel} onPress={onLogoutClicked}>Logout</Text>
            </Pressable>
            
        </View>
    );
}

const styles = StyleSheet.create({   
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding:20,
      }, 
    btn: {
        borderWidth:1,
        borderColor:"#141D21",
        borderRadius:8,
        paddingVertical:16,
        marginVertical:10
    }, 
    btnLabel: {
        fontSize:16,
        textAlign:"center"
    }, 
    headerText: {
        fontSize:20, 
        fontWeight:"bold", 
        marginVertical:10
    }
});
export default Logout;