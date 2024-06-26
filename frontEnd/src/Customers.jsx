import React, { useState, useEffect } from 'react';

function Customers() {
    const [data, setData] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [sortDirection, setSortDirection] = useState('asc');
    const [percent, setPercent] = useState('');
    const [card, setCard] = useState('');
    const [surname, setSurname] = useState('');
    const [name, setName] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [zip, setZip] = useState('');
    const [percentNew, setPercentNew] = useState('');
    const [editedData, setEditedData] = useState([...sortedData]);
    const [editSurname, setEditSurname] = useState('');
    const [editName, setEditName] = useState('');
    const [editPatronymic, setEditPatronymic] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editCity, setEditCity] = useState('');
    const [editStreet, setEditStreet] = useState('');
    const [editZip, setEditZip] = useState('');
    const [editPercent, setEditPercent] = useState('');

    useEffect(()=>{
        fetch('http://localhost:8081/customers')
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
        setEditSurname(updatedData[index].cust_surname);
        setEditName(updatedData[index].cust_name);
        setEditPatronymic(updatedData[index].cust_patronymic);
        setEditPhone(updatedData[index].phone_number);
        setEditCity(updatedData[index].city);
        setEditStreet(updatedData[index].street);
        setEditZip(updatedData[index].zip_code);
        setEditPercent(updatedData[index].percent);
    };

    const handleSave = (id) => {
        if(editSurname.length == 0 || editName.length == 0 || editPhone.length == 0 || editPercent.length == 0){
            alert("Not all required fields are filled!");
            throw ("Not all required fields are filled!");
        }
        
        if(editPercent <= 0){
            alert("Percent cannot be negative or 0!");
            setEditPercent('');
            throw ("Percent cannot be negative or 0!");
        }

        if(editPhone.length > 13){
            alert("Phone number is too long! It should not exceed 13 characters.");
            setEditPhone('');
            throw ("Phone number is too long!");
        }
        
        fetch(`http://localhost:8081/customers/${id}?surname=${editSurname}&name=${editName}&patronymic=${editPatronymic}&phone=${editPhone}&city=${editCity}&street=${editStreet}&zipCode=${editZip}&percent=${editPercent}`, {
            method: 'POST',
        })
        .then(res => {
            if (res.ok) {
                const updatedData = [...editedData];
                setEditedData(updatedData);
            }
        })
        .catch(err => console.log(err.message));
    
        fetch('http://localhost:8081/customers')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setSortedData(data);
                setEditedData(data);
            })
            .catch(err => console.log(err));
    };

    const handleDelete = id => {
        fetch(`http://localhost:8081/customers/${id}`, {
            method: 'DELETE',
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else if (res.status === 500) {
              alert("Customer cannot be deleted!");
              throw ("Customer cannot be deleted!");
            }
          })
        .then(() => {
            setData(data.filter(item => item.card_number !== id));
            setSortedData(sortedData.filter(item => item.card_number !== id));
            setEditedData(editedData.filter(item => item.card_number !== id));
        })
        .catch(err => console.log(err));
    };

    const searchCustomersByPercent = () => {
        fetch(`http://localhost:8081/customersPercent?percent=${percent}`)
        .then(res => res.json())
        .then(data => {
            setData(data);
            setSortedData(data); 
            setEditedData(data);
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

    useEffect(() => {
        setEditedData([...sortedData]);
    }, [sortedData]);

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
    

    const handleAdd = () => {
        if(card.length == 0 || surname.length == 0 || name.length == 0 || phone.length == 0 || percentNew.length == 0) {
            alert("Not all required fields are filled!");
            throw ("Not all required fields are filled!");
        }
        
        if(percentNew <= 0){
            alert("Percent cannot be negative or 0!");
            setPercentNew('');
            throw ("Percent cannot be negative or 0!");
        }

        const existingCustomer = data.find(cust => cust.card_number === card);
        if (existingCustomer) {
            alert("Customer with the same card already exists!");
            setCard('');
            throw ("Customer with the same card already exists!");
        }

        if(phone.length > 13){
            alert("Phone number is too long! It should not exceed 13 characters.");
            setPhone('');
            throw ("Phone number is too long!");
        }

        const existingPhone = data.find(cust => cust.phone_number === phone);
        if (existingPhone) {
            alert("Customer with the same phone number already exists!");
            setPhone('');
            throw ("Customer with the same phone number already exists!");
        }

        fetch(`http://localhost:8081/customers?card=${card}&surname=${surname}&name=${name}&patronymic=${patronymic}&phone=${phone}&city=${city}&street=${street}&zipCode=${zip}&percent=${percentNew}`, {
            method: 'POST',
        })
        .then(res => {
        if (res.ok) {
            return res.json();
        }
        })
        .then(() => {
            setCard('');
            setSurname('');
            setName('');
            setPatronymic('');
            setPhone('');
            setCity('');
            setStreet('');
            setZip('');
            setPercentNew('');
        })
        .catch(err => console.log(err.message));

        fetch('http://localhost:8081/customers')
        .then(res => res.json())
        .then(data => {
            setData(data);
            setSortedData(data);
            setEditedData(data);
        })
        .catch(err => console.log(err));
    };

    return (
        <div className="cart-employee container">
            <div className="employee-header">  
                <input className="input" type="text" placeholder="Enter percent" value={percent} onChange={(e) => setPercent(e.target.value)}></input>
                <button className="search-button" onClick={searchCustomersByPercent}>Search</button> 
            </div>

            <hr className='line'></hr>

            <div className="employee-header">  
                <input className="input" type="text" placeholder="Card number" value={card} onChange={(e) => setCard(e.target.value)}></input>
                <input className="input" type="text" placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}></input>
                <input className="input" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}></input>
                <input className="input" type="text" placeholder="Patronymic" value={patronymic} onChange={(e) => setPatronymic(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}></input>
                <input className="input" type="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)}></input>
                <input className="input" type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}></input>
                <input className="input" type="text" placeholder="Street" value={street} onChange={(e) => setStreet(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}></input>
                <input className="input" type="text" placeholder="Zip code" value={zip} onChange={(e) => setZip(e.target.value)}></input>
                <input className="input" type="number" min={1} placeholder="Percent" value={percentNew} onChange={(e) => setPercentNew(e.target.value)}></input>
                <button className="add-button" onClick={handleAdd}>Add customer</button>
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

                    {editedData.map((d, i) => (
                        <tr key={i}>
                            <td>{d.card_number}</td>
                            <td>
                            {d.isEditing ?
                                (<input className="input" type="text" value={editSurname} onChange={(e) => setEditSurname(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}/>
                                ) : (d.cust_surname)
                                }     
                            </td>
                            <td>
                            {d.isEditing ?
                                (<input className="input" type="text" value={editName} onChange={(e) => setEditName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}/>
                                ) : (d.cust_name)
                                }     
                            </td>
                            <td>
                            {d.isEditing ?
                                (<input className="input" type="text" value={editPatronymic} onChange={(e) => setEditPatronymic(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}/>
                                ) : (d.cust_patronymic)
                                }     
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
                                (<input className="input" type="text" value={editZip} onChange={(e) => setEditZip(e.target.value)}/>
                                ) : (d.zip_code)
                                }     
                            </td>
                            <td>
                            {d.isEditing ?
                                (<input className="input" type="number" min={0} value={editPercent} onChange={(e) => setEditPercent(e.target.value)}/>
                                ) : (d.percent)
                                }     
                            </td>
                            <td>
                                {d.isEditing ? (<button className="save-button" onClick={() => handleSave(d.card_number)}>Save</button>
                                ) : (
                                    <>
                                        <button className="edit-button" onClick={() => handleEdit(i)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDelete(d.card_number)}>Delete</button>
                                    </>
                                )}
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
