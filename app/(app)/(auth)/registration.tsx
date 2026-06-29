import { Button, Input } from "@/components";
import { useAuth } from "@/context/authcontext";
import { apiPublic } from "@/services/api/api";
import {
  BadRequestError,
  RegistrationData,
  Response,
} from "@/types/authorization";
import { AxiosResponse } from "axios";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

const cleanUser = {
  nickname: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

export default function Registration() {
  const [user, setUser] = useState<RegistrationData>(cleanUser);
  const [errors, setErrors] = useState<RegistrationData>(cleanUser);

  const { t } = useTranslation();
  const router = useRouter();
  const { reg_fstage } = useAuth();

  const handlePasswordInput = () => {
    if (user.password !== user.passwordConfirm) {
      setErrors({ ...errors, passwordConfirm: t("PASSWORDSDIFFERENT") });
    } else {
      setErrors({ ...errors, passwordConfirm: "" });
    }
  };

  const handleUpdateUser = (field: string, text: string) => {
    if (field === "password" || field === "password2") handlePasswordInput();
    if (field)
      setUser((prev) => {
        return { ...prev, [field]: text };
      });
  };

  const reg = async () => {
    setErrors(cleanUser);

    Object.entries(errors).forEach(([key, value]) => {
      if (user[key as keyof RegistrationData] === "") {
        setErrors((prev) => ({
          ...prev,
          [key]: t("FIELDCANTBEEMPTY"),
        }));
      }
    });

    const res: AxiosResponse | void = await apiPublic
      .post("auth/register", user)
      .catch((e: BadRequestError) => {
        if (e["statusCode"] === 400) {
          e.message.find((el) => {
            switch (el) {
              case "password is not strong enough":
                setErrors({ ...errors, password: t("PASSWORDISWEAK") });
                break;
              case "email must be an email":
                setErrors({ ...errors, email: t("EMAILISWRONG") });
                break;
              case "this email taken":
                setErrors({ ...errors, email: t("EMAILTAKEN") });
                break;
            }
          });
        }
      });

    if (res) {
      const response: Response = res.data;
      if (response.access !== "") {
        reg_fstage(response);
        router.navigate("/(app)/(auth)/accountSetup");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t("REGISTRATION")}</Text>
      <Input
        text={t("LOGIN")}
        value={user.nickname}
        onChange={value => handleUpdateUser("nickname", value)}
        error={errors.nickname}
      />
      <Input
        text={t("EMAIL")}
        value={user.email}
        onChange={value => handleUpdateUser("email", value)}
        error={errors.email}
      />
      <Input
        text={t("PASSWORD")}
        value={user.password}
        onChange={value => handleUpdateUser("password", value)}
        password
        error={errors.password}
      />
      <Input
        text={t("REPEATPASS")}
        value={user.passwordConfirm}
        onChange={value => handleUpdateUser("passwordConfirm", value)}
        password
        error={errors.passwordConfirm}
      />
      <View>
        <Button text={t("REGISTRATION")} action={reg} />
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.description}>{t("HAVEACC")}</Text>
          <Link
            href={"/(app)/(auth)/login"}
            style={[{ textDecorationLine: "underline" }, styles.description]}
          >
            {t("AUTHORIZATION")}
          </Link>
        </View>
      </View>
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
    gap: 10,
  },
});
