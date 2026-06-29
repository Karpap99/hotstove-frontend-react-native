import { Posts } from "@/components";
import { apiPrivate } from "@/services/api/api";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type User = {
  id: string;
  nickname: string;
  profile_picture: string;
};

export default function Followed() {
  const [Followed, setFollowed] = useState<User[]>([]);
  const [IsRefreshed, setIsRefreshed] = useState(false);

  const getFollows = async () => {
    const res = await apiPrivate.get("follower/FollowedByUser");
    setFollowed(res.data);
  };

  useEffect(() => {
    getFollows();
  }, []);

  const setRefreshed = () => {
    getFollows();
  };

  const renderFollowedItem = useCallback(({ item }: { item: User }) => {
    const profilePic = item.profile_picture
      ? { uri: item.profile_picture }
      : require("@/assets/images/default_pfp.svg");
    return (
      <TouchableOpacity style={styles.followed_body}>
        <View style={styles.image_wrapper}>
          <Image style={styles.followed_image} source={profilePic} />
        </View>
        <Text>{item.nickname}</Text>
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={styles.body}>
      <FlatList
        data={Followed}
        keyExtractor={(item) => item.id}
        renderItem={renderFollowedItem}
        onEndReachedThreshold={0.1}
        contentContainerStyle={{ alignItems: "center", gap: 5, padding: 5 }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={[styles.post_container, { maxHeight: 100 }]}
      />
      <Posts url={"/post/ByUserAndFollowed"} setRefreshed={setRefreshed} />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  followed_container: {
    backgroundColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: 0.3,
  },
  post_container: {
    backgroundColor: "white",
    borderBottomColor: "black",
    borderBottomWidth: 0.3,
  },
  followed_image: {
    height: 60,
    width: 60,
  },
  image_wrapper: {
    borderRadius: 2,
    borderWidth: 0.3,
    borderColor: "rgba(0, 0, 0, 0.19)",
    overflow: "hidden",
  },
  followed_body: {
    borderRadius: 3,
    borderWidth: 0.3,
    borderColor: "rgba(0, 0, 0, 0.19)",
    padding: 5,
    alignItems: "center",
    overflow: "hidden",
    maxHeight: 100,
  },
});
