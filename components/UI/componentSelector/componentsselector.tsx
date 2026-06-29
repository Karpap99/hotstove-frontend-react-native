import { Table, UIinner } from '@/types/postGeneration';
import { Image } from 'expo-image';
import React, { ReactElement } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PostImageInput, PostListInput, PostTableInput, PostTextInput } from '../../';




type Props = {
    nextId: number, 
    setText: (id: number, value: string,) => void, 
    setImage: (id: number, uri: string, name: string, type: string) => void,
    setTable: (id: number, table: Table[]) => void,
    setList: (id: number, data:  {id: number, value: string}[]) => void,
    addElement: (element: ReactElement, id: number) => void,
    onDelete: (id:number) => void,
    data?: UIinner[]
};

export const ComponentSelector = ({ nextId, setText, setImage, setTable, setList, addElement, onDelete, data }: Props) => {
  const OnPressText = () => {
    const id = nextId;
    const el = React.createElement(PostTextInput, { id, setText, onDelete, data, key: id, });
    addElement(el, id);
  };
  const OnPressImage = () => {
    const id = nextId;
    const el = React.createElement(PostImageInput, { id, setImage, onDelete,  key: id });
    addElement(el, id);
  };
  const OnPressTable = () => {
    const id = nextId;
    const el = React.createElement(PostTableInput, { id, setTable, onDelete, key: id });
    addElement(el, id);
  };
  const OnPressList = () => {
    const id = nextId;
    const el = React.createElement(PostListInput, { id, setList, onDelete, key: id });
    addElement(el, id);
  };

  const components = [
    { key: 'text', label: 'текст', icon: require("@/assets/images/text.svg"), onPress: OnPressText },
    { key: 'image', label: 'зображення', icon: require("@/assets/images/image.svg"), onPress: OnPressImage },
    { key: 'list', label: 'список', icon: require("@/assets/images/list.svg"), onPress: OnPressList },
    { key: 'table', label: 'таблиця', icon: require("@/assets/images/table.svg"), onPress: OnPressTable },
  ];

  return (
    <View style={styles.container}>
      {components.map(({ key, label, icon, onPress }) => (
        <TouchableOpacity key={key} style={styles.navButton} onPress={onPress}>
          <Image style={styles.navImage} source={icon} />
          <Text style={styles.navText}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
   container: {
    height: 50,
    width: "100%",
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-around',

   },
   text:{
    fontSize: 14,
    fontFamily:"ComfortaaRegular"
   },
   content: {
    fontSize: 14,
    fontFamily:"ComfortaaRegular"
   },
   navButton: {
        display:"flex",
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 50,
        width: 60,
    },
    navText: {
        fontSize: 9,
        lineHeight: 12,
        fontFamily:"ComfortaaRegular",
        color: "rgb(41, 41, 41)"
    },
    navImage: {
        height: 24,
        width: 24
    }
});
