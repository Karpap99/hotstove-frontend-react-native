import { apiPrivate } from "@/services/api/api";
import { post_short } from "@/types/postGeneration";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";
import { Post } from "./post/post";

type Props = {
  url: string;
  setRefreshed?: () => void;
  UserId?: string;
  query?: string;
};

export const Posts = ({ url, setRefreshed, UserId, query }: Props) => {
  const [post, setPost] = useState<post_short[]>([]);
  const pageRef = useRef(1);
  const isLoadingRef = useRef(false);
  const [total, setTotal] = useState(1);
  const isLoadingScreenRef = useRef(true);
  const isRefreshing = useRef(false);

  const load = useCallback(
    async (page: number) => {
      if (page > total) return;
      if (isLoadingRef.current) return;
      if (isRefreshing.current) return;
      isRefreshing.current = true;
      isLoadingRef.current = true;
      try {
        const load_post = await apiPrivate.get(url, {
          params: { page: page, UserId: UserId ? UserId : "", query: query },
        });
        setPost((prevPost) => [...prevPost, ...load_post.data.data]);
        setTotal(Math.ceil(load_post.data.total / 10));
        pageRef.current = page;
      } catch (e) {
        console.log(e);
      } finally {
        isLoadingRef.current = false;
        isRefreshing.current = false;
      }
    },
    [url, UserId, query, total],
  );

  const handleScroll = useCallback(async () => {
    const nextPage = pageRef.current + 1;
    if (isLoadingScreenRef.current) return;
    load(nextPage);
  }, []);

  const refresh = useCallback(() => {
    pageRef.current = 1;
    setTotal(1);
    setPost([]);
    load(1);
    if (setRefreshed) setRefreshed();
  }, []);

  useEffect(() => {
    pageRef.current = 1;
    setTotal(1);
    setPost([]);
    load(1);
    if (setRefreshed) setRefreshed();
  }, []);

  useEffect(() => {
    pageRef.current = 1;
    setTotal(1);
    setPost([]);
    load(1);
    if (setRefreshed) setRefreshed();
  }, [query]);

  const renderPostItem = useCallback(({ item }: { item: post_short }) => {
    return <Post data={item} />;
  }, []);

  return (
    <FlatList
      refreshing={isRefreshing.current}
      onRefresh={refresh}
      data={post}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderPostItem}
      onEndReached={handleScroll}
      onEndReachedThreshold={0.1}
      contentContainerStyle={{
        alignItems: "center",
        gap: 5,
        paddingTop: 5,
        paddingBottom: 10,
        width: "100%",
      }}
      style={{ width: "100%" }}
    />
  );
};
