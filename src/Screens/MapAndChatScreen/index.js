import React, {memo, useState} from 'react';
import {View, Text, Image, TouchableOpacity, Pressable} from 'react-native';
import {styles} from './styles';
import CustomHeader from '../../Components/Header';
import {arrowBack} from '../../Assets';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import GradientText from '../../Components/GradientText';
import {Colors} from '../../Theme/Variables';
import LinearGradient from 'react-native-linear-gradient';
import {hp, wp} from '../../Config/responsive';
import * as Screens from '../index';
import useReduxStore from '../../Hooks/UseReduxStore';
import useMapAndChatScreen from './useMapAndChatScreen';
import {types} from '../../Redux/types';
import {notificationStatusFunc} from '../ChatScreen/useChatScreen';
import {TextComponent} from '../../Components/TextComponent';

const NewMsgText = () => {
  return (
    <GradientText styles={{fontSize: hp('1.5')}} GradientAlignment={0.6}>
      {' '}
      ( new message )
    </GradientText>
  );
};

function MyTabBar({state, descriptors, navigation, msgCount}) {
  return (
    <View style={styles.mainTabStyle}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            console.log('on pressssss', route.name);
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.TabStyle}>
            {isFocused == false && (
              <View style={{flexDirection: 'row'}}>
                <Text style={{...styles.text, color: 'black'}}>{label}</Text>
                {msgCount > 0 ? <NewMsgText /> : null}
              </View>
            )}
            {isFocused == true && (
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={[Colors.themeColorDark, Colors.themeColorLight]}
                style={styles.Gradientbtn}>
                <Text style={styles.text}>{label}</Text>
              </LinearGradient>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();
// const Tab = createBottomTabNavigator();

const MapAndChatScreen = ({navigation, route}) => {
  console.log(
    '{route?.params?.asdasdasdasdasdasdasdasitem?',
    route?.params?.item,
  );
  const {checkLenght, dispatch, userData, clearNotCount} = useMapAndChatScreen(
    route?.params?.item,
  );
  const pivotObj = route?.params?.item.users.find(
    user => user.id === userData.id,
  );
  const [msgCount, setMsgCount] = useState(
    pivotObj.pivot.msg_count != null
      ? pivotObj.pivot.msg_count + checkLenght
      : checkLenght,
  );
  // var msgCount =
  //   pivotObj.pivot.msg_count != null
  //     ? pivotObj.pivot.msg_count + checkLenght
  //     : checkLenght;
  const length = checkLenght;

  const y = '( new message )';

  // Applying styles for the console output with color #92278F (purple)
  console.log('\x1b[35m%s\x1b[0m', y);

  console.log('<NewMsgTextasdasdasdakey /> ', NewMsgText().key);
  return (
    <View style={styles.tabsMain}>
      <CustomHeader
        arrowBackIcon={arrowBack}
        backText={'Back'}
        style={styles.headerStyle}
        titleStyle={styles.hdTitle}
        headerTitle={route?.params?.item?.name}
        goBack={navigation.goBack}
        numberOfLines={1}
      />

      <Tab.Navigator
        initialRouteName={'Map'}
        // initialRouteName={route?.params?.item?.isRoute ? `Chat` : 'Map'}
        tabBarOptions={{
          headerShown: false,
        }}
        tabBar={props => <MyTabBar {...props} msgCount={msgCount} />}>
        <Tab.Screen
          name="Map"
          component={Screens.MapScreen}
          // options={{headerShown: false}}
          initialParams={route}
        />
        <Tab.Screen
          name={`Chat`}
          component={Screens.ChatScreen}
          options={{
            // title: `Chat ${msgCount > 0 ? ('\x1b[35m%s\x1b[0m', y) : ''}`,
            headerTitle: () => {
              <TextComponent>
                Chat {msgCount > 0 ? <NewMsgText /> : ''}
              </TextComponent>;
            },
          }}
          initialParams={route}
          listeners={{
            focus: () => {
              // if (route?.params?.item?.isRoute) {
              setMsgCount(0);
              clearNotCount();
              dispatch({
                type: types.clearNofityObjByID,
                payload: route?.params?.item.id,
              });

              // }
              // navigation.navigate('Chat', route);
              // setTimeout(() => {
              //   if (!route?.params?.item?.isRoute) {
              //   dispatch({
              //     type: types.clearNofityObjByID,
              //     payload: route?.params?.item.id,
              //   });
              //   }
              // }, 1000);
              notificationStatusFunc(0);
            },
            blur: () => {
              console.log('blur blru blrur hrbrirbibrib');
              notificationStatusFunc(1);
              clearNotCount();
            },
            beforeRemove: () => {
              console.log('kjsbdjkbsdjkbfkjsdbfbsdbfbsdkjfbjksd');
            },
          }}
        />
      </Tab.Navigator>
    </View>
  );
};
export default memo(MapAndChatScreen);
