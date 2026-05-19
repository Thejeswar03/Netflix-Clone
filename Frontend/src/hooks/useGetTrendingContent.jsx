import { useEffect, useState } from "react"
import { useContentStore } from "../store/content.js";
import axios from "axios";

const useGetTrendingContent = () => {
  const [ trendingContent, setTrendingcontent ] = useState(null);
  const { contentType } = useContentStore();

  useEffect(() => {
    const getTrendingContent = async () => {
      const response = await axios.get(`/api/v1/${contentType}/trending`);
      setTrendingcontent(response.data.content);
    }
    getTrendingContent();
  }, [contentType]);

  return { trendingContent };
}

export default useGetTrendingContent;