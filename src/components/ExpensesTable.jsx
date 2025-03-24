import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import { ValidationModule } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Register necessary modules
ModuleRegistry.registerModules([ClientSideRowModelModule, ValidationModule]);

const ExpensesTable = () => {
    const [expenses, setExpenses] = useState([]);
    const [gridApi, setGridApi] = useState(null);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await fetch("https://sqliteapi-hn28.onrender.com/api/expenses");
            const data = await response.json();
            setExpenses(data);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    const columnDefs = [
        { field: "id", headerName: "ID", width: 80, sortable: true },
        { field: "category", headerName: "Category", width: 150, filter: true },
        { field: "amount", headerName: "Amount", width: 120, filter: "agNumberColumnFilter" },
        { field: "date", headerName: "Date", width: 150, filter: "agDateColumnFilter" },
        { field: "comment", headerName: "Comment", flex: 1 },
    ];

    return (
        <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
            <AgGridReact
                rowData={expenses}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}
                onGridReady={(params) => setGridApi(params.api)}
            />
        </div>
    );
};

export default ExpensesTable;
