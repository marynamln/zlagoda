import React, { useState, useEffect } from 'react';

function Employee({ managerInfo }) {
    const [data, setData] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [sortDirection, setSortDirection] = useState('asc');
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [surname, setSurname] = useState('');
    const [surnameNew, setSurnameNew] = useState('');
    const [name, setName] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [role, setRole] = useState('');
    const [salary, setSalary] = useState('');
    const [dateBirth, setDateBirth] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [zip, setZip] = useState('');
    const [password, setPassword] = useState('');
    
    const [editedData, setEditedData] = useState([...sortedData]);
    const [editSurname, setEditSurname] = useState('');
    const [editName, setEditName] = useState('');
    const [editPatronymic, setEditPatronymic] = useState('');
    const [editRole, setEditRole] = useState('');
    const [editSalary, setEditSalary] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editCity, setEditCity] = useState('');
    const [editStreet, setEditStreet] = useState('');
    const [editZip, setEditZip] = useState('');
    const [editDateBirth, setEditDateBirth] = useState('');
    const [editDateStart, setEditDateStart] = useState('');

    useEffect(()=>{
        fetch('http://localhost:8081/employee')
        .then(res => res.json())
        .then(data => {
            setData(data);
            setSortedData(data);
            setEditedData(data);
        })
        .catch(err => console.log(err));
    }, []);

    const handleEdit = (index) => {
        const updatedData = [...editedData];
        updatedData[index].isEditing = true;
        setEditedData(updatedData);
        setEditSurname(updatedData[index].empl_surname);
        setEditName(updatedData[index].empl_name);
        setEditPatronymic(updatedData[index].empl_patronymic);
        setEditPhone(updatedData[index].phone_number);
        setEditRole(updatedData[index].empl_role);
        setEditSalary(updatedData[index].salary);
        setEditCity(updatedData[index].city);
        setEditStreet(updatedData[index].street);
        setEditZip(updatedData[index].zip_code);
        const formattedDate = new Date(updatedData[index].date_of_birth).toISOString().slice(0, 10);
        const formattedDateStart = new Date(updatedData[index].date_of_start).toISOString().slice(0, 10);

        setEditDateBirth(formattedDate);
        setEditDateStart(formattedDateStart);
    };

    const handleSave = (id) => {
        if(editSurname.length == 0 || editName.length == 0 || editDateBirth.length == 0 || editDateStart.length == 0 || editCity.length == 0 || editStreet.length == 0 || editZip.length == 0 || editPhone.length == 0){
            alert("Not all required fields are filled!");
            throw ("Not all required fields are filled!");
        }

        const today = new Date();
        const birthDate = new Date(editDateBirth);
        const startDate = new Date(editDateStart);

        if (birthDate > today) {
            alert("Date of birth cannot be in the future!");
            setEditDateBirth('');
            throw ("Date of birth cannot be in the future!");
        }

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            alert("Employee must be at least 18 years old!");
            setEditDateBirth('');
            throw ("Employee must be at least 18 years old!");
        }

        if (startDate > today) {
            alert("Date cannot be in the future!");
            setEditDateStart('');
            throw ("Date cannot be in the future!");
        }

        if(salary < 0) {
            alert("Salary cannot be in negative!");
            setEditSalary('');
            throw ("Salary cannot be in negative!");
        }

        if(editPhone.length > 13){
            alert("Phone number is too long! It should not exceed 13 characters.");
            setEditPhone('');
            throw ("Phone number is too long!");
        }

        if(editZip.length > 5) {
            alert("Zip code is too long! It should not exceed 5 characters.");
            setEditZip('');
            throw ("Zip code is too long!");
        }

        fetch(`http://localhost:8081/employee/${id}?surname=${editSurname}&name=${editName}&patronymic=${editPatronymic}&role=${editRole}&salary=${editSalary}&dateBirth=${editDateBirth}&dateStart=${editDateStart}&phone=${editPhone}&city=${editCity}&street=${editStreet}&zipCode=${editZip}`, {
            method: 'POST',
        })
        .then(res => {
            if (res.ok) {
                const updatedData = [...editedData];
                setEditedData(updatedData);
            }
        })
        .catch(err => console.log(err.message));
    
        fetch('http://localhost:8081/employee')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setSortedData(data);
                setEditedData(data);
            })
            .catch(err => console.log(err));
    };

    const handleDelete = id => {
        fetch(`http://localhost:8081/employee/${id}`, {
            method: 'DELETE',
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else if (res.status === 500) {
              alert("Emloyee cannot be deleted!");
              throw ("Emloyee cannot be deleted!");
            }
          })
        .then(() => {
            setData(data.filter(item => item.id_employee !== id));
            setSortedData(sortedData.filter(item => item.id_employee !== id));
            setEditedData(editedData.filter(item => item.id_employee !== id));
        })
        .catch(err => console.log(err));
    };

    const sortBySurname = () => {
        const sorted = [...sortedData].sort((a, b) => {
            const surnameA = a.empl_surname.toUpperCase();
            const surnameB = b.empl_surname.toUpperCase();
            if (surnameA < surnameB) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (surnameA > surnameB) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
        setSortedData(sorted);
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    useEffect(() => {
        setEditedData([...sortedData]);
    }, [sortedData]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        if (event.target.value === "all") {
            setSortedData(data);
        } else {
            const filteredData = data.filter(item => item.empl_role.toLowerCase() === event.target.value);
            setSortedData(filteredData);
            setEditedData(filteredData);
        }
    };  
    
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Employee Report</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
            }
            tr:nth-child(even) {
                background-color: #f2f2f2;
            }
        `);
        printWindow.document.write('</style></head><body>');
        printWindow.document.write('<table style="width:100%">');
        printWindow.document.write('<thead><tr><th>id</th><th>Surname</th><th>Name</th><th>Patronymic</th><th>Role</th><th>Salary</th><th>Date birth</th><th>Date start</th><th>Phone number</th><th>City</th><th>Street</th><th>Zip code</th></tr></thead>');
        printWindow.document.write('<tbody>');
        sortedData.forEach(d => {
            printWindow.document.write('<tr>');
            printWindow.document.write(`<td>${d.id_employee}</td>`);
            printWindow.document.write(`<td>${d.empl_surname}</td>`);
            printWindow.document.write(`<td>${d.empl_name}</td>`);
            printWindow.document.write(`<td>${d.empl_patronymic}</td>`);
            printWindow.document.write(`<td>${d.empl_role}</td>`);
            printWindow.document.write(`<td>${d.salary}</td>`);
            printWindow.document.write(`<td>${d.date_of_birth}</td>`);
            printWindow.document.write(`<td>${d.date_of_start}</td>`);
            printWindow.document.write(`<td>${d.phone_number}</td>`);
            printWindow.document.write(`<td>${d.city}</td>`);
            printWindow.document.write(`<td>${d.street}</td>`);
            printWindow.document.write(`<td>${d.zip_code}</td>`);
            printWindow.document.write('</tr>');
        });
        printWindow.document.write('</tbody></table></body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    const handleSurnameSearch = (e) => {
        setSurname(e.target.value);
    };

    const searchEmployeeBySurname = () => {
        fetch(`http://localhost:8081/employee?surname=${surname}`)
            .then(res => res.json())
            .then(data => {
                setData(data);
                setSortedData(data); 
                setEditedData(data);
            })
            .catch(err => console.log(err));
    };

    const handleAdd = () => {
        if(surnameNew.length == 0 || name.length == 0 || role.length == 0 || salary.length == 0 || phone.length == 0 || city.length == 0 || street.length == 0 || zip.length == 0 || dateBirth.length == 0 || dateStart.length == 0 || password.length == 0) {
            alert("Not all required fields are filled!");
            throw ("Not all required fields are filled!");
        }

        if(password.length > 64) {
            alert("Password is too long! It should not exceed 5 characters.");
            setPassword('');
            throw ("Password is too long!");
        }

        if(phone.length > 13) {
            alert("Phone number is too long! It should not exceed 13 characters.");
            setPhone('');
            throw ("Phone number is too long!");
        }

        const existingPhone = data.find(empl => empl.phone_number === phone);
        if (existingPhone) {
            alert("Employee with the same phone number already exists!");
            setPhone('');
            throw ("Employee with the same phone number already exists!");
        }

        const today = new Date();
        const birthDate = new Date(dateBirth);
        const startDate = new Date(dateStart);

        if (birthDate > today) {
            alert("Dates cannot be in the future!");
            setDateBirth('');
            throw ("Dates cannot be in the future!");
        }

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            alert("Employee must be at least 18 years old!");
            setDateBirth('');
            throw ("Employee must be at least 18 years old!");
        }

        if (startDate > today) {
            alert("Dates cannot be in the future!");
            setDateStart('');
            throw ("Dates cannot be in the future!");
        }

        if(salary < 0) {
            alert("Salary cannot be in negative!");
            setSalary('');
            throw ("Salary cannot be in negative!");
        }

        fetch(`http://localhost:8081/employee?surname=${surnameNew}&name=${name}&patronymic=${patronymic}&role=${role}&salary=${salary}&phone=${phone}&city=${city}&street=${street}&zipCode=${zip}&dateBirth=${dateBirth}&dateStart=${dateStart}&password=${password}`, {
            method: 'POST',
        })
        .then(res => {
        if (res.ok) {
            return res.json();
        }
        })
        .then(() => {
            setSurnameNew('');
            setName('');
            setPatronymic('');
            setPhone('');
            setCity('');
            setStreet('');
            setZip('');
            setDateBirth('');
            setDateStart('');
            setRole('');
            setSalary('');
            setPassword('');
        })
        .catch(err => console.log(err.message));

        fetch('http://localhost:8081/employee')
        .then(res => res.json())
        .then(data => {
            setData(data);
            setSortedData(data);
            setEditedData(data);
        })
        .catch(err => console.log(err));
    };

    const [statisticsData, setStatisticsData] = useState([]);
    const [statistics, setStatistics] = useState(false);

    const handleStatistics = () => {
        fetch('http://localhost:8081/employee/statistics')
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setStatisticsData(data);
            setStatistics(true);
        })
        .catch((err) => console.log(err));
    };

    const handleCloseStatistics = () => {
        setStatistics(false);
    };

    return (
        <div className="cart-employee container">
            <div className="employee-header" onChange={handleCategoryChange}>  
                <select>
                    <option value="all">All Employees</option>
                    <option value="manager">Managers</option>
                    <option value="cashier">Cashiers</option>
                </select>
            </div>

            <hr className='line'></hr>

            <div className="employee-header">  
                <input className="input" type="text" placeholder="Enter surname" value={surname} onChange={handleSurnameSearch}></input>
                <button className="search-button" onClick={searchEmployeeBySurname}>Search</button> 
            </div>

            <hr className='line'></hr>

            <div className="employee-header">  
                <input className="input" type="text" placeholder="Surname" value={surnameNew} onChange={(e) => setSurnameNew(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}></input>
                <input className="input" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}></input>
                <input className="input" type="text" placeholder="Patronymic" value={patronymic} onChange={(e) => setPatronymic(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}></input>
                <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="select">Select role</option>
                    <option value="manager">manager</option>
                    <option value="cashier">cashier</option>
                </select>
                <input className="input" type="number" min={1} placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)}></input>
                <input className="input" type="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)}></input>
                <input className="input" type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}></input>
                <input className="input" type="text" placeholder="Street" value={street} onChange={(e) => setStreet(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}></input>
                <input className="input" type="text" placeholder="Zip code" value={zip} onChange={(e) => setZip(e.target.value)}></input>
            </div>

            <div className="employee-header">  
                <label className="input-date">Date of birth: </label>
                <input className="input-d" type="date" value={dateBirth} onChange={(e) => setDateBirth(e.target.value)}/>
                <label className="input-date">Start date: </label>
                <input className="input-d" type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)}/>
                <label className="input-date">Password: </label>
                <input className="input" type='text' placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button className="add-button" onClick={handleAdd}>Add employee</button>
            </div>

            <hr className='line'></hr>

            <div className="employee-header">
                <button className="print-button" onClick={handlePrint}>Print information</button>
                <button className="sort-button" onClick={sortBySurname}>Sort by surname</button>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Surname</th>
                            <th>Name</th>
                            <th>Patronymic</th>
                            <th>Role</th>
                            <th>Salary</th>
                            <th>Date birth</th>
                            <th>Date start</th>
                            <th>Phone number</th>
                            <th>City</th>
                            <th>Street</th>
                            <th>Zip code</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>

                    {editedData.map((d, i) => (
                        <tr key={i}>
                            <td>{d.id_employee}</td>
                            <td>
                            {d.isEditing ?
                                (<input className="input" type="text" value={editSurname} onChange={(e) => setEditSurname(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}/>
                                ) : (d.empl_surname)
                                }     
                            </td>
                            <td>
                            {d.isEditing ?
                                (<input className="input" type="text" value={editName} onChange={(e) => setEditName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}/>
                                ) : (d.empl_name)
                                }     
                            </td>
                            <td>
                            {d.isEditing ?
                                (<input className="input" type="text" value={editPatronymic} onChange={(e) => setEditPatronymic(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}/>
                                ) : (d.empl_patronymic)
                                }     
                            </td>
                            <td>
                                {(d.isEditing) && !(d.id_employee === managerInfo) ? (
                                    <select value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                                        <option value="manager">manager</option>
                                        <option value="cashier">cashier</option>
                                    </select>
                                ) : (d.empl_role)}
                            </td>
                            <td>
                                {(d.isEditing) && !(d.id_employee === managerInfo) ? (
                                    <input className="input" type="number" min={1} value={editSalary} onChange={(e) => setEditSalary(e.target.value)}></input>
                                ) : (d.salary)}
                            </td>
                            <td>
                                {d.isEditing ? (
                                    <input type="date" value={editDateBirth} onChange={(e) => setEditDateBirth(e.target.value)}/>
                                ) : (d.date_of_birth)}
                            </td>
                            <td>
                                {d.isEditing ? (
                                        <input type="date" value={editDateStart} onChange={(e) => setEditDateStart(e.target.value)}/>
                                    ) : (d.date_of_start)}
                            </td>
                            <td>
                            {d.isEditing ?
                                (<input className="input" type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)}/>
                                ) : (d.phone_number)
                                }     
                            </td>
                            <td>
                            {d.isEditing ?
                                (<input className="input" type="text" value={editCity} onChange={(e) => setEditCity(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}/>
                                ) : (d.city)
                                }     
                            </td>
                            <td>
                            {d.isEditing ?
                                (<input className="input" type="text" value={editStreet} onChange={(e) => setEditStreet(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}/>
                                ) : (d.street)
                                }     
                            </td>
                            <td>
                            {d.isEditing ?
                                (<input className="input" type="number" min={0} value={editZip} onChange={(e) => setEditZip(e.target.value)}/>
                                ) : (d.zip_code)
                                }     
                            </td>
                            <td>
                                {d.isEditing ? (<button className="save-button" onClick={() => handleSave(d.id_employee)}>Save</button>
                                ) : (
                                    <>
                                        <button className="edit-button" onClick={() => handleEdit(i)}>Edit</button>
                                        {!(d.id_employee === managerInfo) &&
                                        <button className="delete-button" onClick={() => handleDelete(d.id_employee)}>Delete</button>}
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {!statistics && <button className='statistics' onClick={handleStatistics}>Statistics</button>}
            {statistics && <button className='statistics' onClick={handleCloseStatistics}>Close statistics</button>}
            {statistics && (
                <div>
                <table>
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Patronymic</th>
                        <th>Product number</th>
                        <th>Checks count</th>
                        <th>Total sum</th>
                    </tr>
                    </thead>
                    <tbody>
                    {statisticsData.map((d, i) => (
                        <tr key={i}>
                        <td>{d.id_employee}</td>
                        <td>{d.empl_name}</td>
                        <td>{d.empl_surname}</td>
                        <td>{d.empl_patronymic}</td>
                        <td>{d.product_number}</td>
                        <td>{d.checks_count}</td>
                        <td>{d.total_sum}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            </div>
    );
}

export default Employee;