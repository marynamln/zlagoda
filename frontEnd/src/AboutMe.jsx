import React, { useState, useEffect } from 'react';

function AboutMe({managerInfo}) {
  const [data, setData] = useState(null);
  const [password, setPassword] = useState('');

  useEffect(()=>{
      fetch(`http://localhost:8081/employee?id=${managerInfo}`)
      .then(res => res.json())
      .then(data => {
          setData(...data);
      })
      .catch(err => console.log(err));
  }, [managerInfo]);

  const handleChangePassword = () => {
    if(password.length == 0) {
        alert("Not all required fields are filled!");
        throw ("Not all required fields are filled!");
    }

    fetch(`http://localhost:8081/updatePassword?id=${managerInfo}&password=${password}`, {
        method: 'POST',
    })
    .then(res => res.json())
    .then(data => {
        setPassword('');
        setData(...data);
    })
    .catch(err => console.log(err.message));
};

  return (
      <div className="about-me-container container">
          <h2>About me</h2>
          {data && (
              <p>
                  <p className='p'><strong>Name:</strong> {data.empl_surname} {data.empl_name} {data.empl_patronymic}</p>
                  <p className='p'><strong>Address:</strong> {data.city}, {data.street}, {data.zip_code}</p>
                  <p className='p'><strong>Position:</strong> {data.empl_role}</p>
                  <p className='p'><strong>Salary:</strong> {data.salary}</p>
                  <p className='p'><strong>Date of birth:</strong> {data.date_of_birth}</p>
                  <p className='p'><strong>Date of start:</strong> {data.date_of_start}</p>
                  <p className='p'><strong>Phone number:</strong> {data.phone_number}</p>
              </p>
          )}

            <div className='employee-header'>
                <label className='p'><strong>Change password:   </strong></label>
                <input className="new-password" type='text' placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="add-button" onClick={handleChangePassword}>Save new password</button>
            </div>
      </div>
    );
}

export default AboutMe;