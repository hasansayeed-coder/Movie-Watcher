import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Chip, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import MediaItem from "../components/common/MediaItem.jsx";
import Container from "../components/common/Container.jsx";
import uiConfigs from "../configs/ui.configs.js";
import watchlistApi from "../api/modules/watchlist.api.js";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import { removeFromWatchlist, toggleWatchlistItem } from "../redux/features/userSlice";

const WatchlistItem = ({ media, onRemoved, onToggled }) => {
  const dispatch = useDispatch();
  const [onRequest, setOnRequest] = useState(false);
  const [onToggleRequest, setOnToggleRequest] = useState(false);

  const onRemove = async () => {
    if (onRequest) return;
    setOnRequest(true);
    const { response, err } = await watchlistApi.remove({ watchlistId: media.id });
    setOnRequest(false);
    if (err) toast.error(err.message);
    if (response) {
      toast.success("Removed from watchlist");
      dispatch(removeFromWatchlist({ mediaId: media.mediaId }));
      onRemoved(media.id);
    }
  };

  const onToggleWatched = async () => {
    if (onToggleRequest) return;
    setOnToggleRequest(true);
    const { response, err } = await watchlistApi.toggleWatched({ watchlistId: media.id });
    setOnToggleRequest(false);
    if (err) toast.error(err.message);
    if (response) {
      dispatch(toggleWatchlistItem({ id: media.id }));
      onToggled(media.id, response.watched);
      toast.success(response.watched ? "Marked as watched ✅" : "Marked as unwatched");
    }
  };

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <MediaItem media={media} mediaType={media.mediaType} />
        {media.watched && (
          <Chip
            icon={<CheckCircleIcon />}
            label="Watched"
            color="success"
            size="small"
            sx={{ position: "absolute", top: 8, left: 8 }}
          />
        )}
      </Box>
      <Stack spacing={1} sx={{ marginTop: 1 }}>
        <LoadingButton
          fullWidth
          variant="contained"
          color={media.watched ? "warning" : "success"}
          startIcon={media.watched ? <WatchLaterIcon /> : <CheckCircleIcon />}
          loadingPosition="start"
          loading={onToggleRequest}
          onClick={onToggleWatched}
        >
          {media.watched ? "Mark Unwatched" : "Mark Watched"}
        </LoadingButton>
        <LoadingButton
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          loadingPosition="start"
          loading={onRequest}
          onClick={onRemove}
        >
          Remove
        </LoadingButton>
      </Stack>
    </>
  );
};

const WatchlistPage = () => {
  const [medias, setMedias] = useState([]);
  const [filteredMedias, setFilteredMedias] = useState([]);
  const [filter, setFilter] = useState("all");
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const skip = 8;

  useEffect(() => {
    const getWatchlist = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await watchlistApi.getList();
      dispatch(setGlobalLoading(false));
      if (err) toast.error(err.message);
      if (response) {
        setCount(response.totalResults);
        setMedias(response.results);
        setFilteredMedias(response.results.slice(0, skip));
      }
    };
    getWatchlist();
  }, [dispatch]);

  const getFiltered = (list, f) => {
    if (f === "watched") return list.filter(m => m.watched);
    if (f === "unwatched") return list.filter(m => !m.watched);
    return list;
  };

  const onFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
    setFilteredMedias(getFiltered(medias, newFilter).slice(0, skip));
  };

  const onLoadMore = () => {
    const filtered = getFiltered(medias, filter);
    setFilteredMedias([...filteredMedias, ...filtered.slice(page * skip, (page + 1) * skip)]);
    setPage(page + 1);
  };

  const onRemoved = (id) => {
    const newMedias = medias.filter(e => e.id !== id);
    setMedias(newMedias);
    setFilteredMedias(getFiltered(newMedias, filter).slice(0, page * skip));
    setCount(count - 1);
  };

  const onToggled = (id, watched) => {
    const newMedias = medias.map(e => e.id === id ? { ...e, watched } : e);
    setMedias(newMedias);
    setFilteredMedias(getFiltered(newMedias, filter).slice(0, page * skip));
  };

  return (
    <Box sx={{ ...uiConfigs.style.mainContent }}>
      <Container header={`Your Watchlist (${count})`}>
        <Stack direction="row" spacing={2} sx={{ marginBottom: 3 }}>
          {["all", "unwatched", "watched"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "contained" : "text"}
              onClick={() => onFilterChange(f)}
              sx={{ color: filter === f ? "primary.contrastText" : "text.primary" }}
            >
              {f}
            </Button>
          ))}
        </Stack>

        {filteredMedias.length === 0 && (
          <Typography color="text.secondary" textAlign="center" padding={4}>
            {filter === "all" ? "Your watchlist is empty." : `No ${filter} items.`}
          </Typography>
        )}

        <Grid container spacing={1} sx={{ marginRight: "-8px!important" }}>
          {filteredMedias.map((media, index) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <WatchlistItem
                media={media}
                onRemoved={onRemoved}
                onToggled={onToggled}
              />
            </Grid>
          ))}
        </Grid>

        {filteredMedias.length < getFiltered(medias, filter).length && (
          <Button onClick={onLoadMore} sx={{ marginTop: 2 }}>
            load more
          </Button>
        )}
      </Container>
    </Box>
  );
};

export default WatchlistPage;