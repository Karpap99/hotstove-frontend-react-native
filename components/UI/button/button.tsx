import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

type Props = { text: string, action?: () => void, image?: string};

export const Button = ({text, action, image}: Props) => {
  return (
    <TouchableOpacity 
      style={[styles.button, (image ? styles.button_with_image : "")]} 
      onPress={() => action ? action() : ''}>
      { image ? <Image style={styles.button_image} source={image}/> : null}
      <Text style={styles.button_text}>{text}</Text>
    </TouchableOpacity>  
  );
}


const styles = StyleSheet.create({
  button: {
    height: 60,
    width: 350,
    backgroundColor: 'white',
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor:'black',
    borderWidth: 0.5,
    borderRadius: 5
  },
  button_text:{
    fontSize: 18,
    fontFamily:"ComfortaaRegular"
  },
  button_image:{
    height: 32,
    width: 32
  },
  button_with_image: {
      flexDirection:'row',
      paddingLeft: 15,
      gap: 10,
      justifyContent:"flex-start"}
});
