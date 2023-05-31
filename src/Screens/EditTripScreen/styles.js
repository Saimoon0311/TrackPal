import {StyleSheet} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

export const styles = StyleSheet.create({
  tips: {
    paddingHorizontal: wp('3.5'),
    backgroundColor: Colors.white,
  },
  headerStyle: {
    paddingHorizontal: wp('0'),
  },
  hdTitle: {
    fontWeight: '600',
  },
  rowBack: {
    // width: '100%',
    // marginBottom: 10,
    // flex: 1,
    borderRadius: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  backRightBtn: {
    // textAlign: 'left',
    // alignItems: 'center',
  },
  backRightBtnLeft: {
    backgroundColor: '#EA4335',
    flex: 1,
    height: hp('22.4'),
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingTop: hp('9.5'),
    paddingLeft: wp('6'),
  },
  backRightBtnRight: {
    backgroundColor: '#1877F2',
    flex: 1,
    height: hp('22.4'),
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'flex-end',
    paddingTop: hp('9.5'),
    paddingRight: wp('6'),
  },
  groupName: {
    fontSize: hp('2.3'),
    color: Colors.black,
    fontWeight: '600',
    marginBottom: hp('1'),
  },
  groupMember: {
    fontSize: hp('1.8'),
    marginTop: hp('-.4'),
    color: Colors.gray,
  },
  groupActive: {
    fontSize: hp('1.8'),
    // marginTop: hp(''),
    color: Colors.gray,
  },
  groupDesc: {
    flex: 1,
    marginLeft: wp('3'),
  },
  activeCardStyle: {
    // flexDirection: 'row',
    backgroundColor: Colors.avtiveCard,
    paddingHorizontal: wp('1'),
    paddingVertical: hp('.6'),
    marginBottom: hp('3'),
    borderRadius: 10,
    flex: 1,
  },
  activeCardMain: {
    backgroundColor: Colors.avtiveCard,
    paddingHorizontal: wp('1'),
    paddingVertical: hp('.6'),
    marginBottom: hp('3'),
    borderRadius: 8,
    flexDirection: 'row',
  },
  cardLeft: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: wp('3'),
    paddingVertical: hp('3'),
  },
  TripBtn: {
    width: wp('27'),
    textAlign: 'center',
    height: hp('5'),
    justifyContent: 'center',
    marginHorizontal: wp('3'),
    marginBottom: hp('-1.5'),
    marginTop: hp('-1.2'),
  },
  TripBtnText: {
    fontWeight: '400',
  },
});
