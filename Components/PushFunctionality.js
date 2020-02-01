import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Axios from 'axios';
import {AsyncStorage} from 'react-native';

// const PUSH_ENDPOINT = 'https://your-server.com/users/push-token';

export default async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return;
  }

  let passenger_id = await AsyncStorage.getItem('passenger_id');
  let token = await AsyncStorage.getItem('token');

  // Get the token that uniquely identifies this device
  let ExpoToken = await Notifications.getExpoPushTokenAsync();
  // POST the token to your backend server from where you can retrieve it to send push notifications.
  Axios.post('passenger/push_token',{
    passenger_id:passenger_id,
    token:token,
    expo_token:ExpoToken,
  }).then(function(response){
    if(!response.data.is_successful){
    }
    else {
    }
  }).catch(function(e){
  })
}
