import React from 'react';
import { Paper, Stack, Button, Box, Typography, useTheme } from '@mui/material';
import Container from "./Container.jsx" ; 
import Logo from "./Logo.jsx" ;
import menuConfigs from "../../configs/menu.configs.js" ; 
import {Link} from "react-router-dom" ;

const Footer = () => {
    const theme = useTheme() ; 

    return (
        <Container>
      <Paper square={true} sx={{ backgroundImage: "unset", padding: "2rem", position: 'relative' }}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          direction={{ xs: "column", md: "row " }}
          sx={{ height: "max-content" }}
        >
          <Logo />
          <Box>
            {menuConfigs.main.map((item, index) => (
              <Button
                key={index}
                sx={{ color: "inherit" }}
                component={Link}
                to={item.path}
              >
                {item.display}
              </Button>
            ))}
          </Box>
        </Stack>
        <Typography
          variant="body2"
          align="center"
          sx={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            color: 'gray',
          }}
        >
          &copy; 2022 CineCritic Developed by{' '}
          <a
            style={{
              textDecoration: 'none',
              color: theme.palette.primary.main
            }}
            href="https://www.instagram.com/m_hasan_sayeed/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hasan Sayeed
          </a>
        </Typography>
      </Paper>
    </Container>
    );
};

export default Footer;