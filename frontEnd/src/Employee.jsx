import React, { useState, useEffect } from 'react';

function Employee() {
    const [data, setData] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [sortDirection, setSortDirection] = useState('asc');
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [surname, setSurname] = useState('');

    useEffect(()=>{
        fetch('http://localhost:8081/employee')
        .then(res => res.json())
        .then(data => {
            setData(data);
            setSortedData(data);
        })
        .catch(err => console.log(err));
    }, []);

    const handleDelete = id => {
        fetch(`http://localhost:8081/employee/${id}`, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(() => {
            setData(data.filter(item => item.id_employee !== id));
            setSortedData(sortedData.filter(item => item.id_employee !== id));
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

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        if (event.target.value === "all") {
            setSortedData(data);
        } else {
            const filteredData = data.filter(item => item.empl_role.toLowerCase() === event.target.value);
            setSortedData(filteredData);
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
            })
            .catch(err => console.log(err));
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
            <div className="employee-header">  
                <input type="text" placeholder="Enter surname" value={surname} onChange={handleSurnameSearch}></input>
                <button className="search-button" onClick={searchEmployeeBySurname}>Search</button> 
            </div>
            <div className="employee-header">
                <button className="add-button">Add employee</button>
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
                        {sortedData.map((d,i) => (
                            <tr key={i}>
                                <td>{d.id_employee}</td>
                                <td>{d.empl_surname}</td>
                                <td>{d.empl_name}</td>
                                <td>{d.empl_patronymic}</td>
                                <td>{d.empl_role}</td>
                                <td>{d.salary}</td>
                                <td>{d.date_of_birth}</td>
                                <td>{d.date_of_start}</td>
                                <td>{d.phone_number}</td>
                                <td>{d.city}</td>
                                <td>{d.street}</td>
                                <td>{d.zip_code}</td>
                                <td>
                                    <button className="edit-button">Edit</button>
                                    <button className="delete-button" onClick={() => handleDelete(d.id_employee)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Employee;