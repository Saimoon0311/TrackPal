import React, {useCallback} from 'react';
import {View, Text, TouchableOpacity, Image, Platform} from 'react-native';
import {CircleImage} from '../../Components/CircleImage';
import useEditTripScreen from './useEditTripScreen';
import {TextComponent} from '../../Components/TextComponent';
import {FirstCharacterComponent} from '../../Components/FirstCharacterComponent';
import ThemeButton from '../../Components/ThemeButton';
import {styles} from './styles';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {SwipeListView} from 'react-native-swipe-list-view';
import {loaderView} from './MyTrips';
import TripCreatedModal from '../HomeScreen/TripCreatedModal';
import {EmptyViewComp} from '../../Components/EmptyViewComp';
import {hp, wp} from '../../Config/responsive';
import {cardediticon, greenCircle, leftArrow, trash} from '../../Assets';
import {requestPermission} from '../../Services/FireBaseRealTImeServices';
import InactiveBtn from '../../Components/InactiveBtn';
import EditTripModal from './editTripModal';
import GroupMemberSelectModal from './GroupMemberSelectModal';
import {imageUrl} from '../../Utils/Urls';

{
  /* <View style={styles.activeCardMain(status[item.owner_running_status])}>
<View style={styles.activeCardStyle}>
  <View style={styles.cardLeft}>
    {item?.image ? (
      <CircleImage image={item?.image} style={styles.groupLogo} />
    ) : (
      <FirstCharacterComponent
        indexNumber={color}
        text={item?.name}
      />
    )}
    <View style={styles.groupDesc}>
      <TextComponent
        numberOfLines={1}
        text={item?.name}
        styles={styles.groupName}
      />
      <TextComponent
        text={'Total members ' + item?.total_members}
        styles={styles.groupMember}
      />
      <TextComponent
        text={status[item.owner_running_status]}
        styles={styles.groupActive(status[item.owner_running_status])}
      />
    </View>
  </View>
  {userData.id == item.user_id &&
    (item?.owner_running_status == 0 ||
    item?.owner_running_status == 2 ? (
      <ThemeButton
        title={'Start Trip'}
        textStyle={styles.TripBtnText}
        btnStyle={styles.TripBtn}
        onPress={async () => {
          const result = await requestPermission();
          if (result) updateState(1, item.id, index, true);
        }}
      />
    ) : (
      <ThemeButton
        title={'End Trip'}
        textStyle={styles.TripBtnText}
        btnStyle={styles.TripBtn}
        onPress={() => {
          updateState(2, item.id, index);
        }}
      />
    ))}
</View>
{userData.id == item.user_id && (
  <TouchableOpacity
    onPress={() =>
      item?.owner_running_status == 1 &&
      navigation.navigate('MapAndChatScreen', {
        item: {...perssonalTrips[index], owner: true},
      })
    }>
    <Image
      style={{
        height: Platform.OS == 'ios' ? hp('18.2') : hp('22.1'),
        width: wp('14'),
        opacity: item?.owner_running_status == 1 ? 1 : 0,
      }}
      resizeMode="contain"
      source={leftArrow}
    />
  </TouchableOpacity>
)}
</View> */
}

