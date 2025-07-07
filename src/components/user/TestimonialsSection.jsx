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
  Rating,
} from "@mui/material";

const testimonials = [
  {
    id: "testimonial-1",
    name: "Mystic Aria",
    title: "Legendary Color Seer",
    avatar: "🧝‍♀️",
    rating: 5,
    text: "ChromaQuest transformed my understanding of color prophecy. The ChromaOrb never lies, and the rewards are beyond magical! I've earned more gold in a month than in years of traditional questing.",
  },
  {
    id: "testimonial-2",
    name: "Sir Chromdor",
    title: "Knight of the Prism Order",
    avatar: "🛡️",
    rating: 5,
    text: "As a warrior who values honor and fairness, I appreciate ChromaQuest's transparent gaming system. Every victory feels earned, and the tournaments are truly epic battles of wit and intuition.",
  },
  {
    id: "testimonial-3",
    name: "Luna Spectra",
    title: "High Priestess of Colors",
    avatar: "🌙",
    rating: 5,
    text: "The mystical energy of the ChromaOrb resonates with my soul. This isn't just a game - it's a spiritual journey where intuition meets destiny. The community of fellow seers is incredibly supportive.",
  },
  {
    id: "testimonial-4",
    name: "Thorin Goldseeker",
    title: "Master of Treasure",
    avatar: "⛏️",
    rating: 5,
    text: "I've found more treasure here than in any dungeon! The instant payouts and fair gameplay make ChromaQuest the most trustworthy quest I've embarked upon. Highly recommended for fellow adventurers!",
  },
  {
    id: "testimonial-5",
    name: "Sage Violette",
    title: "Oracle of the Purple Flame",
    avatar: "🔥",
    rating: 5,
    text: "My prophecies have never been more accurate! The ChromaOrb amplifies my natural abilities, and the strategic depth keeps me engaged for hours. A truly revolutionary gaming experience.",
  },
  {
    id: "testimonial-6",
    name: "Captain Scarlett",
    title: "Pirate of the Color Seas",
    avatar: "🏴‍☠️",
    rating: 5,
    text: "Ahoy! Found me greatest treasure right here, mateys! The real-time battles and competitive leaderboards make every session an adventure. The gold flows as freely as the ocean!",
  },
];

const cardStyles = {
  height: "100%",
  background:
    "linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(106, 13, 173, 0.05) 100%)",
  position: "relative",
  "&::before": {
    content: '"""',
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
          <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
            Tales from Fellow Seers
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "1.2rem", maxWidth: 600, mx: "auto" }}
          >
            Hear the epic stories of triumph from our community of legendary
            color prophets
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial) => (
            <Grid item xs={12} md={6} lg={4} key={testimonial.id}>
              <Card sx={cardStyles}>
                <CardContent sx={{ p: 4, pt: 6 }}>
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
                        sx={{ color: "#FFFFFF" }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#D4AF37" }}>
                        {testimonial.title}
                      </Typography>
                    </Box>
                  </Box>

                  <Rating
                    value={testimonial.rating}
                    readOnly
                    sx={{
                      mb: 2,
                      "& .MuiRating-iconFilled": { color: "#D4AF37" },
                    }}
                    aria-label={`${testimonial.rating} star rating`}
                  />

                  <Typography
                    variant="body1"
                    component="blockquote"
                    sx={{ color: "#CCCCCC", fontStyle: "italic" }}
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
