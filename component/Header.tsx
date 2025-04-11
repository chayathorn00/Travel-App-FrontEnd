import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import Close from "../assets/close.svg";
import IcNext from "../assets/ic_next.svg";
import IcBack from "../assets/ic_back.svg";
import { FontFamily } from "../GlobalStyles";
import { StatusBar } from 'expo-status-bar';

import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
interface Props {
  page: string;
  isClose?: boolean;
  next?: () => void;
  previous?: () => void;
}
const Header: React.FC<Props> = ({ page, isClose = false, next, previous }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {isClose && (
        <TouchableOpacity
          onPress={() => navigation.navigate("HomePage")}
          style={styles.closeIcon}
        >
          <Close width={60} height={24} />
        </TouchableOpacity>
      )}
      {previous && (
        <TouchableOpacity onPress={previous} style={styles.backBtn}>
          <IcBack width={60} height={24} />
        </TouchableOpacity>
      )}
      <Text style={styles.text}>{`${page} จาก 4`}</Text>
      {next ? (
        <TouchableOpacity onPress={next} style={styles.nextBtn}>
          <IcNext width={60} height={20} />
        </TouchableOpacity>
      ) : (
        <View style={styles.empty} />
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ccc",
    paddingBottom: 10,
    paddingTop: 48,
    marginBottom: 40,
    width: "100%",
  },
  backBtn: {
    flex: 1,
    paddingLeft: 8,
  },
  empty: {
    flex: 1,
  },
  nextBtn: {
    flex: 1,
    alignItems: "flex-end",
    paddingRight: 8,
  },
  closeIcon: {
    flex: 1,
    paddingLeft: 8,
  },
  text: {
    flex: 1,
    textAlign: "center",
    fontFamily: FontFamily.KanitRegular,
    fontSize: 20,
    top: 1,
  },
});
