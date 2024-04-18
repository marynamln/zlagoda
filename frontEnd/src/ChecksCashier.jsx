import React, { useState, useEffect } from 'react';

function ChecksCashier({cashierInfo}) {
    const [data, setData] = useState([]);
    const [allChecks, setAllChecks] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [todayChecks, setToday] = useState('');
    const [selectedCheckProducts, setSelectedCheckProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);  
    const [checkByNumber, setCheckByNumber] = useState('');
    const [isToday, setIsToday] = useState(false);

    const [showAddCheck, setShowAddCheck] = useState(false);
    const [allProducts, setAllProducts] = useState('');
    const [allCustomers, setAllCustomers] = useState('');

    const [newCheckNum, setNewCheckNum] = useState('');
    const [custCard, setCustCard] = useState('');
    const [addProductCheck, setAddProductCheck] = useState('');
    const [numberProd, setNumberProd] = useState('');

    const [addedProducts, setAddedProducts] = useState([]);
    const [isSaved, setIsSaved] = useState(false);
    const [isFieldsDisabled, setIsFieldsDisabled] = useState(false);
    const [isFieldsProdDisabled, setIsFieldsProdDisabled] = useState(true);

    useEffect(()=>{
        fetch(`http://localhost:8081/checkCashierAll?employeeId=${cashierInfo}`)
        .then(res => res.json())
        .then(data => {
            setData(data);
        })
        .catch(err => console.log(err));

        fetch('http://localhost:8081/productsInStore')
            .then(res => res.json())
            .then(data => {
                setAllProducts(data);
            })
            .catch(err => console.log(err));

            fetch('http://localhost:8081/customers')
            .then(res => res.json())
            .then(data => {
                setAllCustomers(data);
            })
            .catch(err => console.log(err));

            fetch('http://localhost:8081/check')
            .then(res => res.json())
            .then(data => setAllChecks(data))
            .catch(err => console.log(err));
    }, [cashierInfo]);

    const handleSearchChecksDate = () => {
        fetch(`http://localhost:8081/check?startDate=${startDate}&endDate=${endDate}&employeeId=${cashierInfo}`)
        .then(res => res.json())
        .then(data => {
            setData(data);
        })
        .catch(err => console.log(err));
    };

    useEffect(() => {
        if (todayChecks !== '') {
            fetch(`http://localhost:8081/checkToday?date=${todayChecks}&employeeId=${cashierInfo}`)
            .then(res => res.json())
            .then(data => {
                setData(data);
            })
            .catch(err => console.log(err));
        }
    }, [todayChecks, cashierInfo]);

    useEffect(() => {
        if (isSaved) {
            setIsFieldsDisabled(true);
            setIsFieldsProdDisabled(false);
        } else {
            setIsFieldsDisabled(false);
            setIsFieldsProdDisabled(true);
        }
    }, [isSaved]);
    
    const handleSearchChecksToday = () => {
        const currentDate = getCurrentDate();
        setToday(currentDate);
        setIsToday(true);
        setStartDate('');
        setEndDate('');
    };

    const handleSearchChecksAll = () => {
        fetch(`http://localhost:8081/checkCashierAll?employeeId=${cashierInfo}`)
            .then(res => res.json())
            .then(data => {
                setData(data);
            })
            .catch(err => console.log(err));

        setIsToday(false);
        setStartDate('');
        setEndDate('');
        setToday('');
    };

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        return `${year}-${month}-${day}`;
    };

    const handleInfo = (checkNumber) => {
        fetch(`http://localhost:8081/sales?checkNumber=${checkNumber}`)
        .then(res => res.json())
        .then(data => {
            setSelectedCheckProducts(data);
            setShowModal(true);
        })
        .catch(err => console.log(err));
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const searchCheckByNumber = () => {
        fetch(`http://localhost:8081/checkNumber?checkNumber=${checkByNumber}&employeeId=${cashierInfo}`)
        .then(res => res.json())
        .then(data => {
            setData(data);
        })
        .catch(err => console.log(err));
    };

    const handleAddCheck = () => {
        setShowAddCheck(true);
    };

    const handleSaveCheck = () => {
        setShowAddCheck(false);

        fetch(`http://localhost:8081/saleTotal?checkNum=${newCheckNum}&cardNum=${custCard}`)
        .then(res => res.json())
        .then(data => {
            const sumTotal = data.total;
            const vat = sumTotal * 0.2;

            fetch(`http://localhost:8081/checkUpdate?checkNum=${newCheckNum}&sumTotal=${sumTotal}&vat=${vat}`, {
                method: 'POST',
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then(() => {
                setNumberProd('');
                setAddProductCheck('');
                setNewCheckNum('');
                setCustCard('');
                setAddedProducts([]);
                setIsSaved(false);

                fetch(`http://localhost:8081/checkCashierAll?employeeId=${cashierInfo}`)
                .then(res => res.json())
                .then(data => {
                    setData(data);
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err.message));
        })
        .catch(err => console.log(err));
    };

    const handleSave = () => {
        const existingCheck = allChecks.find(check => check.check_number === newCheckNum);
        if (existingCheck) {
            alert("Check with the same number already exists!");
            setNewCheckNum('');
            throw ("Check with the same number already exists!");
        }

        fetch(`http://localhost:8081/checkAdd?checkNum=${newCheckNum}&cardNum=${custCard}&date=${getCurrentDate()}&id=${cashierInfo}`, {
            method: 'POST',
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
        })
        .then(() => setIsSaved(true))
        .catch(err => console.log(err.message));

        fetch(`http://localhost:8081/checkCashierAll?employeeId=${cashierInfo}`)
        .then(res => res.json())
        .then(data => {
            setData(data);
        })
        .catch(err => console.log(err));
    };

    const handleAddProd = () => {
        fetch(`http://localhost:8081/sale?upc=${addProductCheck}&checkNum=${newCheckNum}&prodNum=${numberProd}`, {
            method: 'POST',
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
        })
        .then(() => {
            setAddedProducts([...addedProducts, { product: addProductCheck, quantity: numberProd }]);
            
            setNumberProd('');
            setAddProductCheck('');
        })
        .catch(err => console.log(err.message));
    };

    return (
    <div className="cheks-container container">
        <div className="employee-header">  
                <input className="input-check" type="text" placeholder="Enter check number" value={checkByNumber} onChange={(e) => setCheckByNumber(e.target.value)}></input>
                <button className="search-button" onClick={searchCheckByNumber}>Search</button> 
            </div>

            <hr className='line'></hr>

        <div className="employee-header">
            {!isToday && <button className="search-button" onClick={handleSearchChecksToday}>Find today's checks</button>}
            {isToday && <button className="search-button" onClick={handleSearchChecksAll}>Find all checks</button>}
        </div>

        <hr className='line'></hr>

        <div className="employee-header">
                <label className="input-date">Start date: </label>
                <input type="date" id="start" value={startDate} onChange={e => setStartDate(e.target.value)}/>
                <label className="input-date">End date: </label>
                <input type="date" id="end" value={endDate} onChange={e => setEndDate(e.target.value)}/>

                <button className="search-button" onClick={handleSearchChecksDate}>Search</button>
        </div>

        <hr className='line'></hr>

        <div className="employee-header">
            {!showAddCheck && <button className="search-button" onClick={handleAddCheck}>Add check</button>}
            {showAddCheck && (
                <div className="modal">
                    <div className="employee-header">
                        <input type="number" placeholder="New check number" min={0} value={newCheckNum} onChange={(e) => setNewCheckNum(e.target.value)} disabled={isFieldsDisabled}/>
                    </div>

                    <div className="employee-header">
                    <select className="input-product-select" value={custCard} onChange={(e) => setCustCard(e.target.value)} disabled={isFieldsDisabled}>
                        <option value={''}>Select card</option>
                        {allCustomers.map((d, i) => (
                            <option key={i} value={d.card_number}> {d.card_number} - {d.cust_surname}</option>
                        ))}
                        </select>
                    </div>

                    <div className="employee-header">
                        <button className="search-button" onClick={handleSave} disabled={isFieldsDisabled}>Save check</button>
                    </div>

                    <div className="employee-header">
                        <p>Add products:</p>
                    </div>

                    <div className="employee-header">
                        <p>
                        {addedProducts.map((d, i) => (
                            <p key={i}> {d.product}, Quantity: {d.quantity}</p>
                        ))}
                        </p>
                    </div>

                    <div className="employee-header">
                        <select className="input-product-select" value={addProductCheck} onChange={(e) => setAddProductCheck(e.target.value)} disabled={isFieldsProdDisabled}>
                        <option>Select product</option>
                        {allProducts.map((d, i) => (
                            <option key={i} value={d.upc}> {d.upc} - {d.product_name}</option>
                        ))}
                        </select>
                        <input type="number" placeholder="Number of product" min={0} value={numberProd} onChange={(e) => setNumberProd(e.target.value)} disabled={isFieldsProdDisabled}/>
                        <button className="search-button" onClick={handleAddProd} disabled={isFieldsProdDisabled}>Add</button>
                    </div>

                    <div className="employee-header">
                        <button className="search-button" onClick={handleSaveCheck} disabled={isFieldsProdDisabled}>Save</button>
                    </div>
                </div>
            )}
        </div>
        
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Check number</th>
                        <th>Card number</th>
                        <th>Date</th>
                        <th>Sum</th>
                        <th>VAT</th>
                        <th>ID cashier</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((d, i) => (
                        <tr key={i}>
                            <td>{d.check_number}</td>
                            <td>{d.card_number}</td>
                            <td>{d.print_date}</td>
                            <td>{d.sum_total}</td>
                            <td>{d.vat}</td>
                            <td>{d.id_employee}</td>
                            <td>
                                <button className="info-button" onClick={() => handleInfo(d.check_number)}>Info</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {showModal && (
            <div className="modal">
                <div className="employee-header">
                <button className="close-button" onClick={closeModal}>Close</button>
                </div>
                <div className="modal-content">
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedCheckProducts.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.product_name}</td>
                                    <td>{product.product_number}</td>
                                    <td>{product.selling_price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
    );
}
export default ChecksCashier;