import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AuthOpen } from '../hooks/useAuth'
import tw from 'tailwind-rn'
import { TouchableOpacity } from 'react-native'
import { Image } from 'react-native'
import {AntDesign, Entypo, Ionicons} from '@expo/vector-icons'
import SafeViewAndroid from '../utils/androidNotchFix'
import Swiper from 'react-native-deck-swiper'
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { db } from '../firbase'
import generateId from '../utils/generateIds'


const dummyData = [ 
  {
    name: 'Elon Musk',
    occupation: 'CEO Tesla',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/1200px-Elon_Musk_Royal_Society_%28crop2%29.jpg',
    age: 35,
    id: 11
  },  {
    name: 'Johny Depp',
    occupation: 'Actor',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Johnny_Depp_2020.jpg',
    age: 45,
    id: 12
  },  {
    name: 'Leo Messi',
    occupation: 'Football Player',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg',
    age: 34,
    id: 13
  },  {
    name: 'Dakota Johnson',
    occupation: 'Actress',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Dakota_Johnson_Venice_2018_%28cropped%29.jpg',
    age: 31,
    id: 14
  }, 
  {
    name: 'Syed Ashar',
    occupation: 'Top Rated Dev',
    photoUrl: 'https://avatars.githubusercontent.com/u/77550580?v=4',
    age: 22,
    id: 14
  }, 
  {
    name: 'Cristiano Ronaldo',
    occupation: 'Football Player',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg',
    age: 37,
    id: 15
  },  {
    name: 'Neymar',
    occupation: 'Football Player',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/65/20180610_FIFA_Friendly_Match_Austria_vs._Brazil_Neymar_850_1705.jpg',
    age: 29,
    id: 16
  },  {
    name: 'Alexa',
    occupation: 'Model',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Alexa_Von_Tess_at_Shoot_Barely_Legal_70_4.jpg',
    age: 25,
    id: 17
  },  {
    name: 'Andrew Tate',
    occupation: 'Kickboxer',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Andrew_Tate_2021_on_James_English_Uploaded_By_James_Tamim_%28cropped%29.png',
    age: 35,
    id: 18
  },  {
    name: 'Tristian Tate',
    occupation: 'Model',
    photoUrl: 'https://i.pinimg.com/736x/6d/47/07/6d4707f08ccd60cc7c9f62f2b9dd1bc1.jpg',
    age: 33,
    id: 19
  },{

    name: 'Dua Lipa',
    occupation: 'Model',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/DuaLipaO2020522_%28101_of_110%29_%2852052470251%29_%28cropped%29.jpg',
    age: 26,
    id: 19
    // 
  }

]


