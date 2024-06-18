import React, { useEffect, useState } from "react";
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:4000/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`http://localhost:4000/user/${id}`, {
        method: 'DELETE',
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="userlist">
      <h1>All Users</h1>
      <div className="userlist-container">
        {users.map((user) => (
          <div key={user._id} className="userlist-item">
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <button onClick={() => deleteUser(user._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
