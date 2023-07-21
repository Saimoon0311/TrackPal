// import {firebase} from '@react-native-firebase/database';
import {firebaseDataBaseURL} from '../Utils/Urls';
import {successMessage} from '../Config/NotificationMessage';
import {store} from '../Redux/Reducer';
import Geolocation from '@react-native-community/geolocation';
import firestore from '@react-native-firebase/firestore';
import {loadingFalse, loadingTrue} from '../Redux/Action/isloadingAction';
import {types} from '../Redux/types';

export const reference = firestore().collection('Trips');

const createTripObj = async data => {
  const {
    Auth: {userData},
  } = store.getState('Auth');
  const {tripId, members, destination, startPoint, tripType, TripName} = data;
  console.log('membersmembersmembersmembersmembersmembers', members);
  try {
    const membersData = members.map(res => ({
      id: res.id,
      details: {id: res.id, email: res.email},
      location: {
        coords: {},
        description: '',
      },
      chat: [],
    }));

    const fire = reference
      .doc(`${userData.id}`)
      .collection(`"${tripId}"`)
      .doc(`${userData.id}`);
    // .doc();
    // const fire = reference.doc(`/Trips/${userData.id}/${tripId}`);

    await fire.set({
      tripCreator: {
        email: userData.email,
        gender: userData.gender || '',
        id: userData.id,
        name: userData.name || '',
        phone: userData.phone || '',
        image: userData.profile_image || '',
      },
      destination,
      startPoint,
      tripType,
      TripName,
      members: membersData,
    });
  } catch (error) {
    console.log('Error creating trip:', error);
  }
};

const updateDataFirebase = async data => {
  const {
    Auth: {userData},
  } = store.getState('Auth');
  const {tripId, tripOnnwerID} = data;

  try {
    const fire = reference.doc(`${tripOnnwerID}`).collection(`"${tripId}"`);

    const firebaseGet = await fire.doc(`${tripOnnwerID}`).get();

    const wholeObj = firebaseGet.data();

    // Find the index of the object with id 6 in the members array
    const index = wholeObj.members.findIndex(
      member => member.id == userData.id,
    );
    wholeObj.members[index] = {...wholeObj.members[index], status: true};

    await fire.doc(`${tripOnnwerID}`).update(wholeObj);

    return {ok: true, result: null};
  } catch (error) {
    console.log('Error creating trip:', error);
    return {ok: false, result: error};
  }
};