const Home = () => {

  const nav = useNavigation()

  const {user, logOut} = AuthOpen()
  const swipeRef = useRef()
  const [profilesState, setProfilesState] = useState([])

  const checkObjectExists = async () => {
    try {
      const docRef = doc(db, 'tinder_profiles', user.id);
  
      const docSnapshot = await getDoc(docRef);
  
      if (docSnapshot.exists()) {
        // console.log('Object exists!');
        // const objectData = docSnapshot.data();
        // console.log('Object data:', objectData);
      } else {
        nav.navigate('Modal')
        console.log('Object does not exist.');
      }
    } catch (error) {
      console.error('Error checking object:', error);
    }
  };

  useLayoutEffect(() => {
    console.log(user);

    checkObjectExists()
  } , [user])

  // useEffect(() => {
  //   let unsub;

  //   const fetchCards = async () => {

  //       const passes = await getDocs(collection(db,'tinder_profiles', user.id, 'left_swipes')).then(
  //         (snapshot) => snapshot.docs.map(doc => doc.id)
  //       )

  //       const okays = await getDocs(collection(db,'tinder_profiles', user.id, 'right_swipes')).then(
  //         (snapshot) => snapshot.docs.map(doc => doc.id)
  //       )

  //       const passedUserIds = passes.length > 0 ? passes : ['test']
  //       const okaysUserIds = okays.length > 0 ? okays : ['test']

  //         unsub = onSnapshot(
  //           query( query(collection(db, 'tinder_profiles'), where('id', 'not-in', [...passedUserIds, ...okaysUserIds])), (snapshot) =>{
  //             console.log(snapshot.docs);
  //             setProfilesState(
  //               snapshot.docs.filter(doc => doc.id !== user.id ).map((doc)=>({
  //                 id: doc.id,
  //                 ...doc.data()
  //               }))
  //             )
  //         }  )
  //         )
  //   }

  //   fetchCards();
  //   return unsub;

  // }, [])


  useEffect(() => {
    let unsub;
    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "tinder_profiles", user.id, "right_swipes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const swipes = await getDocs(
        collection(db, "tinder_profiles", user.id, "left_swipes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const passedUserIds = passes.length > 0 ? passes : ["test"];
      const swipedUserIds = swipes.length > 0 ? swipes : ["test"];

      console.log([...passedUserIds, ...swipedUserIds]);

      unsub = onSnapshot(
        query(
          collection(db, "tinder_profiles"),
          where("id", "not-in", [...passedUserIds, ...swipedUserIds])
        ),
        (snapshot) => {
          setProfilesState(
            snapshot.docs
              .filter((doc) => doc.id !== user.id)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );
    };
    console.log(profilesState,'loaded profiles');
    fetchCards();
    return unsub;
  }, []);


  const swipeLeftHandler = async (index) => {
    if(!profilesState[index]) return;

    const userSwiped = profilesState[index]
    console.log(`${user.name} passed Left on ${userSwiped.name}`);

    setDoc(doc(db, 'tinder_profiles', user.id, "left_swipes", userSwiped.id), userSwiped)

  }

  // const swipeRightHandler = async (index) => {
  //   if(!profilesState[index]) return;

  //   const userSwiped = profilesState[index]
  //   const myFullProfile = await (await getDoc(doc, 'tinder_profiles', user.id)).data()

  //   getDoc(doc(db, 'tinder_profiles', userSwiped.id, 'right_swipes', user.id)).then(
  //         (docSs) => {
  //           if (docSs.exists()) {
  //             console.log(`MATCH made with ${userSwiped.name}`)
  //             setDoc(doc(db, 'tinder_profiles', user.id, "right_swipes", userSwiped.id), userSwiped)

  //             setDoc(doc(db, 'matches', generateId(user.id, userSwiped.id)) , {
  //               users: {
  //                 [user.id]: myFullProfile,
  //                 [userSwiped.id]: userSwiped
  //               },
  //               usersMatched: [user.id, userSwiped.id],
  //               timestamp: serverTimestamp()
  //             } )

  //             nav.navigate('Match', {
  //               myFullProfile,
  //               userSwiped
  //             })
              
  //           }
  //           else {
  //             console.log(`${user.name} passed Right on ${userSwiped.name}`)
  //             setDoc(doc(db, 'tinder_profiles', user.id, "right_swipes", userSwiped.id), userSwiped)

  //           }
  //         }
  //       )


  // }

  const swipeRightHandler = async (cardIndex) => {
    if (!profilesState[cardIndex]) return;

    const userSwiped = profilesState[cardIndex];
    const myFullProfile = await (
      await getDoc(doc(db, "tinder_profiles", user.id))
    ).data();

    

    //Check if the user swiped on you...
    getDoc(doc(db, "tinder_profiles", userSwiped.id, "right_swipes", user.id)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          //user has matched with you before you matched with them...
          //Create a MATCH!
          console.log(`Hooray, you matched with ${userSwiped.name}`);
          setDoc(
            doc(db, "tinder_profiles", user.id, "right_swipes", userSwiped.id),
            userSwiped
          );
          //CREATE A MATCH!
          setDoc(doc(db, "matches", generateId(user.id, userSwiped.id)), {
            users: {
              [user.id]: myFullProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.id, userSwiped.id],
            timestamp: serverTimestamp(),
          });

          nav.navigate("Match", {
            myFullProfile,
            userSwiped,
          });

          return;

        } else {
          //User has swiped as first interaction between the two or didn't get swiped on...
          console.log(
            `You swiped on ${userSwiped.name} (${userSwiped.job})`
          );
          setDoc(
            doc(db, "tinder_profiles", user.id, "right_swipes", userSwiped.id),
            userSwiped
          );

          return;
        }
      }
    );

    //User has swiped as first interaction between the two...
    console.log(`You swiped on ${userSwiped.name} (${userSwiped.job})`);
    setDoc(doc(db, "tinder_profiles", user.id, "right_swipes", userSwiped.id), userSwiped);
  };

  return (
    <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>

      <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between',paddingLeft:12,paddingRight:12,paddingTop:5}} >
        <TouchableOpacity onPress={logOut} >
          <Image style={{height:44,width:44,borderRadius:23}} source={{uri: user.pic}} />
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>nav.navigate('Modal')}>
          <Image source={{uri: 'https://img.uxwing.com/wp-content/themes/uxwing/download/brands-social-media/tinder-icon.png'}} style={{height:68,width:68}} />
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>nav.navigate('Chat')}>
          <Ionicons name='chatbubbles-sharp' size={40} color={'#FF5864'} />
        </TouchableOpacity>
      </View>

      <View style={{flex:1, marginTop:-25, color:'white'}} >
        <Swiper
          ref={swipeRef}
          disableBottomSwipe disableTopSwipe
          // infinite 
          animateCardOpacity
          showSecondCard stackSize={4} 
          onSwipedLeft={(index)=>{
            console.log('Swiped Left');
            swipeLeftHandler(index)
          }}
          onSwipedRight={(index)=>{
            console.log('Swiped Right');
            swipeRightHandler(index)
          }}
          containerStyle={{backgroundColor:'transparent' }}
          cards={profilesState}
          renderCard={(card) => card ? (<View style={{position:'relative', backgroundColor:'#fff2f2',borderRadius:20, height:520 }} >
              {/* <Text>{card.name}</Text> */}
                <Image source={{uri: card.photoUrl}} style={{width:'100%',height:'100%',borderRadius:20,borderTopRightRadius:0}} />

                <View style={ styles.cardShadow} >
                  <View>
                    <Text style={{fontSize:18,fontWeight:'bold'}} >{card.name}</Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={{fontSize:22 , fontWeight:'bold'}} >{card.age}</Text>
                </View>

          </View>) : (
            <View style={[styles.cardShadow2 ,{position:'relative', backgroundColor:'white',borderRadius:20, height:520, justifyContent:'center',alignItems:'center' }]} >
              <Text style={{fontWeight: 500, paddingBottom: 10}} >No More Profiles</Text>
              <Image source={{uri: 'https://links.papareact.com/6gb'}} style={{height:100,width:100}} height={100} width={100} />
            </View>
          ) }
        />
      </View>

      <View style={{flexDirection:'row',justifyContent:'space-evenly',position:'absolute',width:'100%',bottom:20}} >  
          <TouchableOpacity onPress={()=>swipeRef.current.swipeLeft()} style={{alignItems:'center',justifyContent:'center',borderRadius:30, height:60 , width:60, backgroundColor: 'rgba(255,0,0,0.2)'  }} >
            <Entypo name='cross' size={24} color={'red'} />
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>swipeRef.current.swipeRight()} style={{alignItems:'center',justifyContent:'center',borderRadius:30, height:60 , width:60, backgroundColor: 'rgba(0,128,0,0.2)'  }} >
            <Entypo name='heart' size={24} color={'green'} />
          </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor:'#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation:2,
    borderBottomEndRadius:20,
    position:'absolute', bottom: 0, backgroundColor:'white',width:'100%',flexDirection:'row', justifyContent:"space-between", height: 70 , paddingLeft: 20, paddingRight:20, paddingTop: 8
  },
  cardShadow2: {
    shadowColor:'#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation:2,
  }
})