import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ImageBackground,
} from "react-native";
import axios from "axios"; // นำเข้า axios
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";
import Header from "../component/Header";
import Progress from "../component/Progress";
import { BASE_URL } from "../config";

const QA1 = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [places, setPlaces] = useState<
    { picture_id: number; theme: string; picture_url: string }[]
  >([]);

  // ดึงข้อมูลจาก API เมื่อ component โหลด
  useEffect(() => {
    axios
      .get(`${BASE_URL}/qa_picture`) // เรียก API
      .then((response) => {
        setPlaces(response.data); // เซ็ตค่าข้อมูลจาก API
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <ImageBackground
      source={require("../assets/bg_qa_1.jpg")}
      style={styles.container}
    >
      <SafeAreaView>
        <Header
          page="1"
          isClose={true}
          next={
            selectedOption
              ? () => {
                  navigation.navigate("QA2", {
                    selectedOption: selectedOption!.toString(),
                  });
                }
              : undefined
          }
        />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.detailContainer}>
            <Progress progress="25" />
            <Text style={styles.title}>ความสนใจของคุณ</Text>

            {/* Grid ตัวเลือก */}
            <View style={styles.imageGrid}>
              {places.map((place) => (
                <Pressable
                  key={place.picture_id}
                  style={[
                    styles.optionContainer,
                    selectedOption === place.picture_id &&
                      styles.optionSelected,
                  ]}
                  onPress={() => setSelectedOption(place.picture_id)}
                >
                  {selectedOption === place.picture_id && (
                    <>
                      <Image
                        style={styles.imageCheck}
                        source={require("../assets/ic_check_circle.png")}
                      />
                      <View style={styles.bgGrid} />
                    </>
                  )}
                  <Image
                    source={{ uri: place.picture_url }}
                    style={styles.image}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  scrollContainer: {
    display: "flex",
    flexDirection: "column",
    paddingBottom: 100,
  },
  title: {
    fontSize: 35,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
    marginBottom: 20,
    textAlign: "center",
  },
  imageGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  bgGrid: {
    width: "100%",
    backgroundColor: "#fff",
    position: "absolute",
    height: "100%",
    opacity: 0.3,
    zIndex: 1,
  },
  imageCheck: {
    position: "absolute",
    zIndex: 999,
    width: 48,
    height: 48,
  },
  optionContainer: {
    width: "45%",
    aspectRatio: 1,
    borderRadius: Border.br_3xs,
    overflow: "hidden",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  optionSelected: {
    borderColor: Color.colorCornflowerblue,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: Border.br_3xs,
  },
  nextButton: {
    backgroundColor: Color.colorCornflowerblue,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: Border.br_21xl,
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    right: 20,
    shadowColor: "#000",
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: Color.colorGray_100,
  },
  buttonText: {
    fontSize: FontSize.m3LabelMedium_size,
    fontFamily: FontFamily.EkkamaiNewBold,
    fontWeight: "700",
    color: Color.colorWhite,
  },
  detailContainer: {
    paddingHorizontal: 20,
  },
});

export default QA1;