const getLocationName = async (latitude, longitude) => {
  const geocodingAPI = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBlHyVz90xxc4lkp-1jGq68Ypmgnw4WCFE`;

  // Replace "YOUR_API_KEY" with your actual Google Maps Geocoding API key

  const res = await fetch(geocodingAPI);
  const response = await res.json();

  if (response.results.length > 0) {
    const locationName = response.results[0].formatted_address;
    return locationName;
  }
};
var locationData;

const getCurrentLocation = async () => {
  Geolocation.getCurrentPosition(async info => {
    const locationName = await getLocationName(
      info.coords.latitude,
      info.coords.longitude,
    );
    locationData = {
      coords: {
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      },
      description: locationName,
    };
    console.log('sjkbvjksbvjbsvsd', locationData);
  });
  // const coords = Geolocation.getCurrentPosition();
  // console.lg('jksbjksbdjkbsd', coords);
  // const locationName = await getLocationName(coords.latitude, coords.longitude);
  // return {
  //   coords: {
  //     latitude,
  //     longitude,
  //   },
  //   description: locationName,
  // };
};

const shareLocationFirebase = async () => {
  const {
    islocationShare: {islocationShare, tripId, tripOwnerID},
  } = store.getState('islocationShare');

  if (islocationShare) {
    await firebaseSubON({tripId, tripOnnwerID: tripOwnerID});
  }
};

// shareLocationFirebase();

const updateLocationONfire = async data => {
  const {
    Auth: {userData},
  } = store.getState('Auth');
  const {tripId, tripOnnwerID} = data;

  try {
    store.dispatch({
      type: types.isLocationTrue,
      payload: {
        tripId,
        tripOwnerID: tripOnnwerID,
      },
    });

    await getCurrentLocation();
    // const locationData = await getCurrentLocation();
    setTimeout(async () => {
      const fire = reference.doc(`${tripOnnwerID}`).collection(`"${tripId}"`);

      const firebaseGet = await fire.doc(`${tripOnnwerID}`).get();

      const wholeObj = firebaseGet.data();

      // Find the index of the object with id 6 in the members array
      const index = wholeObj.members.findIndex(
        member => member.id == userData.id,
      );
      wholeObj.members[index] = {...wholeObj.members[index], ...locationData};

      await fire.doc(`${tripOnnwerID}`).update(wholeObj);
      console.log(
        'locationDatalocationDatalocationDatalocationData',
        locationData,
      );
    }, 1000);

    return {ok: true, result: null};
  } catch (error) {
    console.log('Error creating trip:', error);
    return {ok: false, result: error};
  }
};

const getFirebaseData = async data => {
  store.dispatch(loadingTrue());
  const {tripId, tripOnnwerID} = data;
  try {
    const fire = reference.doc(`${tripOnnwerID}`).collection(`"${tripId}"`);

    const firebaseGet = await fire.doc(`${tripOnnwerID}`).get();

    const wholeObj = firebaseGet.data();

    console.log('wholeObjwholeObjwholeObjwholeObj', wholeObj);
    // Find the index of the object with id 6 in the members array
    const filterData = wholeObj.members.filter(
      member => member.status == true && member?.coords != null && true,
    );
    store.dispatch(loadingFalse());
    // wholeObj.members[index] = {...wholeObj.members[index], status: true};
    return {ok: true, data: filterData};
  } catch (error) {
    store.dispatch(loadingFalse());
    return {ok: false, data: error};
  }
};

const sendDataToFIrebase = async data => {
  const {tripOnnwerID, tripId, msgObj, userData} = data;
  console.log('uyserSTchvschv sc', userData);
  try {
    const fire = reference.doc(`${tripOnnwerID}`).collection(`"${tripId}"`);

    const firebaseGet = await fire.doc(`${tripOnnwerID}`).get();

    const wholeObj = firebaseGet.data();

    // Find the index of the object with id 6 in the members array
    const index = wholeObj.members.findIndex(
      member => member.id == userData.id,
    );

    console.log(
      'wholeObj.member[index].chatwholeObj.member[index].chatwholeObj.member[index].chatwholeObj.member[index].chat',
      wholeObj.members,
    );

    wholeObj.members[index] = {
      ...wholeObj.members[index],
      chat: [...wholeObj.members[index].chat, msgObj],
    };

    await fire.doc(`${tripOnnwerID}`).update(wholeObj);

    return {ok: true, data: null};
  } catch (error) {
    return {ok: false, data: error};
  }
};

// Geolocation.watchPosition

// const updateDataFirebase = async data => {
//   const {
//     Auth: {userData},
//   } = store.getState('Auth');
//   const {tripId, tripOwnerId} = data;
//   console.log('tripId, tripOwnerId', tripId, tripOwnerId);
//   try {
//     const fire = reference.ref(
//       `Trips/${tripOwnerId}/${tripId}/members/${userData.id}`,
//     );
//     console.log('userData, fire', userData, fire);
//     const snapshot = await fire.on('value');
//     const existingObject = snapshot.val();
//     console.log('existingObject, snapshot', existingObject, snapshot);
//     const val = Object.values(existingObject)[0];
//     await fire.set({...val, status: true});
//     // await firebaseSubON(data);

//     return {ok: true, result: null};
//   } catch (error) {
//     console.log('Error updating data:', error);
//     return {ok: false, result: error};
//   }
// };

var filte = [];

const getFirebaseUpdatedData = async data => {
  const {tripId, tripOnnwerID} = data;

  try {
    const fire = reference.doc(`${tripOnnwerID}`).collection(`"${tripId}"`);

    fire.onSnapshot(snapshot => {
      console.log('snapshotsnapshotsnapshotsnapshotsnapshot', snapshot);
      const allMsg = snapshot.docs.map(item => {
        return {...item._data};
      });
      // setMessages(allMsg);
      // const wholeObj = snapshot.data();

      console.log('wholesdfsdfsdfsdfdsfdsdsObj', allMsg);

      if (allMsg.length > 0) {
        filte = allMsg?.members?.filter(
          member => member.status === true && member.coords != null && true,
        );
        // console.log('filterData', filterData);

        // Do whatever you need with the filtered data

        // Example: Update state or call a function with the filtered data
        // updateState(filterData);
        // processFilteredData(filterData);
      }
    });

    // Return a result or handle success

    return {ok: true, data: filte};
  } catch (error) {
    // Handle error
    return {ok: false, data: error};
  }
};

const firebaseSubON = async data => {
  const {
    Auth: {userData},
  } = store.getState('Auth');
  const {tripId, tripOnnwerID} = data;
  try {
    const fire = reference.doc(`${tripOnnwerID}`).collection(`"${tripId}"`);

    const firebaseGet = await fire.doc(`${tripOnnwerID}`).get();

    const wholeObj = firebaseGet.data();

    // Find the index of the object with id 6 in the members array
    const index = wholeObj.members.findIndex(
      member => member.id == userData.id,
    );
    console.log('wholeObjwholeObjwholeObjwholeObjwholeObjwholeObj', wholeObj);
    Geolocation.watchPosition(
      async position => {
        const {latitude, longitude} = position.coords;

        wholeObj.members[index] = {
          ...wholeObj.members[index],
          coords: {
            latitude,
            longitude,
          },
        };

        await fire.doc(`${tripOnnwerID}`).update(wholeObj);

        console.log(
          'Error creating tripsssssssssssssssss:',
          latitude,
          longitude,
        );
      },
      error => {
        return {ok: false, data: error};
      },
      {enableHighAccuracy: true},
    );

    return {ok: true, data: null};
  } catch (error) {
    console.log('Error creating trip: firebaseSubON', error);
    return {ok: false, data: error};
  }
};

export {
  createTripObj,
  updateDataFirebase,
  firebaseSubON,
  updateLocationONfire,
  getFirebaseData,
  getCurrentLocation,
  getFirebaseUpdatedData,
  shareLocationFirebase,
  sendDataToFIrebase,
};