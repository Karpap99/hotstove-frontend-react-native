import { LangRoulete, Button } from "@/components";
import { useRoutes } from "@/hooks/useRouter";
import { resources } from "@/lang/i18n";
import { get } from "@/services/store";
import { Image } from "expo-image";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

export default function LangSelect() {
  const { navigateAuthorizationType } = useRoutes();
  const { i18n, t } = useTranslation();

  useEffect(() => {
    (async () => {
      const savedLanguage = await get("language");

      if (savedLanguage) {
        await i18n.changeLanguage(savedLanguage);
      }
    })();
  }, [i18n]);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/lang.svg")}
        style={styles.image}
      />
      <LangRoulete langs={resources} />
      <Button text={t("NEXT")} action={navigateAuthorizationType} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "white",
    gap: 35,
  },
  image: {
    height: 150,
    width: 150,
  },
});
