import React, { useEffect, useState } from "react";
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/users')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div className="userlist">
      <h1>All Users</h1>
      <div className="userlist-container">
        {users.map((user) => (
          <div key={user._id} className="userlist-item">
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
