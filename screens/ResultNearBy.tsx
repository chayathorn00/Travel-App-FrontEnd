import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { FontFamily, FontSize, Color } from "../GlobalStyles";
import { RouteProp} from "@react-navigation/native";
import { RootStackParamList } from "../App";

const ResultNearBy = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ResultNearBy">>();
  const navigation = useNavigation<any>();
  const places = route.params?.places || [];


  const renderPlace = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        navigation.navigate("PlaceDetail", { place: item });
      }}
    >
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>สถานที่ใกล้ฉัน</Text>
      {places.length === 0 ? (
        <Text style={styles.subtitle}>ไม่พบสถานที่ในบริเวณใกล้เคียง</Text>
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderPlace}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default ResultNearBy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorWhite,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: FontSize.size_5xl,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
    textAlign: "center",
    marginTop: 50,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  name: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
  },
  desc: {
    fontSize: FontSize.size_2xs,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorGray_200,
    marginTop: 4,
  },
});
