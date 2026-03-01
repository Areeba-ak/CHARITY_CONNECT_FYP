import { Box, Typography, Paper, IconButton } from "@mui/material";
import { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const teamMembers = [
  {
    name: "AREEBA KHALID",
    description:
      "A creative frontend developer dedicated to crafting sleek, intuitive and responsive user interfaces.",
    image: "/assets/profile.png",
    linkedin: "https://www.linkedin.com/in/%20areeba-khalid-26a58a263",
  },
  {
    name: "LARAIB BHATTI",
    description:
      "A seasoned backend developer specializing in building robust, scalable server-side applications.",
    image: "/assets/profile.png",
    linkedin: "https://www.linkedin.com/in/laraib-bhatti",
  },
  {
    name: "ASAD ULLAH KHAN",
    description:
      "An AI specialist focused on developing intelligent chatbot solutions and machine learning models.",
    image: "/assets/profile.png",
    linkedin: "https://www.linkedin.com/in/asad-ullah-khan",
  },
  {
    name: "MAAZ HASAN QIDWAI",
    description:
      "Blockchain expert ensuring secure and transparent payment transactions across the platform.",
    image: "/assets/profile.png",
    linkedin: "https://www.linkedin.com/in/maaz-qidwai",
  },
];

const AboutUs = () => {
  const boxStyles = {
    width: { xs: "100%", sm: "80%", md: "30%" },
    height: 150,
    p: 3,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const [index, setIndex] = useState(0);
  const visibleCards = 2;

  const handleNext = () => {
    if (index + visibleCards < teamMembers.length) {
      setIndex(index + visibleCards);
    }
  };

  const handlePrev = () => {
    if (index - visibleCards >= 0) {
      setIndex(index - visibleCards);
    }
  };

  return (
    <>
      {/* Header */}
      <Box sx={{ pt: 13, pb: 2, backgroundColor: "#f0f4f8", width: "97.7%" }}>
        <Paper
          elevation={2}
          sx={{
            textAlign: "center",
            py: 4,
            px: 2,
            mx: "auto",
            width: "100%",
            borderRadius: 0,
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom color="#0a5666">
            ABOUT US
          </Typography>
        </Paper>
      </Box>

      {/* Mission and Vision Side by Side */}
      <Box
        sx={{
          py: 5,
          px: 4,
          backgroundColor: "#f0f4f8",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 4,
          flexWrap: "wrap",
        }}
      >
        <Paper elevation={8} sx={boxStyles}>
          <Typography variant="h6" fontWeight="bold" color="green" gutterBottom>
            MISSION STATEMENT
          </Typography>
          <Typography sx={{ fontSize: "1.1rem" }}>
            At CharityConnect, our mission is to bridge the gap between those in need and compassionate donors by providing a transparent, secure, and user-friendly platform that facilitates impactful giving.
          </Typography>
        </Paper>

        <Paper elevation={8} sx={boxStyles}>
          <Typography variant="h6" fontWeight="bold" color="green" gutterBottom>
            VISION STATEMENT
          </Typography>
          <Typography sx={{ fontSize: "1.1rem" }}>
            We envision a world where every individual has the opportunity to thrive, supported by a community that cares and contributes to the well-being of others everywhere.
          </Typography>
        </Paper>
      </Box>

      {/* Our Story Section */}
      <Box sx={{ backgroundColor: "#ffffff", py: 6, px: { xs: 2, md: 8 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <Paper
            elevation={4}
            sx={{
              marginLeft: 10,
              marginTop: 5,
              flex: 1,
              p: 3,
              backgroundColor: "#EAEAEA",
              borderRadius: 2,
              maxWidth: { md: "50%" },
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              color="#288F22"
              align="center"
            >
              OUR STORY
            </Typography>
            <Typography sx={{ fontSize: "1.05rem", lineHeight: 1.8, textAlign: "left" }}>
              Founded in 2025, CharityConnect emerged from a collective desire to make
              charitable giving more accessible and effective. Recognizing the challenges
              faced by both donors and recipients in traditional charity models, we set out
              to create a digital platform that simplifies the donation process, ensures
              transparency, and amplifies the impact of every contribution.
              <br />
              <br />
              Through innovative technology and a commitment to integrity, we’ve built a
              community where stories of need are met with generosity, and every act of
              giving brings us closer to a more compassionate world.
            </Typography>
          </Paper>

          <Box
            sx={{
              marginTop: 10,
              flex: 1,
              maxWidth: { md: "50%" },
              height: 300,
              backgroundImage: `url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0Dpg7DBP1AHTeIcFLf9C9NeutNehjln3zmw&s")`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              borderRadius: 2,
            }}
          />
        </Box>
      </Box>

      {/* Meet the Team Section */}
      <Box sx={{ backgroundColor: "#ffffff", py: 6 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          color="#0a5666"
          gutterBottom
        >
          MEET THE TEAM
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
            mt: 4,
          }}
        >
          <IconButton onClick={handlePrev} disabled={index === 0}>
            <ArrowBackIosIcon />
          </IconButton>

          {teamMembers.slice(index, index + visibleCards).map((member, i) => (
            <Paper
              key={i}
              elevation={3}
              sx={{
                width: 250,
                p: 3,
                textAlign: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="green" gutterBottom>
                {member.name}
              </Typography>
              <img
                src={member.image}
                alt={member.name}
                style={{ width: 40, height: 40, margin: "10px auto" }}
              />
              <Typography sx={{ fontSize: "1.1rem" }}>{member.description}</Typography>

              {/* LinkedIn Clickable Icon */}
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                <img
                  src="/assets/linkedin.png"
                  alt="LinkedIn"
                  style={{ width: 24, height: 24, marginBottom: 8, marginTop: 9 }}
                />
              </a>

              {/* <Typography variant="body2" color="primary">
                See More
              </Typography> */}
            </Paper>
          ))}

          <IconButton
            onClick={handleNext}
            disabled={index + visibleCards >= teamMembers.length}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>
    </>
  );
};

export default AboutUs;