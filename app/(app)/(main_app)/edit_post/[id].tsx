import {
    Button,
    Input,
    Selector,
    UIgenerator,
    VideoPicker,
} from "@/components";
import { apiPrivate } from "@/services/api/api";
import { element, PostData } from "@/types/postGeneration";
import { AxiosError, AxiosResponse } from "axios";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type TagType = {
  id: string;
  content: string;
};

export default function EditPost() {
  const params = useLocalSearchParams<{ id?: string }>();
  const [publication_type, setPublicationType] = useState<boolean>(false);
  const [postName, setPostName] = useState<string>("");
  const [postDescription, setPostDescription] = useState<string>("");
  const [postTags, setPostTags] = useState<TagType[]>([]);
  const [postImage, setPostImage] = useState<any>({
    uri: "",
    name: "",
    type: "",
  });
  const [postVideo, setPostVideo] = useState<any>({
    uri: "",
    name: "",
    type: "",
  });
  const [triger, setTriger] = useState<boolean>(false);
  const [postData, setPostData] = useState<PostData>();
  const router = useRouter();
  const [json, setJson] = useState<element>();
  const [loaded, setLoaded] = useState(false);

  const BuildFormData = () => {
    const formdata = new FormData();

    formdata.append("title", postName);
    formdata.append("description", postDescription);

    formdata.append("tags", JSON.stringify(postTags));

    if (!publication_type) {
      if (postData != undefined) {
        const { files, marking } = postData;
        if (files.length > 0) {
          files.map((file) => {
            formdata.append("files", file as any);
          });
          formdata.append("isPublic", "true");
        }
        formdata.append("marking", JSON.stringify(marking));
      }
    } else {
      const marking: element = {
        component: "View",
        styles: "",
        value: "",
        children: [
          {
            component: "Video",
            styles: "",
            value: "file0",
            children: [],
          },
        ],
      };
      formdata.append("marking", JSON.stringify(marking));
      formdata.append("files", postVideo);
    }
    formdata.append("files", postImage);
    return formdata;
  };

  const postPublication = async () => {
    if (!postName || !postImage || !postDescription) return;
    setTriger(true);
    const formData = BuildFormData();
    const result: AxiosResponse | void = await apiPrivate
      .post("/post/", formData, {
        headers: { "content-type": "multipart/form-data" },
      })
      .catch((e: AxiosError) => {
        setTriger(false);
      });
    if (result) {
      setTriger(false);
      router.navigate("/(app)/(main_app)");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getPostData();
    };
    fetchData();
  }, [params.id]);

  const getPostData = async () => {
    const post = await apiPrivate.get("/post/byIdWithMarking", {
      params: { postId: params.id },
    });
    if (typeof post !== "undefined") {
      setJson(post.data.marking.marking);
    }
    setLoaded(true);
  };

  const [error, setError] = useState(null);
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });
    if (!result.canceled) {
      setPostImage({
        uri: result.assets[0].uri,
        name: "title_picture",
        type: result.assets[0].mimeType,
      });
      setError(null);
    }
  };

  const Pick = () => {
    if (postImage.uri != "")
      setPostImage({ uri: "", fileName: "", mimeType: "" });
    else pickImage();
  };

  if (!loaded) return;

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ overflow: "hidden" }}
        contentContainerStyle={{
          alignItems: "center",
          display: "flex",
          paddingTop: 10,
          paddingBottom: 20,
          gap: 20,
        }}
      >
        <View style={styles.change_type_container}>
          <TouchableOpacity
            style={[
              styles.publication_type_body,
              !publication_type ? styles.active_type : "",
            ]}
            onPress={() => setPublicationType(false)}
          >
            <Text style={styles.publication_type}>публікація</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.publication_type_body,
              publication_type ? styles.active_type : "",
            ]}
            onPress={() => setPublicationType(true)}
          >
            <Text style={styles.publication_type}>відео</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.image_selector} onPress={() => Pick()}>
          {postImage.uri ? (
            <Image
              style={{ height: "100%", width: "100%" }}
              source={{ uri: postImage.uri }}
            />
          ) : null}
        </TouchableOpacity>
        <Text style={styles.text}>
          {" "}
          {postImage.uri != ""
            ? "Натисніть для видалення зображення"
            : "Натисніть для додавання зображення"}
        </Text>
        <Input text="Назва" value={postName} setValue={setPostName} />
        <Input
          rows={8}
          limitation={1024}
          text="Опис"
          value={postDescription}
          setValue={setPostDescription}
        />
        <Selector setValue={setPostTags} text="Теги" />
        {publication_type ? (
          <VideoPicker file={postVideo} setfile={setPostVideo} />
        ) : (
          <UIgenerator
            triger={triger}
            setMarking={setPostData}
            json={json ? json : undefined}
          />
        )}
        <Button text="Опубліковати" action={postPublication} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  publication_type: {
    fontSize: 22,
    fontFamily: "ComfortaaRegular",
    textAlign: "center",
  },
  publication_type_body: {
    borderBottomWidth: 3,
    borderBottomColor: "gray",
    width: "45%",
    textAlign: "center",
  },
  active_type: {
    borderBottomColor: "rgb(93, 190, 255)",
  },
  change_type_container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  image_selector: {
    width: "90%",
    height: 190,
    backgroundColor: "gray",
  },
  text: {
    fontSize: 12,
    fontFamily: "ComfortaaRegular",
  },
  post_body: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 0.3,
    width: 350,
  },
});
