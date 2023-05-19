import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  ScrollView
} from "react-native";
import React, { useEffect, useState } from 'react'
import { AuthOpen } from '../hooks/useAuth'
import { collection, doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firbase';
import { useNavigation } from '@react-navigation/native';
import tw from "tailwind-rn";
// import { ScrollView } from "react-native-gesture-handler";

import * as Progress from "react-native-progress";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../firbase";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import {AntDesign, Entypo, Ionicons} from '@expo/vector-icons'


const Modal = () => {

  

    const { user } = AuthOpen();
    const [profileUrl, setProfileUrl] = useState('')
    const [age, setAge] = useState('')
    const [job, setJob] = useState('')
    const n = useNavigation()
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);

    const [myProfile, setmyProfile] = useState({})


    const getMyFullProfile = async () => {
      const myFullProfile = await (
        await getDoc(doc(db, "tinder_profiles", user.id))
      ).data();
      setmyProfile(myFullProfile)
      console.log(myFullProfile,'me');

      setAge(myFullProfile.age)
      setProfileUrl(myFullProfile.photoUrl)
      setJob(myFullProfile.job)
    }

    useEffect(() => {
      (async () => {

        getMyFullProfile();


        if (Platform.OS !== "web") {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
          }
        }
      })();
    }, []);
  
    const selectImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
        setProfileUrl(result.uri);
      setUploading(true);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", result.uri, true);
        xhr.send(null);
      });
  
      const timestamp = new Date().toISOString();
      const filename = user.name + timestamp;
      const storageRef = ref(storage, filename);
  
      const uploadTask = uploadBytesResumable(storageRef, blob);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setTransferred(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          setUploading(false);
          Alert.alert(
            "Image Upload Unsuccessful",
            "Please try uploading the profile image again."
          );
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          setUploading(false);
          Alert.alert("Image Upload Successful");
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setProfileUrl(downloadURL);
            if(myProfile && myProfile.id){
              setDoc(updateDoc(db, 'tinder_profiles', user.id), {
                photoUrl: downloadURL
              })
            }
          });




        }
      );
    

      }
      
    };
  
    const uploadImage = async () => {};


    const incompleteForm = !profileUrl || !age || !job

    const updateProfileHandler = async () => {

        const newDocRef = doc(db, 'tinder_profiles', user.id);

        setDoc(newDocRef, {
            ...user ,
            photoUrl: profileUrl,
            age,job,
            timestamp: serverTimestamp()
        }).then(x=>{
            n.navigate('Home')
        }).catch(e=>{
            console.warn(e);
            alert('error')
        })
    }
    

  return (
    <ScrollView>
      <View style={{flex:1, alignItems:'center', paddingTop:10,paddingBottom:130}} >
      <Image
        style={tw("h-20 w-full")}
        resizeMode="contain"
        source={{uri: 'https://links.papareact.com/2pf'}}
      />

      <Text style={{fontSize:28, color:'rgba(0,0,0,0.6)', paddingTop:20, fontWeight: 700}} >
        Welcome {user.name}
      </Text>

    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'flex-end',gap:10}} >
    <Text on style={{fontSize:20, color:'rgba(255,0,0,0.5)', paddingTop:30, fontWeight: 700,height:68}} >
        Step 1: The Profile Pic
      </Text>

<TouchableOpacity style={[styles.selectButton]} onPress={selectImage}>
<Entypo name='camera' size={24} color={'white'} />       
          </TouchableOpacity>
    </View>
      
<View style={styles.imageContainer}>
          {profileUrl ? (
            <Image source={{ uri: profileUrl }} style={styles.imageBox} />
          ) : null}
          {uploading ? (
            <View style={styles.progressBarContainer}>
              <Progress.Bar progress={transferred} width={300} />
            </View>
          ) : (<View></View>)}
        </View>


<Text style={{fontSize:20, color:'rgba(255,0,0,0.5)', marginTop:-10, fontWeight: 700}} >
        Step 2: The Occupation
      </Text>
      <TextInput
        style={{textAlign:'center', fontSize:20, paddingBottom:20}}
        placeholder='Enter Your Job'
        onChangeText={(t)=>setJob(t)}
      />

<Text style={{fontSize:20, color:'rgba(255,0,0,0.5)', paddingTop:20, fontWeight: 700}} >
        Step 3: The Age
      </Text>
      <TextInput
        style={{textAlign:'center', fontSize:20, paddingBottom:20}}
        placeholder='Whats your age'
        onChangeText={(t)=>setAge(t)}
      />

    <TouchableOpacity
    disabled={incompleteForm} onPress={updateProfileHandler}
    style={{width:200, padding:15, position:'absolute', bottom: 20, backgroundColor: incompleteForm ? 'rgba(0,0,0,0.4)' : 'rgba(255,0,0,0.6)',borderRadius:20}} >
        <Text style={{textAlign:'center',color:'white',fontSize:20}} >
            Update Profile
        </Text>
    </TouchableOpacity>

    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#bbded6",
  },
  selectButton: {
    borderRadius: 25,
    width: 50,
    height: 50,
    backgroundColor: "rgba(255,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: "#FF5864",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageContainer: {
    marginTop: 20,
    marginBottom: 50,
    alignItems: "center",
  },
  progressBarContainer: {
    marginTop: 20,
  },
  imageBox: {
    width: 300,
    height: 300,
  },
});

export default Modal