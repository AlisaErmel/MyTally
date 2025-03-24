import * as React from 'react';
import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Box, TextField, MenuItem, Select, InputLabel, FormControl, Button } from '@mui/material';
import InputAdornment from "@mui/material/InputAdornment";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
import PieChart from './PieChart';


//Icons for categories
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import SpaIcon from '@mui/icons-material/Spa';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import PublicIcon from '@mui/icons-material/Public';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import PoolIcon from '@mui/icons-material/Pool';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import HomeIcon from '@mui/icons-material/Home';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

const categories = [
    { label: "groceries", icon: <LocalGroceryStoreIcon /> },
    { label: "beauty", icon: <SpaIcon /> },
    { label: "transport", icon: <DirectionsBusIcon /> },
    { label: "taxi", icon: <LocalTaxiIcon /> },
    { label: "travelling", icon: <PublicIcon /> },
    { label: "rent", icon: <ApartmentIcon /> },
    { label: "phone", icon: <SmartphoneIcon /> },
    { label: "cafe", icon: <StorefrontIcon /> },
    { label: "coffee", icon: <LocalCafeIcon /> },
    { label: "health", icon: <MedicalInformationIcon /> },
    { label: "sport", icon: <PoolIcon /> },
    { label: "clothes", icon: <CheckroomIcon /> },
    { label: "home", icon: <HomeIcon /> },
    { label: "electronics", icon: <DevicesOtherIcon /> },
    { label: "other", icon: <MoreHorizIcon /> }
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const getStyles = (category, selectedCategory, theme) => ({
    fontWeight: selectedCategory === category ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular,
});

const AddExpense = () => {
    const theme = useTheme();
    const [formData, setFormData] = useState({
        category: "",
        amount: "",
        date: dayjs(),
        comment: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [expenses, setExpenses] = useState([])

    useEffect(() => {
        // Fetch expenses when the component mounts
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await fetch("https://sqliteapi-hn28.onrender.com/api/expenses");
            const data = await response.json();
            setExpenses(data); // Store expenses data in state
            return data; // Return the fetched data to use in handleSubmit
        } catch (error) {
            console.error("Error fetching expenses:", error);
            return []; // Return an empty array in case of error
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (newValue) => {
        setFormData(prev => ({
            ...prev,
            date: newValue,
        }));
    };


    const validateForm = () => {
        const { amount, date, category } = formData;
        if (!category || !amount || !date) return false;
        if (isNaN(amount) || amount <= 0) return false;
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            alert("Please fill out all fields correctly.");
            return;
        }

        const formattedDate = formData.date.format('DD.MM.YYYY');
        const updatedFormData = { ...formData, date: formattedDate };

        try {
            const response = await fetch("https://sqliteapi-hn28.onrender.com/api/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedFormData),
            });

            if (response.ok) {
                setSuccessMessage("Your expense was added successfully!");
                setFormData({ category: "", amount: "", date: dayjs(), comment: "" });

                const updatedExpenses = await fetchExpenses(); // Define this function to get updated data
                setExpenses(updatedExpenses);

                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                alert("Error adding expense");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                padding: 2,
                '@media (maxWidth: 600px)': {
                    padding: 1, // reduce padding on small screens
                },
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    width: "100%",
                    maxWidth: "500px",
                    margin: "0 auto",
                    padding: "20px",
                    boxSizing: "border-box",
                    '@media (maxWidth: 600px)': {
                        maxWidth: "100%", // make form take full width on small screens
                        padding: "10px", // reduce padding on small screens
                    },
                }}
            >
                <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        input={<OutlinedInput label="Category" />}
                        MenuProps={MenuProps}
                    >
                        {categories.map((cat) => (
                            <MenuItem
                                key={cat.label}
                                value={cat.label}
                                style={getStyles(cat.label, formData.category, theme)}
                            >
                                {cat.icon} &nbsp; {cat.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">€</InputAdornment>
                        ),
                    }}
                    inputProps={{ min: 0 }}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                        label="Date"
                        name="date"
                        value={formData.date}
                        onChange={handleDateChange}
                        required
                        textField={(params) => <TextField {...params} fullWidth />}
                    />
                </LocalizationProvider>

                <TextField
                    label="Comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                />

                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        backgroundColor: 'rgb(162, 122, 208)',
                        color: 'white',
                        border: '8px solid transparent',
                        borderImage: 'linear-gradient(45deg,rgb(228, 151, 190),rgb(185, 90, 185)) 1',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                            backgroundColor: 'rgb(162,122,208)',
                            borderImage: 'linear-gradient(45deg, #FF007F, #800080) 1',
                        },
                    }}
                    fullWidth
                >
                    Add Expense
                </Button>

                <Box
                    sx={{
                        marginTop: 2, // Ensuring space between the button and the chart
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <PieChart expenses={expenses} />
                </Box>


                {successMessage && (
                    <Alert
                        icon={<CheckIcon fontSize="inherit" />}
                        severity="success"
                        sx={{
                            marginTop: 2,
                            width: "90%", // Adjust width for responsiveness
                            maxWidth: "430px", // Prevent it from being too wide
                            textAlign: "center",
                            position: 'absolute',
                            bottom: "5%", // Dynamic positioning
                            left: "50%", // Center horizontally
                            transform: "translateX(-50%)", // Ensure true centering
                            boxShadow: 3, // Optional: Add shadow for better visibility
                        }}
                    >
                        {successMessage}
                    </Alert>
                )}

            </form>
        </Box>
    );
};

export default AddExpense;
