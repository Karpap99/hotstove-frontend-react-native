import { Button, Input } from "@/components";
import { useAuth } from "@/context/authcontext";
import { apiPublic } from "@/services/api/api";
import { BadRequestError, LoginDTO, Response } from "@/types/authorization";
import { AxiosResponse } from "axios";
import { Link } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

const cleanUser = { email: "", password: "" };

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();

  const [user, setUser] = useState<LoginDTO>(cleanUser);
  const [errors, setErrors] = useState<LoginDTO>(cleanUser);

  const handleUpdateUser = (field: string, text: string) => {
    if (field)
      setUser((prev) => {
        return { ...prev, [field]: text };
      });
  };

  const reg = async () => {
    setErrors(cleanUser);
    Object.entries(errors).forEach(([key, value]) => {
      if (user[key as keyof LoginDTO] === "") {
        setErrors((prev) => ({
          ...prev,
          [key]: t("FIELDCANTBEEMPTY"),
        }));
      }
    });

    const res: AxiosResponse | void = await apiPublic
      .post("/auth/login", user)
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
              case "user doesn't exist":
                setErrors({ ...errors, email: t("USERDONTEXIST") });
                break;
            }
          });
        }
      });
    if (res)
      if (res.data.access) {
        const response: Response = res.data;
        login(response);
      }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t("AUTHORIZATION")}</Text>
      <Input
        text={t("EMAIL")}
        value={user.email}
        onChange={value => handleUpdateUser("email", value)}
        error={errors.email}
      />
      <View>
        <Input
          text={t("PASSWORD")}
          value={user.password}
          onChange={value => handleUpdateUser("password", value)}
          password
          error={errors.password}
        />
        <Link
          style={[{ textDecorationLine: "underline" }, styles.description]}
          href={"/"}
        >
          {t("FORGOTPASS")}
        </Link>
      </View>
      <View>
        <Button text={t("AUTHORIZATION")} action={reg} />
        <View style={styles.to_reg_container}>
          <Text style={styles.description}>{t("DONTHAVEACC")} </Text>
          <Link href={"/(app)/(auth)/registration"} style={styles.to_reg}>
            {t("REGISTRATION")}
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
  to_reg: {
    fontSize: 12,
    fontFamily: "ComfortaaRegular",
    textDecorationLine: "underline",
  },
  to_reg_container: {
    display: "flex",
    flexDirection: "row",
  },
});
