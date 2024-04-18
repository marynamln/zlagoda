import React, { useState, useEffect } from "react";

function LoginForm({ setIsLoggedIn, setIsLoggedInCashier, setCashierInfo }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    fetch(`http://localhost:8081/login?id=${id}&password=${password}`, {
      method: 'POST',
    })
    .then(res => {
      if(res.ok) {
        return res.json();
      } else {
        alert("Invalid ID or password!")
        setId('');
        setPassword('');
      }
    })
    .then(data => {
      if(data.role === 'manager') {
        setIsLoggedIn(true);
      } else if(data.role === 'cashier') {
        setIsLoggedInCashier(true);
        setCashierInfo(data.ID);
      }
    })
    .catch(err => {
      console.log(err);
    });
  };
  

  return (
    <div className="container">
            <div className="employee-header">
            <h3>ZLAGODA</h3>
            </div>
            <div className="employee-header">
              <label className="input-date">ID:</label>
              <input
                type="number" value={id} onChange={(e) => setId(e.target.value)} />
            </div>
            <div className="employee-header">
              <label className="input-date" htmlFor="password">Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="employee-header">
            <button className="search-button" onClick={handleSubmit}>Log In</button>
            </div>
        </div>
  );
}

export default LoginForm;