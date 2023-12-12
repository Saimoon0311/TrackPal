import React, {memo, useCallback, useState} from 'react';
import {
  View,
  Image,
  FlatList,
  TextInput,
  Platform,
  TouchableOpacity,
  StatusBar,
  Text,
} from 'react-native';

import {
  DemoProfileImage1,
  arrows,
  bgBlurHome,
  dotbar,
  dots,
  from,
  link,
  location,
  logo,
  logo1,
  map,
  staticMap,
  whitebg,
} from '../../Assets';
import {styles} from './styles';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {hp, wp} from '../../Config/responsive';
import useHomeScreen from './useHomeScreen';
import GradientText from '../../Components/GradientText';
import {TextComponent} from '../../Components/TextComponent';
import {Touchable} from '../../Components/Touchable';
import {BlurView, VibrancyView} from '@react-native-community/blur';
import ThemeButton from '../../Components/ThemeButton';
import Modal from 'react-native-modal';
import SelectLocationModal from './SelectLocationModal';
import CreateGroupModal from './CreateGroupModal';
import {CircleImage} from '../../Components/CircleImage';
import StartTripModal from './StartTripModal';
import TripCreatedModal from './TripCreatedModal';
import TripTypeSelectModal from './TripTypeSelectModal';
import GroupMemberSelectModal from './GroupMemberSelectModal';
import {AlertDesign} from '../../Components/AlertDesign';
import {Colors} from '../../Theme/Variables';

