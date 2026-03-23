import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import MediaItem from "../components/common/MediaItem.jsx";
import Container from "../components/common/Container.jsx";
import uiConfigs from "../configs/ui.configs.js";
import recentlyViewedApi from "../api/modules/recentlyViewed.api.js";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import { removeRecentlyViewed, clearRecentlyViewed } from "../redux/features/userSlice";

const RecentlyViewedPage = () => {
  const [medias, setMedias] = useState([]);
  const [onClearRequest, setOnClearRequest] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getRecentlyViewed = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await recentlyViewedApi.getList();
      dispatch(setGlobalLoading(false));
      if (err) toast.error(err.message);
      if (response) setMedias(response);
    };
    getRecentlyViewed();
  }, [dispatch]);

  const onRemove = async (mediaId) => {
    const { response, err } = await recentlyViewedApi.remove({ mediaId });
    if (err) toast.error(err.message);
    if (response) {
      dispatch(removeRecentlyViewed({ mediaId }));
      setMedias(medias.filter(m => m.mediaId.toString() !== mediaId.toString()));
      toast.success("Removed from recently viewed");
    }
  };

  const onClearAll = async () => {
    if (onClearRequest) return;
    setOnClearRequest(true);
    const { response, err } = await recentlyViewedApi.clear();
    setOnClearRequest(false);
    if (err) toast.error(err.message);
    if (response) {
      dispatch(clearRecentlyViewed());
      setMedias([]);
      toast.success("Recently viewed cleared");
    }
  };

  return (
    <Box sx={{ ...uiConfigs.style.mainContent }}>
      <Container header={`Recently Viewed (${medias.length})`}>
        {medias.length > 0 && (
          <Stack direction="row" justifyContent="flex-end" sx={{ marginBottom: 2 }}>
            <LoadingButton
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              loading={onClearRequest}
              onClick={onClearAll}
            >
              Clear All
            </LoadingButton>
          </Stack>
        )}

        {medias.length === 0 && (
          <Typography color="text.secondary" textAlign="center" padding={4}>
            No recently viewed media yet.
          </Typography>
        )}

        <Grid container spacing={1} sx={{ marginRight: "-8px!important" }}>
          {medias.map((media, index) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <MediaItem media={media} mediaType={media.mediaType} />
              <Button
                fullWidth
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                sx={{ marginTop: 1 }}
                onClick={() => onRemove(media.mediaId)}
              >
                Remove
              </Button>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default RecentlyViewedPage;