import { Button, DatePicker, Input, PicPicker } from "@/components";
import { useAuth } from "@/context/authcontext";
import { apiPrivate } from "@/services/api/api";
import { FileType } from "@/types/globals";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";

export default function Profile() {
  const { reg_sstage, user, userData } = useAuth();
  const [description, setDescription] = useState<string>(userData.description);
  const [file, setFile] = useState<FileType | null>(null);
  const { t } = useTranslation();
  const [active, setActive] = useState<boolean>(false);
  const [selected, setSelected] = useState<DateType>(new Date());
  const [date, setDate] = useState<string>();

  const UpdateAccount = async () => {
    const formData = new FormData();

    if (file) {
      formData.append("isPublic", "true");
      formData.append("file", {
        uri: file.uri,
        name: file.file,
        type: file.type,
      });
    }
    if (description.length > 0) formData.append("description", description);
    if (selected)
      formData.append("age", new Date(selected.toString()).toISOString());
    const result: AxiosResponse | void = await apiPrivate.put(
      "/user-data/",
      formData,
      { headers: { "content-type": "multipart/form-data" } },
    );
    if (result)
      if (result.data["res"] === "updated")
        reg_sstage({ ...user, ...result.data["result"] });
  };

  const activeState = () => {
    setActive(!active);
  };

  useEffect(() => {
    if (selected) {
      const dt = new Date(selected.toString());
      setDate(dt.getMonth() + 1 + "-" + dt.getDate() + "-" + dt.getFullYear());
    }
  }, [selected]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          display: "flex",
          paddingTop: 10,
          paddingBottom: 20,
          gap: 20,
        }}
      >
        <Text style={styles.header}>Профіль</Text>
        <PicPicker
          file={
            file ? file : { uri: userData.profile_picture, file: "", mime: "" }
          }
          setfile={setFile}
        />
        <Input
          text={t("DESCRIPTION")}
          value={description}
          setValue={setDescription}
          rows={6}
          limitation={512}
        />
        <DatePicker
          text={t("BIRTHDATE")}
          setActive={activeState}
          value={date}
        />
        <Button text={t("NEXT")} action={UpdateAccount} />
        {active && (
          <DateTimePicker
            style={styles.callendarContainer}
            mode="single"
            date={selected}
            onChange={({ date }) => {
              (setSelected(date), setActive(false));
            }}
            styles={{
              day_label: {
                fontFamily: "ComfortaaRegular",
              },
              month_label: {
                fontFamily: "ComfortaaRegular",
              },
            }}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 40,
    fontFamily: "ComfortaaRegular",
  },
  description: {
    fontSize: 12,
    fontFamily: "ComfortaaRegular",
  },
  container: {
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "white",
    gap: 20,
  },
  callendarContainer: {
    position: "absolute",
    backgroundColor: "white",
    width: 310,
  },
});
