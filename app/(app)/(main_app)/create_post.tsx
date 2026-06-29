import { Button, Input, Selector } from "@/components";
import { UIgenerator } from "@/components/UIgenerator";
import { VideoPicker } from "@/components/videoPicker";
import { apiPrivate } from "@/services/api/api";
import { element } from "@/types/postGeneration";
import { AxiosError, AxiosResponse } from "axios";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type data = {
  marking: element;
  files: {
    uri: string;
    name: string;
    type: string;
  }[];
};

type TagType = {
  id: string;
  content: string;
};

type info = {
  title: string;
  description: string;
};

export default function CreatePost() {
  const [publication_type, setPublicationType] = useState<boolean>(false);
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
  const [postData, setPostData] = useState<data>();
  const router = useRouter();

  const [Data, setData] = useState<info>({
    title: "",
    description: "",
  });

  const handleUpdateData = (field: string, text: string) => {
    if (field)
      setData((prev) => {
        return { ...prev, [field]: text };
      });
  };

  const BuildFormData = () => {
    const formdata = new FormData();

    formdata.append("title", Data.title);
    formdata.append("description", Data.description);
    formdata.append("tags", JSON.stringify(postTags));

    if (!publication_type) {
      if (postData !== undefined) {
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
    if (Data.title === "" || !postImage || Data.description === "") return;
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
    if (postImage.uri !== "")
      setPostImage({ uri: "", fileName: "", mimeType: "" });
    else pickImage();
  };

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
          {postImage.uri !== ""
            ? "Натисніть для видалення зображення"
            : "Натисніть для додавання зображення"}
        </Text>
        <Input
          text="Назва"
          value={Data.title}
          onChange={value => handleUpdateData("title", value)}
          AiService
        />
        <Input
          rows={8}
          limitation={1024}
          text="Опис"
          value={Data.description}
          onChange={value => handleUpdateData("description", value)}
        />
        <Selector setValue={setPostTags} text="Теги" />
        {publication_type ? (
          <VideoPicker file={postVideo} setfile={setPostVideo} />
        ) : (
          <UIgenerator triger={triger} setMarking={setPostData} />
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
