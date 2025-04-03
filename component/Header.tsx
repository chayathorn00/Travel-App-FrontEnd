import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Close from "../assets/close.svg";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Color, FontFamily, FontSize } from "../GlobalStyles";
interface Props {
  page: string;
}
const Header: React.FC<Props> = ({ page }) => {
    const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=> navigation.navigate("HomePage")} style={styles.closeIcon}>
        <Close width={24} height={24} />
      </TouchableOpacity>

      <Text style={styles.text}>{`${page} จาก 4`}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    marginBottom: 40,
  },
  closeIcon: {
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  text: {
    textAlign: "center",
    fontFamily: FontFamily.KanitRegular,
    fontSize: 23,
  },
});
