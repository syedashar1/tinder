import { View, Text, ActivityIndicator } from 'react-native'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut
} from 'firebase/auth'
import { auth } from '../firbase';

const AuthContext = createContext({
})

WebBrowser.maybeCompleteAuthSession();

const config = {
  androidClientId: '49886141206-p2ek233qd23ntf9jielv9t117jcnbu98.apps.googleusercontent.com',
  iosClientId: '49886141206-18gqapr2th4a1r9dktuhn4v5mbl6onve.apps.googleusercontent.com',
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"],
  expoClientId: '49886141206-b78rdj5gt3fp9nu353tfafm7dr2isigq.apps.googleusercontent.com',
  webClientId: '49886141206-p2ek233qd23ntf9jielv9t117jcnbu98.apps.googleusercontent.com',
}

const AuthProvider = ({ children }) => {

  const [test, setTest] = useState('Ok')
  const [user, setUser] = useState(null)
  const [loadingLogin, setLoadingLogin] = useState(true)


  useEffect(() => onAuthStateChanged(auth, (user) => {

    console.log(user,'userrrr'); 

      if(user) {
        console.log('user is present');
        setUser({
          name: user.displayName,
          pic: user.photoURL,
          email: user.email,
          id: user.uid
        })
        setLoadingLogin(false)
      }
      if(!user){
        setUser(null)
        setLoadingLogin(false)
      }
    }) , [])
  

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(config);

  const signInWithGoogle = async () => {
    promptAsync();
  }

  const logOut = async () => {
    setLoadingLogin(true)
    await signOut(auth)
    setLoadingLogin(false)
  }

  const [token, setToken] = useState("");

  useEffect(() => {
    if (response?.type === "success") {
      console.log(response.params.id_token);
      // setToken(response.params.id_token);
      getUserInfo(response.params.id_token);
    }
  }, [response, token]);

  const getUserInfo = async (t) => {
    try {
      const credential = GoogleAuthProvider.credential(t)
      await signInWithCredential(auth, credential)
    } catch (error) {
      console.log(error, 'error');
      // Add your own error handler here
    }
  };


  // const memoedValue = useMemo(()=>({
  //   user,
  //   loadingLogin,
  //   signInWithGoogle,
  //   logOut
  // }) , [user, loadingLogin])


  return (
    <AuthContext.Provider value={{
      test, setTest, user, setUser, signInWithGoogle, token, loadingLogin, logOut
    }} >
      { loadingLogin ? <ActivityIndicator/> : children }
    </AuthContext.Provider>
  )
}

const AuthOpen = () => {
  return useContext(AuthContext);
};

export { AuthOpen, AuthProvider };



// const x = { "email": "saghirashar@gmail.com", "family_name": "Saghir", "given_name": "Ashar", "id": "103926274296775705576", "locale": "en-GB", "name": "Ashar Saghir", "picture": "https://lh3.googleusercontent.com/a/AGNmyxbW44gFL6ItWmff57o7Ye4jaDExeNhbo1iQkTsW=s96-c", "verified_email": true }