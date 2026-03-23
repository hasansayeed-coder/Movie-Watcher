// ✅ Fixed MediaGrid.jsx
import { Grid } from "@mui/material";
import MediaItem from "./MediaItem.jsx";

const MediaGrid = ({ medias, mediaType }) => {
  return (
    <Grid container spacing={1} sx={{ marginRight: "-8px!important" }}>
      {medias.map((media, index) => (
        <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
          <MediaItem media={media} mediaType={mediaType} />
        </Grid>
      ))}
    </Grid>
  );
};

export default MediaGrid; 