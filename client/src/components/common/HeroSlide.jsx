import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { Box, Button, Chip, Divider, Stack, Typography, useTheme } from "@mui/material";
import mediaApi from "../../api/modules/media.api.js";
import { Autoplay } from "swiper/modules";
import genreApi from "../../api/modules/genre.api.js";
import { toast } from "react-toastify";
import { setGlobalLoading } from '../../redux/features/globalLoadingSlice.js';
import uiConfigs from '../../configs/ui.configs.js';
import { Swiper, SwiperSlide } from "swiper/react";
import tmdbConfigs from "../../api/configs/tmdb.configs.js";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Link } from "react-router-dom";
import CircularRate from "../common/CircularRate.jsx";

const HeroSlide = ({ mediaType, mediaCategory }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true); // ✅ Add loading state

    useEffect(() => {
        const getMedias = async () => {
            const { response, err } = await mediaApi.getList({
                mediaType,
                mediaCategory,
                page: 1,
            });

            if (response) {
                console.log('✅ Movies loaded:', response.results); // ✅ Debug log
                setMovies(response.results || []); // ✅ Add fallback
            }
            
            if (err) {
                console.error('❌ Movies error:', err); // ✅ Debug log
                toast.error(err.message);
                setMovies([]); // ✅ Set empty array on error
            }

            dispatch(setGlobalLoading(false));
            setLoading(false); // ✅ Stop loading
        };

        const getGenres = async () => {
            dispatch(setGlobalLoading(true));
            setLoading(true); // ✅ Start loading

            const { response, err } = await genreApi.getList({ mediaType });

            if (response) {
                console.log('✅ Genres loaded:', response.genres); // ✅ Debug log
                setGenres(response.genres || []); // ✅ Add fallback
                getMedias();
            }

            if (err) {
                console.error('❌ Genres error:', err); // ✅ Debug log
                toast.error(err.message);
                dispatch(setGlobalLoading(false));
                setLoading(false); // ✅ Stop loading
            }
        };

        getGenres();
    }, [mediaType, mediaCategory, dispatch]);

    // ✅ Show loading state
    if (loading) {
        return (
            <Box sx={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Typography variant="h5">Loading hero slides...</Typography>
            </Box>
        );
    }

    // ✅ Show empty state
    if (!movies || movies.length === 0) {
        return (
            <Box sx={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Typography variant="h5">No movies available</Typography>
            </Box>
        );
    }

    // ✅ Render slides
    return (
        <Box sx={{
            position: "relative",
            color: "primary.contrastText",
            "&::before": {
                content: '""',
                width: "100%",
                height: "30%",
                position: "absolute",
                bottom: 0,
                left: 0,
                zIndex: 2,
                pointerEvents: "none",
                ...uiConfigs.style.gradientBgImage[theme.palette.mode]
            }
        }}>
            <Swiper
                grabCursor={true}
                loop={true}
                modules={[Autoplay]}
                style={{ width: "100%", height: "max-content" }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false
                }}
            >
                {movies.map((movie, index) => (
                    <SwiperSlide key={movie.id || index}> {/* ✅ Use movie.id if available */}
                        <Box sx={{
                            paddingTop: {
                                xs: "130%",
                                sm: "80%",
                                md: "60%",
                                lg: "45%"
                            },
                            backgroundPosition: "top",
                            backgroundSize: "cover",
                            backgroundImage: `url(${tmdbConfigs.backdropPath(movie.backdrop_path || movie.poster_path)})`
                        }} />

                        <Box sx={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            ...uiConfigs.style.horizontalGradientBgImage[theme.palette.mode]
                        }} />

                        <Box sx={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            paddingX: { sm: "10px", md: "5rem", lg: "10rem" }
                        }}>
                            <Box sx={{
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                paddingX: "30px",
                                color: "text.primary",
                                width: { sm: "unset", md: "30%", lg: "40%" }
                            }}>
                                <Stack spacing={4} direction="column">
                                    <Typography
                                        variant="h4"
                                        fontSize={{ xs: "2rem", md: "2rem", lg: "4rem" }}
                                        fontWeight="700"
                                        sx={{ ...uiConfigs.style.typoLines(2, "left") }}
                                    >
                                        {movie.title || movie.name}
                                    </Typography>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <CircularRate value={movie.vote_average} />
                                        <Divider orientation="vertical" />

                                        {/* ✅ Safely handle genre_ids */}
                                        {movie.genre_ids && movie.genre_ids.length > 0 && (
                                            movie.genre_ids.slice(0, 2).map((genreId, index) => {
                                                const genre = genres.find(e => e.id === genreId);
                                                return genre ? (
                                                    <Chip
                                                        variant="filled"
                                                        color="primary"
                                                        key={index}
                                                        label={genre.name}
                                                    />
                                                ) : null;
                                            })
                                        )}
                                    </Stack>

                                    <Typography variant="body1" sx={{ ...uiConfigs.style.typoLines(3) }}>
                                        {movie.overview}
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<PlayArrowIcon />}
                                        component={Link}
                                        to={`/${mediaType}/${movie.id}`}
                                        sx={{ width: "max-content" }}
                                    >
                                        watch now
                                    </Button>
                                </Stack>
                            </Box>
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};

export default HeroSlide;