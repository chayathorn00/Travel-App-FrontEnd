import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
  ScrollView ,
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
import Ionicons from "react-native-vector-icons/Ionicons";


  const QA1 = () => {
    const navigation =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [places, setPlaces] = useState<{ picture_id: number; theme: string; picture_url: string }[]>([]);

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
      source={require("../assets/6fbc45fd-8842-4131-ac3c-b919eff34c6b.jpg")}
          style={styles.container}
          resizeMode="cover"
      >
      <SafeAreaView />
      <Header page="1" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.detailContainer}>
          <Progress progress="25" />
          <Text style={styles.title}>ตอนนี้สนใจสถานที่ไหนบ้างเอ่ยย</Text>

          {/* Grid ตัวเลือก */}
          <View style={styles.imageGrid}>
            {places.map((place) => (
             <Pressable
             key={place.picture_id}
             style={[
               styles.optionContainer,
               selectedOption === place.picture_id && styles.optionSelected,
             ]}
             onPress={() => setSelectedOption(place.picture_id)}
           >
             <Image source={{ uri: place.picture_url }} style={styles.image} />
             {selectedOption === place.picture_id && (
               <View style={styles.overlay}></View>
             )}
           </Pressable>
           
            ))}
          </View>
        </View>
      </ScrollView>
      {/* ปุ่มต่อไป */}
      <TouchableOpacity
  style={[
    styles.arrowButton,
    !selectedOption && styles.buttonDisabled,
  ]}
  onPress={() => {
    if (selectedOption) {
      navigation.navigate("QA2", { selectedOption: selectedOption.toString() });
    }
  }}
  disabled={!selectedOption}
>
<Ionicons name="arrow-forward-circle" size={40} color={Color.colorCornflowerblue} />

</TouchableOpacity>


    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.37)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Border.br_base,
  },
  checkmark: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
  },  
  container: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  title: {
    fontSize: 36,
    fontFamily: FontFamily.MNNangKaiThot,
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
  },
  optionSelected: {
    borderColor: Color.colorCornflowerblue,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, // Android
    transform: [{ scale: 1.05 }],
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: Border.br_3xs,
  },
  arrowButton: {
    position: "absolute",
    top: 50,
    right: 40,
    zIndex: 10,
    // เงานูน
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, // Android
  },
  buttonDisabled: {
    backgroundColor: Color.colorWhite,
  },
  buttonText: {
    fontSize: FontSize.m3LabelMedium_size,
    fontFamily: FontFamily.nunitoBold,
    fontWeight: "700",
    color: "#fff", // สีเข้มขึ้นให้ contrast
  },
  detailContainer: {
    paddingHorizontal: 20,
  },
});

export default QA1;
