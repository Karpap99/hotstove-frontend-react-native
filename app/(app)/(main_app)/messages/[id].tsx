import { Message } from "@/components";
import { apiPrivate } from "@/services/api/api";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    FlatList,
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

function useKeyboardHeight() {
  const height = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e) => {
      Animated.timing(height, {
        toValue: e.endCoordinates?.height,
        duration: e.duration || 250,
        useNativeDriver: false,
      }).start();
    };
    const onHide = (e) => {
      Animated.timing(height, {
        toValue: 0,
        duration: e.duration || 250,
        useNativeDriver: false,
      }).start();
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [height]);

  return height;
}

type Msg = {
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

type message_to = {
  replyTo: "message" | "submessage";
  messageId: string;
  user: {
    id: string;
    nickname: string;
    profile_picture: string;
  };
};

export default function Messages() {
  const params = useLocalSearchParams<{ id?: string }>();
  const [messageText, setmessageText] = useState("");
  const keyboardHeight = useKeyboardHeight();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [MessageToAnsw, setMessageToAnsw] = useState<message_to>();
  const [AnswToMsg, setAnswToMsg] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setAnswToMsg(false);
    setMessages([]);
    await getMessages();
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      await getMessages();
    };
    init();
  }, [params.id]);

  useEffect(() => {
    if (!isEditing) {
      setmessageText("");
    }
  }, [isEditing]);

  const setMsgToAnswer = (data: message_to) => {
    setIsEditing(false);
    setMessageToAnsw(data);
    setAnswToMsg(true);
  };

  const setEditing = (data: message_to, value: string) => {
    setAnswToMsg(false);
    setMessageToAnsw(data);
    setmessageText(value);
    setIsEditing(true);
  };

  const getMessages = async () => {
    const res = await apiPrivate
      .get("/message/getAllByPost", { params: { postId: params.id } })
      .catch((e) => {
        console.log(e);
      });
    setMessages(res.data);
  };

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    if (AnswToMsg && MessageToAnsw) {
      const res = await apiPrivate
        .post("/submessage/", {
          data: {
            messageId: MessageToAnsw.messageId,
            text: messageText,
            receiverId: MessageToAnsw.user.id,
          },
        })
        .catch((e) => {
          console.log(e);
        });
      if (res) {
        setmessageText("");
      }
      return;
    }
    if (isEditing && MessageToAnsw) {
      if (MessageToAnsw.replyTo == "message")
        await apiPrivate
          .put("/message/", {
            data: { messageId: MessageToAnsw.messageId, text: messageText },
          })
          .catch((e) => {
            console.log(e);
          });
      else
        await apiPrivate
          .put("/submessage/", {
            data: { messageId: MessageToAnsw.messageId, text: messageText },
          })
          .catch((e) => {
            console.log(e);
          });
      setIsEditing(false);
      setmessageText("");
      return;
    }
    const res = await apiPrivate
      .post("/message/", { data: { postId: params.id, text: messageText } })
      .catch((e) => {
        console.log(e);
      });
    if (res) {
      setmessageText("");
      const newMsg: Msg = res.data;
      setMessages((prevMsg) => [newMsg, ...prevMsg]);
    }
  };

  const renderMessageItem = useCallback(({ item }: { item: Msg }) => {
    return (
      <Message
        setMessageToAnswer={setMsgToAnswer}
        setEditing={setEditing}
        dt={item}
      />
    );
  }, []);

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <FlatList
        refreshing={isRefreshing}
        onRefresh={refresh}
        style={{ flex: 1, width: "100%" }}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessageItem}
        onEndReachedThreshold={0.1}
        contentContainerStyle={{
          alignItems: "stretch",
          gap: 5,
          padding: 5,
          paddingBottom: 55,
        }}
      />
      <Animated.View style={[styles.inputWrapper, { bottom: keyboardHeight }]}>
        {(AnswToMsg || isEditing) && (
          <View style={styles.user_to_answer}>
            <View style={styles.user_to_answer_info_wrapper}>
              <View style={styles.user_to_answer_img_wrapper}>
                <Image
                  style={styles.user_to_answer_img}
                  source={MessageToAnsw?.user.profile_picture}
                />
              </View>
              <Text style={styles.user_to_answer_text}>
                {isEditing ? "редагування" : "відповідь користувачу:"} @
                {MessageToAnsw?.user.nickname}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                (setAnswToMsg(false), setIsEditing(false));
              }}
            >
              <Text>X</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{ flexDirection: "row" }}>
          <TextInput
            value={messageText}
            onChangeText={setmessageText}
            style={styles.input}
          />
          <TouchableOpacity style={[styles.navButton]} onPress={sendMessage}>
            <Image
              style={styles.navImage}
              source={require("@/assets/images/sendMessage.svg")}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    display: "flex",
    padding: 5,
    alignItems: "center",
    borderTopColor: "black",
    borderTopWidth: 0.3,
  },
  input: {
    flex: 1,
    height: 40,
    fontFamily: "ComfortaaRegular",
    paddingLeft: 5,
    borderRadius: 1,
    borderColor: "black",
    borderWidth: 0.3,
  },
  navButton: {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 45,
    gap: 3,
  },
  navText: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: "ComfortaaRegular",
    color: "rgb(41, 41, 41)",
  },
  navImage: {
    height: 25,
    width: 25,
  },
  user_to_answer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingRight: 20,
    paddingBottom: 10,
  },
  user_to_answer_img: {
    height: 25,
    width: 25,
  },
  user_to_answer_img_wrapper: {
    height: 25,
    width: 25,
    overflow: "hidden",
    borderRadius: 3,
  },
  user_to_answer_text: {
    fontFamily: "ComfortaaRegular",
  },
  user_to_answer_info_wrapper: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
});
