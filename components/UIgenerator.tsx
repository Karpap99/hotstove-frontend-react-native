import { element, List, Post, PostData, Table, UIinner } from '@/types/postGeneration';
import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ComponentSelector } from './UI/componentSelector/componentsselector';
import { JsonToEditable } from './jsonToEditable/jsonToEditable';
import { elementToJson } from './ReactToJson';




type Props = {
    triger: boolean,
    setMarking: (data: PostData) => void,
    json? : element
}

export const UIgenerator =  ({triger, setMarking, json}:Props) => {
  const [counter, setCounter] = useState(0)
  const [post, setPost] = useState<Post[]>([])
  const [postData, setPostData] = useState<UIinner[]>([])

  const getMarking = async () => {
    const dt = await elementToJson({post, postData:postData})
    setMarking(dt)
  }

  useEffect(()=>{
    if(triger === true){
      getMarking()
    }
  }, [triger])

  useEffect(() => {
  if (json) {
    const { post, postData } = JsonToEditable(json, {
      setText,
      setImage,
      setTable,
      setList,
      addElement: addEl,
      onDelete: dellEl
    });

    setPost(post)
    setPostData(postData);
  }
}, [json]);

  const addEl = (element: ReactElement, id: number) => {
    setPost(prev => [...prev, { id, Post: element }]);
    setPostData([...postData, 
        {
            id: counter,
            value : "",
            table : [],
            uri : "",
            name : "",
            type : ""
        }])
    setCounter(prev => prev + 1);
  }

  const dellEl = (id: number) => {
    setPost(prev => prev.filter(el => el.id !== id));
    setPostData(prev => prev.filter(el => el.id !== id));
  };

  const setText = (id: number, value: string,) => {
    setPostData(prev =>
    prev.map(item =>
      item.id === id ?  { ...item, value } :  item
    )
    );
  }

  const setImage= (id: number, uri: string, name: string, type: string) => {
    setPostData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, uri, name, type } : item
      )
    );
  }

  const setTable = (id: number, table: Table[]) => {
    setPostData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, table } : item
      )
    );
  }

  const setList = (id: number, list: List[]) => {
    setPostData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, list } : item
      )
    );
  }

  return (
    <View>
        <View style={styles.post_body}>
            {post.map(({id, Post})=>Post)}
            <ComponentSelector setText={setText} setImage={setImage} setTable={setTable} setList={setList} nextId={counter} addElement={addEl} onDelete={dellEl} data={postData}/>
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
  post_body: {
    backgroundColor: "white",
    borderColor:'black',
    borderWidth: 0.3,
    width: 350
  }
});

