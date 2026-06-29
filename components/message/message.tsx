import { useAuth } from "@/context/authcontext";
import { apiPrivate } from "@/services/api/api";
import { Image } from "expo-image";
import { Href, router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SubMessage } from "..";

type data = {
  id: string;
  createDateTime: string;
  text: string;
  user: {
    id: string;
    nickname: string;
    profile_picture: string;
  };
  likesCount?: number;
  isLiked: boolean;
  submessagesCount: number;
};

type submsg = {
  id: string;
  createDateTime: string;
  text: string;
  user: {
    id: string;
    nickname: string;
    profile_picture: string;
  };
  receiver: {
    id: string;
  };
  likesCount?: number;
  isLiked: boolean;
};

type message_to = {
  replyTo: "message" | "submessage";
  messageId: string;
  user: {
    id: string;
    nickname: string;
    profile_picture: string;
  };
};

type Props = {
  dt: data;
  setMessageToAnswer: (data: message_to) => void;
  setEditing: (data: message_to, value: string) => void;
};

export const Message = ({ dt, setMessageToAnswer, setEditing }: Props) => {
  const [Message, setMessage] = useState<data>(dt);
  const [SubMessages, setSubMessages] = useState<submsg[]>([]);
  const [subVisible, setSubVisible] = useState(false);
  const [actionMenu, setActionMenu] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMessage(dt);
  }, [dt]);

  const profilePic = Message.user.profile_picture
    ? { uri: dt.user.profile_picture }
    : require("@/assets/images/default_pfp.svg");

  const likedPic = Message.isLiked
    ? require("@/assets/images/likedRed.svg")
    : require("@/assets/images/like.svg");

  const toChannel = () => {
    router.navigate(`/(app)/(main_app)/channel/${Message.user.id}` as Href);
  };

  const LikeMessage = async () => {
    if (!Message) return;

    if (Message.isLiked) {
      await apiPrivate.delete("message-like", {
        params: { messageId: Message.id },
      });
      setMessage({
        ...Message,
        isLiked: false,
        likesCount: (Message.likesCount || 1) - 1,
      });
    } else {
      await apiPrivate.post("message-like", { messageId: Message.id });
      setMessage({
        ...Message,
        isLiked: true,
        likesCount: (Message.likesCount || 0) + 1,
      });
    }
  };

  const onSubMessagesOpen = async () => {
    setSubVisible(true);
    const res = await apiPrivate.get("submessage/getAllByMessage", {
      params: { messageId: Message.id },
    });
    setSubMessages(res.data);
  };

  const setSubmessageToAnswer = (data: message_to) => {
    setMessageToAnswer({ ...data, messageId: Message.id });
  };

  const setSubmessageToEdit = (data: message_to, value: string) => {
    setEditing({ ...data }, value);
  };

  const date = () =>
    Message.createDateTime
      ? new Date(Message.createDateTime).toLocaleDateString("uk-UA", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  const setMessageToAnsw = () => {
    setMessageToAnswer({
      replyTo: "message",
      messageId: Message.id,
      user: {
        id: Message.user.id,
        nickname: Message.user.nickname,
        profile_picture: Message.user.profile_picture,
      },
    });
  };

  const setMessageToEdit = () => {
    setEditing(
      {
        replyTo: "message",
        messageId: Message.id,
        user: {
          id: Message.user.id,
          nickname: Message.user.nickname,
          profile_picture: Message.user.profile_picture,
        },
      },
      Message.text,
    );
  };

  const onDelete = () => {
    const res = apiPrivate.delete("message", {
      params: { messageId: Message.id },
    });
  };

  return (
    <View>
      <View style={styles.message_body}>
        <View style={styles.message_header}>
          <View style={styles.message_header_content}>
            <TouchableOpacity
              style={styles.image_container}
              onPress={() => {
                toChannel();
              }}
            >
              <Image style={styles.image} source={profilePic} />
            </TouchableOpacity>
            <Text style={styles.user_nickname}>
              @{Message.user.nickname || "default_user"} | {date()}
            </Text>
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
                {user.id == Message.user.id && (
                  <>
                    <TouchableOpacity
                      style={styles.action_menu_element}
                      onPress={setMessageToEdit}
                    >
                      <Text style={styles.action_menu_text}>редагувати</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.action_menu_element}
                      onPress={onDelete}
                    >
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
        <View style={styles.content}>
          <Text style={styles.message_text}>{Message.text}</Text>
        </View>
        <View style={styles.message_footer}>
          <View style={styles.action}>
            <TouchableOpacity onPress={LikeMessage}>
              <Image style={styles.ico} source={likedPic} />
            </TouchableOpacity>
            <Text style={styles.message_text}>{Message.likesCount}</Text>
          </View>
          <TouchableOpacity onPress={setMessageToAnsw}>
            <Text style={styles.message_text}>відповісти</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSubMessagesOpen()}>
            <Text style={styles.message_text}>
              відповіді({Message.submessagesCount})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {subVisible && (
        <View style={styles.submessages_box}>
          <View style={styles.submessages_wrapper}>
            {SubMessages.map((value, index) => (
              <SubMessage
                key={index}
                setSubmessageToAnswer={setSubmessageToAnswer}
                setSubmessageToEdit={setSubmessageToEdit}
                dt={value}
              ></SubMessage>
            ))}
          </View>
          <TouchableOpacity onPress={() => setSubVisible(false)}>
            <Text style={styles.close_submessages}>закрити</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  message_body: {
    width: "100%",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 0.3,
    borderRadius: 3,
  },
  message_header: {
    display: "flex",
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "black",
  },
  message_header_content: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    borderBottomColor: "black",
  },
  image: {
    height: 25,
    width: 25,
    backgroundColor: "gray",
    borderRadius: "50%",
  },

  action_menu: {
    height: 25,
    width: 25,
    borderRadius: "50%",
  },
  image_container: {
    height: 25,
    width: 25,
    backgroundColor: "gray",
    borderRadius: 3,
    overflow: "hidden",
  },
  user_nickname: {
    color: "gray",
    fontSize: 14,
    fontFamily: "ComfortaaRegular",
  },
  content: {
    padding: 5,
    borderBottomColor: "black",
  },
  message_text: {
    fontSize: 14,
    fontFamily: "ComfortaaRegular",
    alignItems: "center",
  },
  message_footer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingLeft: 5,
  },
  action: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    padding: 2,
  },
  ico: {
    height: 20,
    width: 20,
  },
  submessages_box: {
    display: "flex",
    backgroundColor: "white",
    alignItems: "center",
  },
  close_submessages: {
    width: "100%",
    borderTopColor: "rgba(0, 0, 0, 0.2)",
    borderTopWidth: 0.3,
    marginTop: 3,
    fontFamily: "ComfortaaRegular",
  },
  submessages_wrapper: {
    width: "100%",
    gap: 2,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingTop: 2,
    paddingBottom: 2,
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
});
