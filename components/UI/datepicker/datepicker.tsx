import { StyleSheet, View, Text, TouchableOpacity} from 'react-native';

type Props = {text: string, value?: string, setValue?: (x: string) => void, active?: boolean, setActive: () => void};

export const DatePicker = (props: Props) => {
    return (
        <View>
            <Text style={styles.text}>{props.text}</Text>
            <TouchableOpacity style={styles.container} onPress={()=>props.setActive()} >
                <Text style={styles.content}>{props.value}</Text>
            </TouchableOpacity>
        </View>  
    );
}


const styles = StyleSheet.create({
   container: {
    height: 60,
    width: 350,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor:'black',
    borderWidth: 0.5,
    borderRadius: 10 
   },
   text:{
    fontSize: 14,
    fontFamily:"ComfortaaRegular"
   },
   content: {
    fontSize: 14,
    fontFamily:"ComfortaaRegular"
   }
});
