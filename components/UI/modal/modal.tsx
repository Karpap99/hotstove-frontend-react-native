import { PropsWithChildren, useEffect } from 'react';
import { StyleSheet ,TouchableOpacity, View, Animated, ViewStyle, Text } from 'react-native';
import { Image } from 'expo-image';
import { useAuth } from '@/context/authcontext';
import { useApp } from '@/context/appcontext';
import { Href, useRouter } from 'expo-router';


type SlideInViewProps = PropsWithChildren<{style: ViewStyle}>;

const SlideInView: React.FC<SlideInViewProps> = props => {
    const animated = new Animated.Value(500);
    const duration = 500;

    useEffect(() => {
        Animated.timing(animated, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View
            style={{
            ...props.style,
            transform: [{translateX: animated}]
        }}>
            {props.children}
        </Animated.View>
   );
};

export const Modal = () => {
    const {user, profile, logout} = useAuth()
    const {switchModal} = useApp()
    const ReturnPFP = () => {
        if(profile)
            if(profile.profile_picture)
                return profile.profile_picture
        return require("@/assets/images/default_pfp.svg")
    }

    const router = useRouter()

    const ToChannel = () => router.replace(`/(app)/(main_app)/channel/${user.id}`as Href)
    const ToLikes = () => router.replace(`/(app)/(main_app)/likes`)
    const ToProfile = () => router.replace(`/(app)/(main_app)/profile`)

    return (
        <View style={[styles.wrapper]} >
            <TouchableOpacity style={styles.switchModal} activeOpacity={1} onPress={()=>switchModal()}></TouchableOpacity>
            <SlideInView style={styles.modal_body}>
                <View style={[styles.button_wrapper, { padding: 40}]}>
                    <Image style={styles.pfp} source={ReturnPFP()}/>
                    <Text style={styles.button_text}>@{user.nickname ? user.nickname : "placeholder"}</Text>
                </View>
                <TouchableOpacity style={styles.button_wrapper} onPress={ToChannel}>
                    <Text style={styles.button_text}>Мій канал</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button_wrapper} onPress={ToLikes}>
                    <Text style={styles.button_text}>Вподобання</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button_wrapper} onPress={ToProfile}>
                    <Text style={styles.button_text}>Профіль</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button_wrapper}>
                    <Text style={styles.button_text}>Налаштування</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button_wrapper} onPress={()=> logout()}>
                    <Text style={[styles.button_text,{color: 'rgb(168, 48, 48)'}]}>Вийти</Text>
                </TouchableOpacity>
            </SlideInView>
        </View>
    );
}


const styles = StyleSheet.create({
    modal_body: {
        width: "80%",
        height: "100%",
        backgroundColor:"white",
        right: 0,
        borderLeftColor: "rgba(0,0,0,0.8)",
        borderLeftWidth: 0.6,
    },
    wrapper: {
        width: "100%",
        height: "100%",
        backgroundColor:"rgba(0,0,0,0.3)",
        position: 'absolute',
        display: "flex",
        flexDirection: 'row',
        
    },
    switchModal: {
        width: "20%",
        height: "100%"
    },
    pfp: {
        backgroundColor:"gray",
        height: 170,
        width: 170,
        borderRadius: 5
    },
    button_wrapper:{
        borderBottomColor: "rgba(0,0,0,0.4)",
        borderBottomWidth: 0.4,
        padding: 15,
        alignItems: "center"
    },
    button_text:{
        fontSize: 24,
        fontFamily:"ComfortaaRegular",
    }
});