const PersonalTrips = ({navigation, route}) => {
  const {
    updateState,
    perssonalTrips,
    tripsCard,
    isTripCreated,
    userData,
    changeMemberStatusGroup,
    checkLenght,
    deleteTrip,
    openInfoModal,
    infoModal,
    editTrip,
    editTripData,
    updateModalsState,
    keyboardType,
    uploadFromGalary,
    tripPicture,
    onCloseModal,
    allUser,
    userModal,
    addMembersToGroup,
    getUser,
    filterIDSfromArry,
    updateTripData,
    updateError,
    tripMemebers,
    tripName,
  } = useEditTripScreen(navigation, route);

  const renderOwnerItem = useCallback(
    ({item, index}) => {
      var color =
        index.toString().length === 1
          ? index
          : index.toString().split('').pop();
      const status = {
        0: 'Inactive',
        1: 'Active',
        2: 'Inactive',
      };
      const pivotObj = item.users.find(user => user.id === userData.id);
      const msgCount =
        pivotObj.pivot.msg_count != null
          ? pivotObj.pivot.msg_count + checkLenght(item.id)
          : checkLenght(item.id);
      return (
        <View style={styles.activeCardMain(item?.status)}>
          <View style={styles.activeCardStyle}>
            <View style={styles.cardLeft}>
              {item?.image ? (
                <View>
                  <CircleImage image={imageUrl(item?.image)} uri={true} />
                </View>
              ) : (
                <FirstCharacterComponent
                  indexNumber={color}
                  text={item?.name}
                />
              )}
              <View style={styles.groupDesc}>
                <TextComponent text={item?.name} styles={styles.groupName} />
                <View style={styles.circleView}>
                  {item?.status == 'Active' && (
                    <Image
                      source={greenCircle}
                      style={{width: wp('2')}}
                      resizeMode="contain"
                    />
                  )}
                  <TextComponent
                    text={item?.status}
                    styles={styles.groupActive(item?.status)}
                  />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <TextComponent
                    text={item?.total_members + ' members'}
                    styles={styles.groupMember}
                  />
                  {msgCount > 0 && (
                    <TextComponent
                      text={` ( new messages )`}
                      // text={` ( ${msgCount} messages )`}
                      // text={` ( ${checkLenght(item.id)} messages )`}
                      // text={'Total members ' + item?.total_members}
                      styles={styles.messageNumber}
                    />
                  )}
                </View>
              </View>
            </View>
            {userData.id == item.user_id &&
              (item?.owner_running_status == 0 ||
              item?.owner_running_status == 2 ? (
                <ThemeButton
                  title={'Start Trip'}
                  textStyle={styles.TripBtnText}
                  btnStyle={styles.TripBtn}
                  onPress={async () => {
                    const result = await requestPermission();
                    if (result) updateState(1, item.id, index, true);
                  }}
                />
              ) : (
                <ThemeButton
                  title={'End Trip'}
                  textStyle={styles.TripBtnText}
                  btnStyle={styles.TripBtn}
                  onPress={() => {
                    updateState(2, item.id, index);
                  }}
                />
              ))}
            {/* {item?.owner_running_status == 0 ||
            item?.owner_running_status == 2 ? (
              <InactiveBtn
                style={{width: wp('36')}}
                title={'Trip on Pending'}
              />
            ) : item?.pivot.member_running_status == 0 ||
              item?.pivot?.member_running_status == 2 ? (
              <ThemeButton
                title={'Start Trip'}
                textStyle={styles.TripBtnText}
                btnStyle={styles.TripBtn}
                onPress={async () => {
                  const result = await requestPermission();
                  if (result)
                    changeMemberStatusGroup(
                      1,
                      item.id,
                      item?.trip_owner?.id,
                      index,
                    );
                }}
              />
            ) : (
              <ThemeButton
                title={'End Trip'}
                textStyle={styles.TripBtnText}
                btnStyle={styles.TripBtn}
                onPress={() => {
                  changeMemberStatusGroup(
                    2,
                    item.id,
                    item?.trip_owner?.id,
                    index,
                  );
                }}
              />
            )} */}
          </View>
          {userData.id == item.user_id && (
            <TouchableOpacity
              disabled={item?.owner_running_status == 1 ? false : true}
              onPress={() =>
                item?.owner_running_status == 1 &&
                navigation.navigate('MapAndChatScreen', {
                  item: {...perssonalTrips[index]},
                })
              }>
              <Image
                style={{
                  height: Platform.OS == 'ios' ? hp('18.2') : hp('22.1'),
                  width: wp('14'),
                  opacity: item?.owner_running_status == 1 ? 1 : 0,
                }}
                resizeMode="contain"
                source={leftArrow}
              />
            </TouchableOpacity>
          )}
        </View>
      );
    },
    [perssonalTrips],
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => deleteTrip(data?.item?.user_id, data.item.id)}>
        <Image source={trash} style={styles.trachIcon} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => openInfoModal(data.item)}>
        <Image source={cardediticon} style={styles.editIcon} />
      </TouchableOpacity>
    </View>
  );
  const onRowOpen = (rowKey, rowMap) => {
    setTimeout(() => {
      rowMap[rowKey]?.closeRow();
    }, 2000);
  };
  const noData = Boolean(perssonalTrips != null && perssonalTrips.length == 0)
    ? {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('0'),
      }
    : {};

  return (
    <View
      style={{
        marginTop: hp('3'),
        height: '100%',
        flex: 1,
        ...noData,
      }}>
      {infoModal && (
        <EditTripModal
          isModalVisible={infoModal}
          toggleModal={onCloseModal}
          tripData={editTripData}
          userData={userData}
          keyboardType={keyboardType}
          uploadFromGalary={uploadFromGalary}
          tripPicture={tripPicture}
          tripMemebers={tripMemebers}
          tripName={tripName}
          changeName={e => updateModalsState({tripName: e})}
          updateTripData={updateTripData}
          updateError={updateError}
          openMembersModal={() => {
            console.log(
              'editTripData.userseditTripData.users',
              editTripData.users,
            );
            updateModalsState({
              tripMemebers: editTripData.users,
              infoModal: false,
            });
            setTimeout(() => {
              updateModalsState({userModal: true});
            }, 100);
          }}
        />
      )}
      {userModal && (
        <GroupMemberSelectModal
          {...{
            isGroupMemberSelectModal: userModal,
            toggleNextModal: () => {
              updateModalsState({
                editTripData: {...editTripData, users: tripMemebers},
              });
              // openNextModal('isGroupMemberSelectModal', 'isModalVisible');
            },
            onBackPress: () => {
              updateModalsState({userModal: false});
              setTimeout(() => {
                updateModalsState({infoModal: true});
              }, 100);
            },
            extraData: {
              keyboardStatus: keyboardType,
              allUser,
              addMembersToGroup,
              groupMembers: tripMemebers,
              message: 'updateError',
              getUser,
            },
          }}
        />
      )}
      {perssonalTrips == null && (
        <SkeletonPlaceholder borderRadius={4}>
          {loaderView()}
          {loaderView()}
          {loaderView()}
          {loaderView()}
        </SkeletonPlaceholder>
      )}
      {perssonalTrips != null && perssonalTrips.length > 0 ? (
        <>
          <SwipeListView
            useFlatList={true}
            data={perssonalTrips}
            // disableRightSwipe={true}
            renderItem={renderOwnerItem}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={70}
            rightOpenValue={-70}
            previewRowKey={'0'}
            previewOpenValue={0}
            previewOpenDelay={3000}
            onRowOpen={onRowOpen}
            scrollEnabled
            refreshing={false}
            onRefresh={tripsCard}
            ListEmptyComponent={<EmptyViewComp onRefresh={tripsCard} />}
            showsVerticalScrollIndicator={false}
            style={{height: '100%'}}
          />
          <TripCreatedModal
            title={'Trip started'}
            isTripCreated={isTripCreated}
          />
        </>
      ) : (
        perssonalTrips != null &&
        perssonalTrips.length == 0 && (
          <View>
            <EmptyViewComp
              onRefresh={tripsCard}
              refreshStyle={styles.refresh}
            />
          </View>
        )
      )}
    </View>
  );
};

export default React.memo(PersonalTrips);
