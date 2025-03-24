import React from "react";
import { Box, Typography, Button } from "@mui/material";
import AddExpense from "./components/AddExpense";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";


const theme = createTheme({
  typography: {
    fontFamily: '"DynaPuff", sans-serif', // Default font for the body
    h3: {
      fontFamily: '"Fascinate", sans-serif', // Override "My Tally" header font
    },
    button: {
      fontFamily: '"DynaPuff", sans-serif', // Apply Pacifico to buttons
    },
    body1: {
      fontFamily: '"DynaPuff", sans-serif', // Apply Pacifico to text in general
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: '"DynaPuff", sans-serif', // Apply Pacifico to TextFields
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"DynaPuff", sans-serif', // Apply Pacifico to Buttons
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          fontFamily: '"DynaPuff", sans-serif', // Apply Pacifico to calendar days
        },
      },
    },
  },
});

function App() {
  const [state, setState] = React.useState({
    left: false,
  });

  const navigate = useNavigate();

  // Toggle the drawer state
  const toggleDrawer = (open) => () => {
    setState({ left: open });
  };

  // Drawer list items
  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {['Expenses'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => navigate("/expenses")}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h5" fontWeight="bold">
                    {text}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );


  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Make the container take up the full viewport height
          padding: 2, // Add some padding to avoid the content touching the edges
        }}
      >


        <Button onClick={toggleDrawer(true)} sx={{ position: "absolute", top: 20, left: 20, color: "pink", backgroundColor: "purple" }}>
          Open Bar
        </Button>


        <SwipeableDrawer
          anchor="left"
          open={state.left}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          sx={{
            "& .MuiDrawer-paper": {
              backgroundColor: "#FFD0F0", // Change the background color of the drawer
              color: "#2B3458"
            },
          }}
        >
          {list()}
        </SwipeableDrawer>


        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            marginTop: 8,
            marginBottom: 0, // Space between the header and the form
            fontSize: { xs: "2rem", sm: "3rem", md: "4rem" }, // Responsive font size
          }}
        >
          My Tally
        </Typography>

        <AddExpense />

      </Box>
      <Routes>
        <Route path="/" element={<Navigate to="/expenses" />} />
        <Route path="*" element={<Navigate to="/expenses" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;