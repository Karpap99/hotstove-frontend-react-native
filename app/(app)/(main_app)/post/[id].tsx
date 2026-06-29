import { JsonToReact } from "@/components";
import { InsidePostAction } from "@/components/insidePostAction/insidePostAction";
import { Tag } from "@/components/tag";
import { useAuth } from "@/context/authcontext";
import { apiPrivate } from "@/services/api/api";
import { element, post_short } from "@/types/postGeneration";
import { Image } from "expo-image";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type PostType = post_short & {
  marking: element;
};

export default function Channel() {
  const params = useLocalSearchParams<{ id?: string }>();
  const [Post, setPost] = useState<PostType>();
  const [actionMenu, setActionMenu] = useState(false);
  const { user } = useAuth();

  const profilePic = Post?.creator?.profile_picture
    ? { uri: Post.creator.profile_picture }
    : require("@/assets/images/default_pfp.svg");

  const likedPic = Post?.likes
    ? require("@/assets/images/likedRed.svg")
    : require("@/assets/images/like.svg");

  const date = () =>
    Post?.createDateTime
      ? new Date(Post.createDateTime).toLocaleDateString("uk-UA", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  const getPostData = async () => {
    const post = await apiPrivate.get("/post/byIdWithMarking", {
      params: { postId: params.id },
    });
    if (typeof post !== "undefined") {
      setPost(post.data);
    }
  };

  useEffect(() => {
    if (params.id) {
      getPostData();
    }
  }, [params.id]);

  const setLike = async () => {
    if (!Post) return;
    if (!Post?.likes) {
      await apiPrivate.post("/like/", { postId: Post?.id });
      setPost({ ...Post, likeCount: Post?.likeCount + 1, likes: {} });
    } else {
      await apiPrivate.delete("/like/", { params: { postId: Post?.id } });
      setPost({ ...Post, likeCount: Post?.likeCount - 1, likes: null });
    }
  };

  const toMessage = () => {
    router.navigate(`/(app)/(main_app)/messages/${Post?.id}` as Href);
  };

  return (
    <ScrollView contentContainerStyle={{ paddingTop: 20, padding: 5 }}>
      <View
        style={{
          borderBottomColor: "rgb(0, 0, 0)",
          borderBottomWidth: 1,
          paddingBottom: 2,
          marginBottom: 2,
          gap: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity>
              <Image
                style={styles.user_image}
                source={Post?.creator.profile_picture}
              />
            </TouchableOpacity>
            <View>
              <Text style={{ fontFamily: "ComfortaaRegular", fontSize: 18 }}>
                @{Post?.creator.nickname}
              </Text>
              <Text style={{ fontFamily: "ComfortaaRegular", fontSize: 18 }}>
                {date()}
              </Text>
            </View>
          </View>
          <View
            style={{ position: "relative", width: 130, alignItems: "flex-end" }}
          >
            <TouchableOpacity onPress={() => setActionMenu(!actionMenu)}>
              <Image
                style={styles.action_menu}
                source={require("@/assets/images/action_menu.svg")}
              />
            </TouchableOpacity>
            {actionMenu && (
              <View
                style={{
                  position: "absolute",
                  bottom: -75,
                  backgroundColor: "white",
                  zIndex: 2,
                }}
              >
                <TouchableOpacity style={styles.action_menu_element}>
                  <Text style={styles.action_menu_text}>поскаржитись</Text>
                </TouchableOpacity>
                {user.id == Post?.creator.id && (
                  <>
                    <TouchableOpacity style={styles.action_menu_element}>
                      <Text style={styles.action_menu_text}>редагувати</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.action_menu_element}>
                      <Text style={[styles.action_menu_text, { color: "red" }]}>
                        видалити
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </View>
        </View>
        <Text style={styles.text_title}>{Post?.title}</Text>
        <Text style={styles.text_description}>{Post?.description}</Text>
        <Text style={styles.text_description}>Теги:</Text>
        <View style={styles.tagBox}>
          {Post?.tags.map((tag) => (
            <Tag key={tag.id} text={tag.content} />
          ))}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            borderTopColor: "rgb(0, 0, 0)",
            borderTopWidth: 1,
          }}
        >
          <InsidePostAction
            text={Post?.likeCount ? `${Post?.likeCount}` : "0"}
            image={likedPic}
            action={setLike}
          />
          <InsidePostAction
            text={Post?.messagesCount ? `${Post?.messagesCount}` : "0"}
            image={require("@/assets/images/message.svg")}
            action={toMessage}
          />
          <InsidePostAction image={require("@/assets/images/share.svg")} />
        </View>
      </View>
      {Post?.marking && <JsonToReact marking={Post?.marking.marking} />}
    </ScrollView>
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
    flex: 6,
  },
  user_image: {
    height: 60,
    width: 60,
    backgroundColor: "gray",
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 0.3,
  },
  subscribe_button: {
    width: 290,
    height: 60,
    backgroundColor: "rgb(255, 70, 70)",
    borderRadius: 5,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  user_name: {
    fontSize: 22,
    fontFamily: "ComfortaaRegular",
    textAlign: "center",
  },
  subscribe_text: {
    color: "white",
    fontSize: 24,
    fontFamily: "ComfortaaRegular",
  },
  tagBox: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    width: "100%",
    flexWrap: "wrap",
    maxHeight: 48,
    overflow: "hidden",
  },
  action_menu: {
    height: 25,
    width: 25,
    borderRadius: "50%",
  },
  action: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    padding: 2,
  },
  action_menu_element: {
    borderWidth: 0.3,
    padding: 2,
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  action_menu_text: {
    fontFamily: "ComfortaaRegular",
    fontSize: 12,
  },
  text_title: { fontFamily: "ComfortaaRegular", fontSize: 22 },
  text_description: { fontFamily: "ComfortaaRegular", fontSize: 16 },
});
