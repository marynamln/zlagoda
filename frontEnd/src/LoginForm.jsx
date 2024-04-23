import React, { useState, useEffect } from "react";

function LoginForm({ setIsLoggedIn, setIsLoggedInCashier, setCashierInfo, setManagerInfo }) {
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
        setManagerInfo(data.ID);
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
            <h2>ZLAGODA</h2>
            </div>
            <div className="employee-header">
            <p className='p'><strong>ID:</strong></p>
              <input className="new-password" type="number" value={id} onChange={(e) => setId(e.target.value)} />
            </div>
            <div className="employee-header">
            <p className='p'><strong>Password:</strong></p>
              <input className="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="employee-header">
            <button className="login-button" onClick={handleSubmit}>Log In</button>
            </div>
        </div>
  );
}

export default LoginForm;