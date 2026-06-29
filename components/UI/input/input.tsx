import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";

type Props = {
  text: string;
  value: string;
  rows?: number;
  limitation?: number;
  password?: boolean;
  error?: string;
  onChange: (text: string) => void;
  AiService?: boolean;
};

export const Input = (props: Props) => {
  const {
    text,
    value,
    rows,
    limitation,
    password,
    error,
    onChange,
    AiService,
  } = props;

  return (
    <View>
      <Text style={styles.text}>{text}</Text>
      <View>
        <TextInput
          multiline={rows ? true : false}
          secureTextEntry={password}
          numberOfLines={rows}
          placeholder={text}
          style={[
            styles.input,
            rows
              ? {
                  height: 18 * rows,
                  textAlignVertical: "top",
                  textAlign: "left",
                }
              : null,
          ]}
          onChangeText={(e) => {
            onChange(e);
          }}
          maxLength={limitation}
          defaultValue={value}
        />
        {AiService ? (
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 12,
              top: 0,
              bottom: 0,
              justifyContent: "center",
            }}
          >
            <Image
              source={require("@/assets/images/ai.svg")}
              style={{ height: 24, width: 24 }}
            ></Image>
          </TouchableOpacity>
        ) : (
          ""
        )}
      </View>

      <Text
        style={[
          styles.text,
          { fontSize: 12 },
          !limitation ? { display: "none" } : null,
        ]}
      >
        {value.length}/{limitation}
      </Text>
      <Text
        style={[
          styles.text,
          { fontSize: 10, color: "red", lineHeight: 13, paddingLeft: 2 },
          error ? { visibility: "none" } : null,
        ]}
      >
        {error}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 60,
    width: 350,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: "ComfortaaRegular",
    padding: 5,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 0.5,
    borderRadius: 5,
  },
  text: {
    fontSize: 14,
    fontFamily: "ComfortaaRegular",
  },
});
