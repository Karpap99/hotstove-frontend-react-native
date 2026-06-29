import { Posts } from "@/components";
import { useAuth } from "@/context/authcontext";
import { apiPrivate } from "@/services/api/api";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type User = {
  id: string;
  nickname: string;
  email: string;
  description: string;
  profile_picture: string;
  followersCount: number;
  followed: boolean;
};

export default function Channel() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();
  const [User, setUser] = useState<User | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    const init = async () => {
      await getUser();
      loaded.current = true;
    };
    init();
  }, [params.id]);

  const getUser = async () => {
    const result = await apiPrivate.get("user/getUserWithDataById/", {
      params: { UserId: params.id },
    });
    setUser(result.data);
  };

  const followBtn = async () => {
    if (params.id === user.id) return;
    try {
      if (!User?.followed)
        await apiPrivate.post("follower", { followTO: params.id });
      else
        await apiPrivate.delete("follower", {
          params: { followTO: params.id },
        });
      const result = await apiPrivate.get("user/getUserWithDataById/", {
        params: { UserId: params.id },
      });
      setUser((prev) =>
        prev
          ? {
              ...prev,
              followed: !prev.followed,
              followersCount: result.data.followersCount,
            }
          : prev,
      );
    } catch (e) {
      console.log(e);
    }
  };

  const ReturnFollowerStyle = () => {
    if (params.id === user.id) return "gray";
    if (User?.followed) return "gray";
    return "red";
  };

  const ReturnFollowerInner = () => {
    if (params.id === user.id) return "Мій канал";
    if (User?.followed) return "Відписатися";
    return "Підписатися";
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <View style={styles.user_info}>
          <Image style={styles.user_image} source={User?.profile_picture} />
          <Text style={styles.user_name}>@{User?.nickname}</Text>
          <Text style={styles.followers}>
            {User?.followersCount} підписників
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.subscribe_button,
            { backgroundColor: ReturnFollowerStyle() },
          ]}
          onPress={followBtn}
        >
          <Text style={styles.subscribe_text}>{ReturnFollowerInner()}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        {<Posts url="/post/getAllByUser" UserId={params.id} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "white",
    borderBottomColor: "rgba(0, 0, 0, 0.3)",
    borderBottomWidth: 0.3,
    display: "flex",
    alignItems: "center",
    paddingTop: 15,
    gap: 20,
    flex: 1,
  },
  user_image: {
    height: 150,
    width: 150,
    backgroundColor: "gray",
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 0.3,
  },
  subscribe_button: {
    width: 180,
    height: 60,
    backgroundColor: "rgb(255, 70, 70)",
    borderRadius: 5,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  user_name: {
    fontSize: 22,
    color: "gray",
    fontFamily: "ComfortaaRegular",
  },
  subscribe_text: {
    color: "white",
    fontSize: 22,
    fontFamily: "ComfortaaRegular",
  },
  followers: {
    fontSize: 22,
    fontFamily: "ComfortaaRegular",
  },
  user_info: {
    display: "flex",
    alignItems: "center",
  },
});
