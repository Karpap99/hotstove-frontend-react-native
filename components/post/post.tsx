import { useAuth } from "@/context/authcontext";
import { apiPrivate } from "@/services/api/api";
import { post_short } from "@/types/postGeneration";
import { Image } from "expo-image";
import { Href, router } from "expo-router";
import React, { memo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, PostAction, Tag } from "..";

type Props = {
  data: post_short;
};

// eslint-disable-next-line react/display-name
export const Post = memo(({ data }: Props) => {
  const [postData, setPostData] = useState<post_short>(data);
  const [actionMenu, setActionMenu] = useState(false);
  const { user } = useAuth();

  const profilePic = postData.creator?.profile_picture
    ? { uri: postData.creator.profile_picture }
    : require("@/assets/images/default_pfp.svg");
  const likedPic = postData.likes
    ? require("@/assets/images/likedRed.svg")
    : require("@/assets/images/like.svg");

  const toChannel = () =>
    router.navigate(`/(app)/(main_app)/channel/${postData.creator.id}` as Href);
  const toMessage = () =>
    router.navigate(`/(app)/(main_app)/messages/${postData.id}` as Href);
  const toPost = () =>
    router.navigate(`/(app)/(main_app)/post/${postData.id}` as Href);

  const setLike = async () => {
    if (!postData.likes) {
      await apiPrivate.post("/like/", { postId: data.id });
      setPostData({
        ...postData,
        likeCount: postData.likeCount + 1,
        likes: {},
      });
    } else {
      await apiPrivate.delete("/like/", { params: { postId: data.id } });
      setPostData({
        ...postData,
        likeCount: postData.likeCount - 1,
        likes: null,
      });
    }
  };

  const onDelete = async () => {
    await apiPrivate.delete("/post/", { params: { postId: postData.id } });
  };
  return (
    <View style={styles.post}>
      <View style={styles.post_header}>
        <View style={styles.post_header_upper}>
          <View style={styles.post_header_left}>
            <TouchableOpacity
              style={styles.image_container}
              onPress={() => {
                toChannel();
              }}
            >
              <Image style={styles.image} source={profilePic} />
            </TouchableOpacity>
            <View>
              <Text style={styles.post_header_user} numberOfLines={1}>
                @
                {postData.creator ? postData.creator?.nickname : "default_user"}
              </Text>
              <Text style={styles.post_header_user}>
                {postData.createDateTime
                  ? new Date(postData.createDateTime).toLocaleDateString(
                      "uk-UA",
                      {
                        hour: "numeric",
                        minute: "numeric",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )
                  : ""}
              </Text>
            </View>
          </View>
          <View style={[styles.post_header_right]}>
            <View
              style={{
                position: "relative",
                width: 120,
                alignItems: "flex-end",
              }}
            >
              <TouchableOpacity onPress={() => setActionMenu(!actionMenu)}>
                <Image
                  style={styles.action_menu}
                  source={require("@/assets/images/action_menu.svg")}
                />
              </TouchableOpacity>
              {actionMenu && (
                <View
                  style={[
                    {
                      position: "absolute",
                      backgroundColor: "white",
                      zIndex: 2,
                    },
                    user.id === postData.creator.id
                      ? { bottom: -65 }
                      : { bottom: -20 },
                  ]}
                >
                  <TouchableOpacity style={styles.action_menu_element}>
                    <Text style={styles.action_menu_text}>поскаржитись</Text>
                  </TouchableOpacity>
                  {user.id === postData.creator.id && (
                    <>
                      <TouchableOpacity
                        style={styles.action_menu_element}
                        onPress={onDelete}
                      >
                        <Text
                          style={[styles.action_menu_text, { color: "red" }]}
                        >
                          видалити
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}
            </View>
            <View style={styles.post_header_right_tags}>
              {postData.tags?.map(({ id, content }) => (
                <Tag key={id} text={content} />
              ))}
            </View>
          </View>
        </View>
        <Text style={styles.post_head} numberOfLines={2}>
          {postData.title}
        </Text>
        <Text style={styles.post_description}>{data.description}</Text>
      </View>
      <View style={{ alignItems: "center", gap: 5 }}>
        <View style={styles.post_content}>
          <Image style={styles.title_picture} source={postData.title_picture} />
        </View>
        <Button text="Дивитися" action={toPost} />
      </View>

      <View style={styles.post_footer}>
        <View style={styles.footer_actions}>
          <PostAction
            text={postData.likeCount ? `${postData.likeCount}` : "0"}
            image={likedPic}
            action={setLike}
          ></PostAction>
          <PostAction
            text={postData.messagesCount ? `${postData.messagesCount}` : "0"}
            image={require("@/assets/images/message.svg")}
            action={toMessage}
          ></PostAction>
          <PostAction image={require("@/assets/images/share.svg")}></PostAction>
        </View>
        <View>
          <Text>{postData.views ? `${postData.views}` : "0"} переглядів</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  post: {
    width: "98%",
    backgroundColor: "white",
    borderColor: "rgba(0, 0, 0, 0.3)",
    borderWidth: 0.5,
    borderRadius: 5,
    position: "relative",
    paddingBottom: 40,
  },
  image: {
    height: 45,
    width: 45,
    backgroundColor: "gray",
    borderRadius: "50%",
  },
  image_container: {
    height: 45,
    width: 45,
    backgroundColor: "gray",
    borderRadius: 3,
    overflow: "hidden",
  },
  post_header: {
    padding: 5,
    paddingBottom: 10,
    display: "flex",
    justifyContent: "space-between",
    borderBottomColor: "rgba(0, 0, 0, 0.3)",
    borderBottomWidth: 0.3,
  },
  post_header_upper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  post_header_left: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  post_header_right: {
    display: "flex",
    alignItems: "flex-end",
    flexWrap: "wrap",
    maxWidth: "45%",
  },
  post_header_right_tags: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    flexWrap: "wrap",
    maxHeight: 72,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  post_header_user: {
    fontSize: 14,
    fontFamily: "ComfortaaRegular",
    color: "rgb(61, 60, 60)",
  },
  post_content: {
    padding: 1,
    alignItems: "center",
  },
  post_footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopColor: "rgba(0, 0, 0, 0.3)",
    borderTopWidth: 0.3,
    height: 35,
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    display: "flex",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 10,
  },
  footer_actions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  post_head: {
    fontSize: 18,
    fontFamily: "ComfortaaRegular",
  },
  title_picture: {
    width: "100%",
    aspectRatio: "5/4",
    borderRadius: 1,
  },
  post_description: {
    fontSize: 14,
    fontFamily: "ComfortaaRegular",
    color: "rgb(0, 0, 0)",
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
  action_menu: {
    height: 25,
    width: 25,
    borderRadius: "50%",
  },
});
