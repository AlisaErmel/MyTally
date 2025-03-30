import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Menu, MenuItem } from "@mui/material";
import AddExpense from "./components/AddExpense";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import PieChartIcon from '@mui/icons-material/PieChart';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import PieChart from "./components/PieChart"


const theme = createTheme({
  typography: {
    fontFamily: '"DynaPuff", sans-serif', // Default font for the body
    h3: {
      fontFamily: '"Fascinate", sans-serif', // Override "My Tally" header font
    },
    h2: {
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

const backgrounds = [
  { name: "Pastel", url: "/images/back.jpg" },
  { name: "Flowers", url: "/images/flowersback.jpg" },
  { name: "Gradient", url: "/images/gradientback.jpg" },
  { name: "Bright", url: "/images/brightback.jpg" },
  { name: "Universe", url: "/images/universeback.jpg" }
];

function App() {
  const [state, setState] = useState({ left: false });
  const [expenses, setExpenses] = useState([]);
  const [background, setBackground] = useState(localStorage.getItem("background") || backgrounds[0].url); // Load saved background
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("https://sqliteapi-hn28.onrender.com/api/expenses");
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      } else {
        console.error("Error fetching expenses");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // Toggle the drawer state
  const toggleDrawer = (open) => () => {
    setState({ left: open });
  };

  // Open background selection menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Change background and store selection in localStorage
  const changeBackground = (newBackground) => {
    setBackground(newBackground);
    localStorage.setItem("background", newBackground);
    handleMenuClose();
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
        {['Expenses', 'Pie Chart'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => navigate(index === 0 ? "/expenses" : "/piechart")}>
              <ListItemIcon>
                {index % 2 === 0 ? <ShoppingBasketIcon /> : <PieChartIcon />}
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
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transition: "background 0.5s ease-in-out",
        }}
      >

        {/* Button to open menu */}
        <Button
          onClick={handleMenuOpen}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            color: "white",
            backgroundColor: "#213547",
          }}
        >
          Choose Background
        </Button>

        {/* Background selection menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          {backgrounds.map((bg) => (
            <MenuItem key={bg.name} onClick={() => changeBackground(bg.url)}>
              {bg.name}
            </MenuItem>
          ))}
        </Menu>


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
              color: "#213547"
            },
          }}
        >
          {list()}
        </SwipeableDrawer>

        <Routes>
          <Route path="/expenses" element={<AddExpense />} />
          <Route path="*" element={<Navigate to="/expenses" />} />
          <Route path="/piechart" element={<PieChart expenses={expenses} />} />
        </Routes>

      </Box>
    </ThemeProvider>
  );
}

export default App;