import { useAuth } from "@/context/authcontext";
import { Href, useRouter } from "expo-router";

type Routes = {
  navigateAuthorization: () => void;
  navigateRegistration: () => void;
  navigateStart: () => void;
  navigateAuthorizationType: () => void;
  navigateAccountSetup: () => void,
  navigateCreatePost: () => void
  navigateSubscribes: () => void
  navigateChannel: () => void
  navigateMain: () => void
};

export const useRoutes = (): Routes => {
  const router = useRouter();
  const {user} = useAuth()

  const navigateAuthorization = () => router.push("/(app)/(auth)/login");
  const navigateRegistration = () => router.push("/(app)/(auth)/registration");
  const navigateStart = () => router.push("/(app)/(auth)");
  const navigateAuthorizationType = () => router.push("/(app)/(auth)/authType");
  const navigateAccountSetup = () => router.push("/(app)/(auth)/accountSetup")
  const navigateMain = () => router.push(`/(app)/(main_app)`)
  const navigateChannel = () => router.push(`/(app)/(main_app)/channel/${user.id}`as Href)
  const navigateSubscribes = () => router.push(`/(app)/(main_app)/followed`)
  const navigateCreatePost = () => router.push('/(app)/(main_app)/create_post')

  return { 
        navigateAuthorization,  
        navigateRegistration, 
        navigateStart, 
        navigateAuthorizationType,
        navigateAccountSetup,
        navigateMain,
        navigateChannel,
        navigateSubscribes,
        navigateCreatePost
    };
};
