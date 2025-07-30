import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";

const testimonials = [
  {
    id: "testimonial-1",
    name: "Mystic Aria",
    title: "Legendary Color Seer",
    avatar: "🧝‍♀️",
    rating: 5,
    text: "Win2Win transformed my understanding of color prophecy. The ChromaOrb never lies, and the rewards are beyond magical! I've earned more gold in a month than in years of traditional questing.",
  },
  {
    id: "testimonial-2",
    name: "Sir Chromdor",
    title: "Knight of the Prism Order",
    avatar: "🛡️",
    rating: 5,
    text: "As a warrior who values honor and fairness, I appreciate Win2Win's transparent gaming system. Every victory feels earned, and the tournaments are truly epic battles of wit and intuition.",
  },
  {
    id: "testimonial-3",
    name: "Luna Spectra",
    title: "High Priestess of Colors",
    avatar: "🌙",
    rating: 5,
    text: "The mystical energy of the ChromaOrb resonates with my soul. This isn't just a game - it's a spiritual journey where intuition meets destiny. The community of fellow seers is incredibly supportive.",
  },
];

const cardStyles = {
  height: "100%",
  background: "rgba(30, 30, 30, 0.8)",
  border: "1px solid rgba(212, 175, 55, 0.3)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 16,
    left: 16,
    fontSize: "4rem",
    color: "rgba(212, 175, 55, 0.3)",
    fontFamily: "serif",
    lineHeight: 1,
  },
};

const TestimonialsSection = () => {
  return (
    <Box
      component="section"
      sx={{ py: 8, backgroundColor: "#1A1A1A" }}
      aria-label="Testimonials"
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              mb: 2,
              color: "#D4AF37",
              fontFamily: "serif",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            Tales from Fellow Seers
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.2rem",
              maxWidth: 600,
              mx: "auto",
              color: "#CCCCCC",
            }}
          >
            Hear the epic stories of triumph from our community of legendary
            color prophets
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial) => (
            <Grid item xs={12} md={6} lg={4} key={testimonial.id}>
              <Card sx={cardStyles}>
                <CardContent sx={{ p: 4, pt: 8 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        backgroundColor: "transparent",
                        fontSize: "2rem",
                        mr: 2,
                      }}
                      aria-hidden="true"
                    >
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ color: "#FFFFFF", fontWeight: 600 }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(212, 175, 55, 0.8)",
                          fontStyle: "italic",
                        }}
                      >
                        {testimonial.title}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      color: "rgba(212, 175, 55, 0.8)",
                      fontSize: "1.5rem",
                      mb: 2,
                    }}
                  >
                    {"🌡".repeat(testimonial.rating)}
                  </Typography>

                  <Typography
                    variant="body1"
                    component="blockquote"
                    sx={{
                      color: "#CCCCCC",
                      fontStyle: "italic",
                      position: "relative",
                      pl: 2,
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        height: "100%",
                        width: "3px",
                        background: "rgba(212, 175, 55, 0.5)",
                      },
                    }}
                  >
                    {testimonial.text}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

TestimonialsSection.propTypes = {
  testimonials: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
    })
  ),
};

export default TestimonialsSection;
