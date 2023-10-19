import React, {memo, useCallback, useEffect, useState} from 'react';

import {ChatData} from '../../Utils/localDB';
import {Invitation} from '../../Utils/localDB';
import {
  changeUserTripStatus,
  notificationUrl,
  userTrips,
} from '../../Utils/Urls';
import API from '../../Utils/helperFunc';
import {updateDataFirebase} from '../../Services/FireBaseRealTImeServices';
import {errorMessage} from '../../Config/NotificationMessage';
import useReduxStore from '../../Hooks/UseReduxStore';
import {loadingFalse, loadingTrue} from '../../Redux/Action/isloadingAction';

const useNotificationScreen = ({params}, {navigate, addListener}) => {
  const [tripNotification, setTripNotification] = useState([]);
  const [notifications, setNotification] = useState(null);

  const {dispatch} = useReduxStore();

  const getUserNotification = async () => {
    const {ok, data} = await API.get(notificationUrl);
    console.log('setNotificationsetNotificationsetNotification', data);
    if (ok) {
      setNotification(data);
    } else errorMessage('an error occured');
  };

  const tripStatus = async (status, id, tripOnnwerID) => {
    const {ok, data} = await API.post(changeUserTripStatus, {status, id});
    if (ok) {
      dispatch(loadingTrue());
      if (status == 1) {
        const {ok} = await updateDataFirebase({
          tripId: id,
          tripOnnwerID,
        });
        if (ok) {
          setTripNotification(data.trips);
          dispatch(loadingFalse());
        } else dispatch(loadingFalse());
      } else {
        setTripNotification(data.trips);
        dispatch(loadingFalse());
      }
    } else {
      dispatch(loadingFalse());
      errorMessage('some thing is wrong');
    }
  };

  const useEffectFuc = () => {
    const event = addListener('focus', getUserNotification);
    return event;
    // params?.sendTo && navigate(params?.sendTo);
  };

  useEffect(useEffectFuc, []);

  return {
    ChatData,
    Invitation,
    tripNotification,
    tripStatus,
    notifications,
    getUserNotification,
  };
};
export default useNotificationScreen;
