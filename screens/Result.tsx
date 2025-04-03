import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../App";
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";
import { BASE_URL } from "../config";
import Ionicons from "react-native-vector-icons/Ionicons";

type ResultItem = {
  results_id: number;
  account_id: number;
  event_name: string;
  event_description: string;
  open_day: string;
  results_location: string;
  time_schedule: string;
  results_img_url: string;
  distance: string;
};

const Result = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Result">>();
  const route = useRoute<RouteProp<RootStackParamList, "Result">>();
  const { account_id } = route.params;

  const [filteredResults, setFilteredResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/qa_results`);
        const data: ResultItem[] = await response.json();
        const filteredData = data.filter((item) => item.account_id === account_id);
        setFilteredResults(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [account_id]);

  const openGoogleMaps = (location: string) => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`);
  };

  return (
    
    <ImageBackground
      source={require("../assets/6fbc45fd-8842-4131-ac3c-b919eff34c6b.jpg")}
      style={styles.container}
      imageStyle={{ opacity: 0.7 }}
      resizeMode="cover"
    >
      <SafeAreaView />
      <View style={styles.header}>
        <Text style={styles.title}>สถานที่ที่เหมาะกับคุณ</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Color.colorCornflowerblue} style={styles.loading} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {filteredResults.length > 0 ? (
            filteredResults.map((place) => (
              <View key={place.results_id} style={styles.card}>
                <Image source={{ uri: place.results_img_url }} style={styles.image} />
                <View style={styles.infoContainer}>
                  <Text style={styles.placeName}>{place.event_name}</Text>
                  <Text style={styles.description}>{place.event_description}</Text>
                  <Text style={styles.detailText}>📍 {place.results_location}</Text>
                  <Text style={styles.detailText}>⏰ {place.time_schedule}</Text>
                  <Text style={styles.detailText}>🚶 {place.distance}</Text>

                  <TouchableOpacity
                    style={styles.routeButton}
                    onPress={() => openGoogleMaps(place.event_name)}
                  >
                    <Text style={styles.routeText}>ดูเส้นทาง</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noResult}>ไม่พบสถานที่ที่ตรงกับบัญชีของคุณ</Text>
          )}

          <TouchableOpacity
            onPress={async () => {
              const token = await AsyncStorage.getItem("userToken");
              if (token) {
                navigation.navigate("HomePage");
              } else {
                navigation.navigate("Auth");
              }
            }}
            style={[styles.routeButton, styles.back]}
          >
            <Text style={styles.routeText}>ดูข้อมูลเพิ่มเติม</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
  <Ionicons name="arrow-back-circle" size={40} color="#5893d8" />
</TouchableOpacity>

    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 0,
    paddingVertical: 10,
    paddingTop: 66,
    borderBottomWidth: 0,
    borderBottomColor: Color.colorWhitesmoke_100,
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
  title: {
    fontSize: FontSize.size_17xl,
    fontFamily: FontFamily.KanitRegular,
    textAlign: "center",
    color: Color.colorBlack,
  },
  scrollView: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: Border.br_base,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
  },
  infoContainer: {
    padding: 15,
  },
  placeName: {
    fontSize: FontSize.size_5xl,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
    marginBottom: 4,
  },
  description: {
    fontSize: FontSize.size_mini,
    fontFamily: FontFamily.KanitRegular,
    marginVertical: 5,
    color: "#444",
  },
  detailText: {
    fontSize: FontSize.size_mini,
    fontFamily: FontFamily.KanitRegular,
    marginTop: 2,
    color: "#333",
  },
  routeButton: {
    backgroundColor: Color.colorCornflowerblue,
    paddingVertical: 10,
    borderRadius: Border.br_base,
    alignItems: "center",
    width: "27%",
    alignSelf: "center",
    marginTop: 10,
  },
  routeText: {
    fontSize: FontSize.size_lmap,//size17
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorWhite,
  },
  back: {
    width: "40%",
    backgroundColor: Color.colorCornflowerblue,
    marginTop: 30,
    marginBottom: 40,
  },
  noResult: {
    textAlign: "center",
    fontSize: FontSize.size_mini,
    fontFamily: FontFamily.KanitRegular,
    color: "gray",
    marginVertical: 20,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 72,
    left: 20,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  
});

export default Result;