const HomeScreen = ({navigation}) => {
  const {
    frequentTrips,
    isModalVisible,
    locationInput,
    iscreateModal,
    GroupInput,
    isTripModalVisible,
    destinationInput,
    isTripCreated,
    currentLocation,
    isTripStarted,
    isTripSelectModal,
    selectTripType,
    destinationInputRef,
    allUser,
    groupMembers,
    addMembersToGroup,
    updateInputState,
    getlocation,
    updateState,
    openNextModal,
    openPrevModal,
    isGroupMemberSelectModal,
    istooltipModal,
    remember,
    rememberValue,
    keyboardStatus,
    updateError,
    createTripFun,
    uploadFromGalary,
    getUser,
    tripImage,
    clearImage,
    toggleAlert,
    alert,
    userData,
  } = useHomeScreen(navigation);
  const [showTip, setTip] = useState(false);

  const renderItem = useCallback(({item, index}) => {
    return (
      <Touchable
        style={styles.trips}
        //  onPress={() => navigation.navigate('EditPhoneNumberScreen')}
      >
        {/* <Image source={item?.image} /> */}
        <CircleImage image={item?.image} />
        <GradientText style={styles.heading} GradientAlignment={0.6}>
          {item?.name}
        </GradientText>
      </Touchable>
    );
  });
  return (
    <View style={styles.homeScreenStyle}>
      <Image source={logo1} style={styles.logo} />
      <View style={styles.mapArea}>
        <View style={styles.groupInfoMain}>
          {Platform.OS == 'ios' ? (
            <BlurView
              style={styles.absolute}
              blurType="light"
              blurAmount={10}
            />
          ) : (
            <Image
              style={{...styles.absolute, opacity: 0.8}}
              source={bgBlurHome}
              blurRadius={0.5}
            />
          )}
          <CircleImage image={DemoProfileImage1} style={styles.groupLogo} />

          <View style={styles.groupDesc}>
            <Text style={styles.groupName}>Business Meets</Text>
            <Text style={styles.groupMember}>15 members</Text>
          </View>
          <Touchable style={styles.groupLink}>
            <Image source={link} style={styles.externalLinks} />
          </Touchable>
        </View>
        <MapView
          // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.staticMapImg}
          region={{
            latitude: currentLocation?.coords?.latitude,
            longitude: currentLocation?.coords?.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}></MapView>
        {/* <Image source={staticMap} style={styles.staticMapImg} /> */}
      </View>
      {/* <Tooltip
        popover={<Text>Change here</Text>}
        withOverlay={false}
        skipAndroidStatusBar={true}>
        <Text>asd</Text>
      </Tooltip> */}
      <TextComponent text={'Frequent Trips'} styles={styles.TripsHeading} />

      <FlatList
        refreshing={false}
        data={frequentTrips}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal={true}
        contentContainerStyle={{
          paddingLeft: wp('4'),
        }}
      />
      <View style={styles.btn}>
        <ThemeButton
          title={'Create New Trip'}
          onPress={() => {
            if (userData.is_verified == 0) toggleAlert();
            else updateState({isTripSelectModal: true});
          }}
          style={styles.tripBtn}
        />
        {/* <ThemeButton
          title={'asd'}
          onPress={CreateGroup}
          style={styles.tripBtn}
        /> */}
        <TripTypeSelectModal
          {...{
            isTripSelectModal,
            istooltipModal,
            toggleNextModal: () => {
              openNextModal('isTripSelectModal', 'isGroupMemberSelectModal');
            },
            onBackPress: () => {
              updateState({isTripSelectModal: false});
            },
            extraData: {
              selectTripType,
              updateState,
            },
          }}
        />
        <GroupMemberSelectModal
          {...{
            isGroupMemberSelectModal,
            toggleNextModal: () => {
              openNextModal('isGroupMemberSelectModal', 'isModalVisible');
            },
            onBackPress: () => {
              openPrevModal('isGroupMemberSelectModal', 'isTripSelectModal');
            },
            extraData: {
              selectTripType,
              remember,
              rememberValue,
              keyboardStatus,
              allUser,
              addMembersToGroup,
              groupMembers,
              message: updateError,
              getUser,
            },
          }}
        />
        <SelectLocationModal
          {...{
            isModalVisible,
            toggleLocationModal: () => {
              openNextModal('isModalVisible', 'iscreateModal');
            },
            onBackPress: () => {
              openPrevModal('isModalVisible', 'isGroupMemberSelectModal');
            },
            extraData: {
              selectTripType,
            },
            extraData: {
              selectTripType,
              locationInput,
              destinationInput,
              getlocation,
              updateInputState,
              destinationInputRef,
              message: updateError,
            },
          }}
        />
        <CreateGroupModal
          {...{
            iscreateModal,
            CreateGroup: () => {
              openNextModal(
                'iscreateModal',
                'isTripModalVisible',
                // {
                //   openNextModal,
                //   "isTripCreated",
                //   "isTripModalVisible"
                // }
              );
              // setTimeout(() => {
              //   openNextModal('isTripCreated', 'isTripModalVisible');
              // }, 1000);
            },
            onBackPress: () => {
              openPrevModal('iscreateModal', 'isModalVisible');
            },
            extraData: {
              selectTripType,
              GroupInput,
              updateInputState,
              uploadFromGalary,
              tripImage,
              message: updateError,
              clearImage,
            },
          }}
        />
        {/* <TripCreatedModal
          {...{
            isTripCreated,
            TripCreatedToggle: () => {
              openNextModal('isTripCreated', 'isTripModalVisible');
            },
            onBackPress: () => {
              openPrevModal('isTripCreated', 'iscreateModal');
            },
            extraData: {
              selectTripType,
              message: updateError,
            },
          }}
        /> */}
        <StartTripModal
          {...{
            isTripModalVisible,
            StartTripToggle: () => {
              createTripFun();
            },
            onBackPress: () => {
              openPrevModal('isTripModalVisible', 'iscreateModal');
            },
            extraData: {
              selectTripType,
              locationInput,
              destinationInput,
              getlocation,
              updateInputState,
              destinationInputRef,
              message: updateError,
              groupMembers,
              GroupInput,
              tripImage,
            },
          }}
        />
        <TripCreatedModal
          {...{
            isTripCreated: isTripStarted,
            title: 'Trip Created',
            TripCreatedToggle: () => {
              updateState({isTripStarted: false});
            },
            onBackPress: () => {},
            extraData: {
              selectTripType,
              message: updateError,
            },
          }}
        />
      </View>
      <AlertDesign
        isVisible={alert}
        cancelText={'Cancel'}
        confirmText={'Verify'}
        message={
          'You must verify your number first before creating the a trip.'
        }
        title={'Warning Alert'}
        onCancel={toggleAlert}
        onConfirm={() => {
          toggleAlert();
          navigation.navigate('EditPhoneNumberScreen');
        }}
        confirmButtonColor={Colors.primaryColor}
        msgStyle={{textAlign: 'center'}}
      />
    </View>
  );
};

export default memo(HomeScreen);
