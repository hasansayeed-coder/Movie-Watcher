import { useEffect, useState } from "react";
import { SwiperSlide } from "swiper/react";
import mediaApi from "../../api/modules/media.api.js";
import AutoSwiper from "./AutoSwiper.jsx";
import { toast } from "react-toastify";
import MediaItem from "./MediaItem.jsx";

const MediaSlide = ({ mediaType, mediaCategory }) => {
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMedias = async () => {
      console.log('🎬 Fetching:', mediaType, mediaCategory); // ✅ Debug log
      setLoading(true);

      const { response, err } = await mediaApi.getList({
        mediaType,
        mediaCategory,
        page: 1,
      });

      console.log('📦 Response:', response); // ✅ Debug log
      console.log('❌ Error:', err); // ✅ Debug log

      if (response) {
        console.log('✅ Results:', response.results); // ✅ Debug log
        setMedias(response.results || []);
      }

      if (err) {
        console.error('API Error:', err);
        toast.error(err.message || 'Failed to load media');
        setMedias([]);
      }

      setLoading(false);
    };

    getMedias();
  }, [mediaType, mediaCategory]);

  // ✅ Add loading state
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // ✅ Add empty state check
  if (!medias || medias.length === 0) {
    return <div className="empty">No {mediaCategory} {mediaType} available</div>;
  }

  return (
    <AutoSwiper>
      {medias.map((media, index) => (
        <SwiperSlide key={media.id || index}> {/* ✅ Use media.id if available */}
          <MediaItem media={media} mediaType={mediaType} />
        </SwiperSlide>
      ))}
    </AutoSwiper>
  );
};

export default MediaSlide;