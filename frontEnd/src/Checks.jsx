import React, { useState, useEffect } from 'react';

function Cheks() {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [employees, setEmployees] = useState([]);
    const [selectedCheckProducts, setSelectedCheckProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [totalSum, setTotalSum] = useState(0);
    const [startDateProduct, setStartDateProduct] = useState('');
    const [endDateProduct, setEndDateProduct] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [products, setProducts] = useState([]);
    const [totalSumProduct, setTotalSumProduct] = useState(0);
    const [productName, setProductName] = useState('');

    useEffect(()=>{
        fetch('http://localhost:8081/check')
        .then(res => res.json())
        .then(data => setData(data))
        .catch(err => console.log(err));

        fetch('http://localhost:8081/cashiers')
        .then(res => res.json())
        .then(data => setEmployees(data))
        .catch(err => console.log(err));

        fetch('http://localhost:8081/products')
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.log(err));

        fetch(`http://localhost:8081/sumCheck?startDate=${startDate}&endDate=${endDate}&employeeId=${selectedEmployee}`)
        .then(res => res.json())
        .then(data => setTotalSum(data))
        .catch(err => console.log(err));

        fetch(`http://localhost:8081/checkProducts?startDate=${startDateProduct}&endDate=${endDateProduct}&productId=${selectedProduct}`)
        .then(res => res.json())
        .then(data => {
            setTotalSumProduct(data);
            setProductName(data[0].product_name);
        })
        .catch(err => console.log(err));
    }, []);

    const handleDelete = id => {
        fetch(`http://localhost:8081/check/${id}`, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(() => {
            setData(data.filter(item => item.check_number !== id));
            setSortedData(sortedData.filter(item => item.check_number !== id)); 
        })
        .catch(err => console.log(err));
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Checks Report</title>');
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
        printWindow.document.write('<thead><tr><th>Check number</th><th>Card number</th><th>Date</th><th>Sum</th><th>VAT</th><th>ID cashier</th></tr></thead>');
        printWindow.document.write('<tbody>');
        data.forEach(d => {
            printWindow.document.write('<tr>');
            printWindow.document.write(`<td>${d.check_number}</td>`);
            printWindow.document.write(`<td>${d.card_number}</td>`);
            printWindow.document.write(`<td>${d.print_date}</td>`);
            printWindow.document.write(`<td>${d.sum_total}</td>`);
            printWindow.document.write(`<td>${d.vat}</td>`);
            printWindow.document.write(`<td>${d.id_employee}</td>`);
            printWindow.document.write('</tr>');
        });
        printWindow.document.write('</tbody></table></body></html>');
        printWindow.document.close();
        printWindow.print();
    };    

    const handleSearchEmployee = () => {
        fetch(`http://localhost:8081/check?startDate=${startDate}&endDate=${endDate}&employeeId=${selectedEmployee}`)
        .then(res => res.json())
        .then(data => {
            setData(data);
        })
        .catch(err => console.log(err));

        fetch(`http://localhost:8081/sumCheck?startDate=${startDate}&endDate=${endDate}&employeeId=${selectedEmployee}`)
        .then(res => res.json())
        .then(data => setTotalSum(data))
        .catch(err => console.log(err));
    };

    const handleSearchProducts = () => {
        fetch(`http://localhost:8081/checkProducts?startDate=${startDateProduct}&endDate=${endDateProduct}&productId=${selectedProduct}`)
        .then(res => res.json())
        .then(data => {
            setTotalSumProduct(data);
            setProductName(data[0].product_name);
        })
        .catch(err => console.log(err));
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

    return (
    <div className="cheks-container container">
        <div className="employee-header">
                <label className="input-date">Start date: </label>
                <input className="input-d" type="date" id="start" value={startDate} onChange={e => setStartDate(e.target.value)}/>
                <label className="input-date">End date: </label>
                <input className="input-d" type="date" id="end" value={endDate} onChange={e => setEndDate(e.target.value)}/>
                <select className="input-cashier" value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)}>
                    <option value="">All cashiers</option>
                    {employees.map(employee => (
                        <option key={employee.id_employee} value={employee.id_employee}>
                            {`${employee.id_employee} - ${employee.empl_surname} ${employee.empl_name}`}
                        </option>
                    ))}
                </select>

                <button className="search-button" onClick={handleSearchEmployee}>Search</button>
        </div>

            <hr className='line'></hr>

            <div className="employee-header">
                <label className="input-date">Start date: </label>
                <input className="input-d" type="date" id="start" value={startDateProduct} onChange={e => setStartDateProduct(e.target.value)}/>
                <label className="input-date">End date: </label>
                <input className="input-d" type="date" id="end" value={endDateProduct} onChange={e => setEndDateProduct(e.target.value)}/>
                <select className="input-product" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
                    <option value="">All products</option>
                    {products.map(products => (
                        <option key={products.id_product} value={products.id_product}>
                            {`${products.id_product} - ${products.product_name}`}
                        </option>
                    ))}
                </select>

                <button className="search-button" onClick={handleSearchProducts}>Search</button>
            </div>

            <hr className='line'></hr>

        <div className="employee-header">
            <button className="print-button" onClick={handlePrint}>Print information</button>
        </div>

        <hr className='line'></hr>
        
        <div className="employee-header">
            <label className="input-date">Sum total: {totalSum[0]?.sum} </label>
            <label className="input-date">Amount product : {productName ? productName : "All products"} : {totalSumProduct[0]?.total_units_sold} </label>
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
                                <button className="delete-button" onClick={() => handleDelete(d.check_number)}>Delete</button>
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

  export default Cheks;