import React, { useState, useEffect } from 'react';

function Customers() {
    const [data, setData] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [sortDirection, setSortDirection] = useState('asc');
    const [percent, setPercent] = useState('');

    const handlePercentChange = (e) => {
        setPercent(e.target.value);
    };

    const searchCustomersByPercent = () => {
        fetch(`http://localhost:8081/customers?percent=${percent}`)
        .then(res => res.json())
        .then(data => {
            setData(data);
            setSortedData(data); 
        })
        .catch(err => console.log(err));
    };    

    useEffect(()=>{
        fetch('http://localhost:8081/customers')
        .then(res => res.json())
        .then(data => {
            setData(data);
            setSortedData(data); 
        })
        .catch(err => console.log(err));
    }, []);

    const handleDelete = id => {
        fetch(`http://localhost:8081/customers/${id}`, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(() => {
            setData(data.filter(item => item.card_number !== id));
            setSortedData(sortedData.filter(item => item.card_number !== id));
        })
        .catch(err => console.log(err));
    };

    const sortBySurname = () => {
        const sorted = [...sortedData].sort((a, b) => {
            const surnameA = a.cust_surname.toUpperCase();
            const surnameB = b.cust_surname.toUpperCase();
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

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Customers Report</title>');
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
        printWindow.document.write('<thead><tr><th>Card number</th><th>Surname</th><th>Name</th><th>Patronymic</th><th>Phone number</th><th>City</th><th>Street</th><th>Zip code</th><th>Percent</th></tr></thead>');
        printWindow.document.write('<tbody>');
        sortedData.forEach(d => {
            printWindow.document.write('<tr>');
            printWindow.document.write(`<td>${d.card_number}</td>`);
            printWindow.document.write(`<td>${d.cust_surname}</td>`);
            printWindow.document.write(`<td>${d.cust_name}</td>`);
            printWindow.document.write(`<td>${d.cust_patronymic}</td>`);
            printWindow.document.write(`<td>${d.phone_number}</td>`);
            printWindow.document.write(`<td>${d.city}</td>`);
            printWindow.document.write(`<td>${d.street}</td>`);
            printWindow.document.write(`<td>${d.zip_code}</td>`);
            printWindow.document.write(`<td>${d.percent}</td>`);
            printWindow.document.write('</tr>');
        });
        printWindow.document.write('</tbody></table></body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="cart-employee container">
            <div className="employee-header">  
                <input type="text" placeholder="Enter percent" value={percent} onChange={handlePercentChange}></input>
                <button className="search-button" onClick={searchCustomersByPercent}>Search</button> 
            </div>
            <div className="employee-header">  
                <button className="add-button">Add customer</button>
                <button className="print-button" onClick={handlePrint}>Print information</button>
                <button className="sort-button" onClick={sortBySurname}>Sort by surname</button>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Card</th>
                            <th>Surname</th>
                            <th>Name</th>
                            <th>Patronymic</th>
                            <th>Phone number</th>
                            <th>City</th>
                            <th>Street</th>
                            <th>Zip code</th>
                            <th>Percent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((d,i) => (
                            <tr key={i}>
                                <td>{d.card_number}</td>
                                <td>{d.cust_surname}</td>
                                <td>{d.cust_name}</td>
                                <td>{d.cust_patronymic}</td>
                                <td>{d.phone_number}</td>
                                <td>{d.city}</td>
                                <td>{d.street}</td>
                                <td>{d.zip_code}</td>
                                <td>{d.percent}</td>
                                <td>
                                    <button className="edit-button">Edit</button>
                                    <button className="delete-button" onClick={() => handleDelete(d.card_number)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Customers;
