import React, { useState, useEffect } from 'react';

function CustomersCashier() {
    const [data, setData] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [sortDirection, setSortDirection] = useState('asc');
    const [surnameSearch, setSurnameSearch] = useState('');
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

    const [custStatistics, setCustStatistics] = useState([]);
    const [openStatistics, setOpenStatistics] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");

    useEffect(()=>{
        fetch('http://localhost:8081/customers')
        .then(res => res.json())
        .then(data => {
            setData(data);
            setSortedData(data); 
            setEditedData(data);
        })
        .catch(err => console.log(err));

        fetch('http://localhost:8081/categories')
        .then(res => res.json())
        .then(data => {
            setCategories([...data]);
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

    const handleSurnameSearchChange = (e) => {
        setSurnameSearch(e.target.value);
    };

    const searchCustomersBySurname = () => {
        fetch(`http://localhost:8081/customers?surname=${surnameSearch}`)
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

        if(phone.length > 13){
            alert("Phone number is too long! It should not exceed 13 characters.");
            setPhone('');
            throw ("Phone number is too long!");
        }
        
        const existingCustomer = data.find(cust => cust.card_number === card);
        if (existingCustomer) {
            alert("Customer with the same card already exists!");
            setCard('');
            return;
        }

        const existingPhone = data.find(cust => cust.phone_number === phone);
        if (existingPhone) {
            alert("Customer with the same phone number already exists!");
            setPhone('');
            return;
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

    const handleCloseStatistics = () => {
        setOpenStatistics(false);
        setSelectedCategory('');
        setCustStatistics([]);
    };

    const handleCustomerStatistics = () => {
        setOpenStatistics(true);
    };

    const handleSearchStatistics = () => {
        fetch(`http://localhost:8081/custCategory?category=${selectedCategory}`)
        .then(res => res.json())
        .then(data => {
            setCustStatistics(data);
        })
        .catch(err => console.log(err));
    };

    return (
        <div className="cart-employee container">
            <div className="employee-header">  
                <input className="input" type="text" placeholder="Enter surname" value={surnameSearch} onChange={handleSurnameSearchChange}></input>
                <button className="search-button" onClick={searchCustomersBySurname}>Search</button> 
            </div>

            <hr className='line'></hr>

            <div className="employee-header">  
                <input className="input" type="number" min={0} placeholder="Card number" value={card} onChange={(e) => setCard(e.target.value)}></input>
                <input className="input" type="text" placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)}></input>
                <input className="input" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}></input>
                <input className="input" type="text" placeholder="Patronymic" value={patronymic} onChange={(e) => setPatronymic(e.target.value)}></input>
                <input className="input" type="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)}></input>
                <input className="input" type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)}></input>
                <input className="input" type="text" placeholder="Street" value={street} onChange={(e) => setStreet(e.target.value)}></input>
                <input className="input" type="text" placeholder="Zip code" value={zip} onChange={(e) => setZip(e.target.value)}></input>
                <input className="input" type="number" min={1} placeholder="Percent" value={percentNew} onChange={(e) => setPercentNew(e.target.value)}></input>
                <button className="add-button" onClick={handleAdd}>Add customer</button>
            </div>

            <hr className='line'></hr>

            <div className="employee-header">  
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
                                (<input className="input" type="text" value={editSurname} onChange={(e) => setEditSurname(e.target.value)}/>
                                ) : (d.cust_surname)
                                }     
                            </td>
                            <td>
                            {d.isEditing ?
                                (<input className="input" type="text" value={editName} onChange={(e) => setEditName(e.target.value)}/>
                                ) : (d.cust_name)
                                }     
                            </td>
                            <td>
                            {d.isEditing ?
                                (<input className="input" type="text" value={editPatronymic} onChange={(e) => setEditPatronymic(e.target.value)}/>
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
                                (<input className="input" type="text" value={editCity} onChange={(e) => setEditCity(e.target.value)}/>
                                ) : (d.city)
                                }     
                            </td>
                            <td>
                            {d.isEditing ?
                                (<input className="input" type="text" value={editStreet} onChange={(e) => setEditStreet(e.target.value)}/>
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
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {!openStatistics && <button className='statistics' onClick={handleCustomerStatistics}>Statistics</button>}
            {openStatistics && <button className='statistics' onClick={handleCloseStatistics}>Close statistics</button>}

            {openStatistics && <div className="employee-header">  
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">Choose category</option>
                        {categories.map((d, i) => (
                            <option key={i} value={d.category_number}>
                                {d.category_number} {d.category_name} 
                            </option>
                        ))}
                </select>
            </div>}

            {openStatistics &&
                <div className="employee-header">
                    <button className="edit-button" onClick={handleSearchStatistics}>Search</button>
                </div>
            }

            <div>
                {openStatistics &&
                    <div className="modal">
                        <div className="employee-header">
                        <table>
                            <thead>
                                <tr>
                                <th>Card</th>
                                <th>Surname</th>
                                <th>Name</th>
                                <th>Patronymic</th>
                                <th>Phone number</th>
                                <th>Percent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {custStatistics.map((d, index) => (
                                    <tr key={index}>
                                        <td>{d.card_number}</td>
                                        <td>{d.cust_surname}</td>
                                        <td>{d.cust_name}</td>
                                        <td>{d.cust_patronymic}</td>
                                        <td>{d.phone_number}</td>
                                        <td>{d.percent}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>    
                    </div>    
                }
            </div>  

        </div>
    );
}
export default CustomersCashier;