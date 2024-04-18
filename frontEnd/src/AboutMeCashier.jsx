import React, { useState, useEffect } from 'react';

function AboutMeCashier({ cashierInfo }) {
    const [data, setData] = useState(null);

    useEffect(()=>{
        fetch(`http://localhost:8081/employee?id=${cashierInfo}`)
        .then(res => res.json())
        .then(data => {
            setData(...data);
        })
        .catch(err => console.log(err));
    }, [cashierInfo]);

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
        </div>
      );
}
export default AboutMeCashier;