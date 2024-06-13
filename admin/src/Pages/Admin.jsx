import React from "react";
import "./CSS/Admin.css";
import Sidebar from "../Components/Sidebar/Sidebar";
import AddProduct from "../Components/AddProduct/AddProduct";
import ListProduct from "../Components/ListProduct/ListProduct";
import Orders from "../Components/Orders/Orders";
import UserList from "../Components/UserList/UserList.jsx";
import { Route, Routes } from "react-router-dom";

const Admin = () => {
  return (
    <div className="admin">
      <Sidebar />
      <Routes>
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/listproduct" element={<ListProduct />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/users" element={<UserList />} />
      </Routes>
    </div>
  );
};

export default Admin;