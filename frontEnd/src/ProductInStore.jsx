import React, { useState, useEffect } from 'react';

function ProductInStore() {
    const [data, setData] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [sortDirection, setSortDirection] = useState('asc');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [upc, setUpc] = useState('');

    useEffect(()=>{
        fetch('http://localhost:8081/categories')
            .then(res => res.json())
            .then(data => {
                setCategories([...data]);
            })
            .catch(err => console.log(err));

        fetch('http://localhost:8081/productsInStore')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setSortedData(data);
            })
            .catch(err => console.log(err));
    }, []);

    const handleDelete = id => {
        fetch(`http://localhost:8081/productsInStore/${id}`, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(() => {
            setData(data.filter(item => item.id_product !== id));
            setSortedData(sortedData.filter(item => item.id_product !== id)); 
        })
        .catch(err => console.log(err));
    };

    const handleUpcChange = (e) => {
        setUpc(e.target.value);
    };

    const searchProductByUpc = () => {
        fetch(`http://localhost:8081/productsInStore?upc=${upc}`)
            .then(res => res.json())
            .then(data => {
                setData(data);
                setSortedData(data); 
            })
            .catch(err => console.log(err));
    };

    const sortByProductName = () => {
        const sorted = [...sortedData].sort((a, b) => {
            const nameA = a.product_name.toUpperCase();
            const nameB = b.product_name.toUpperCase();
            if (nameA < nameB) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (nameA > nameB) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
        setSortedData(sorted);
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); 
    };

    const sortByAmount = () => {
        const sorted = [...sortedData].sort((a, b) => {
            return sortDirection === 'asc' ? a.products_number - b.products_number : b.products_number - a.products_number;
        });
        setSortedData(sorted);
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); 
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        if (event.target.value === "All Categories") {
          setSortedData(data);
        } else {
          const filteredData = data.filter(item => item.category_name === event.target.value);
          setSortedData(filteredData);
        }
    };

    const handlePromotionalChange = (event) => {
        const selectedPromotional = event.target.value;
        if (selectedPromotional === "all") {
            setSortedData(data);
        } else {
            const filteredData = data.filter(item => {
                if (selectedPromotional === "promotional") {
                    return item.promotional_product === 1;
                } else if (selectedPromotional === "non-promotional") {
                    return item.promotional_product !== 1;
                }
                return true;
            });
            setSortedData(filteredData);
        }
    };    

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Products in store Report</title>');
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
        printWindow.document.write('<thead><tr><th>UPC</th><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Products number</th><th>Promotional</th></tr></thead>');
        printWindow.document.write('<tbody>');
        sortedData.forEach(d => {
            printWindow.document.write('<tr>');
            printWindow.document.write(`<td>${d.upc}</td>`);
            printWindow.document.write(`<td>${d.id_product}</td>`);
            printWindow.document.write(`<td>${d.product_name}</td>`);
            printWindow.document.write(`<td>${d.category_name}</td>`);
            printWindow.document.write(`<td>${d.selling_price}</td>`);
            printWindow.document.write(`<td>${d.products_number}</td>`);
            printWindow.document.write(`<td>${d.promotional_product}</td>`);
            printWindow.document.write('</tr>');
        });
        printWindow.document.write('</tbody></table></body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="cart-employee container">
            <div className="employee-header">  
                <select value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="All Categories">All Categories</option>
                    {categories.map((d, i) => (
                        <option key={i} value={d.category_name}> {d.category_name}</option>
                    ))}
                </select>
            </div>
            <div className="employee-header">  
                <select onChange={handlePromotionalChange}>
                    <option value="all">All Products</option>
                    <option value="promotional">Promotional Products</option>
                    <option value="non-promotional">Non-Promotional Products</option>
                </select>
            </div>
            <div className="employee-header">  
                <input type="text" placeholder="Enter UPC" value={upc} onChange={handleUpcChange}></input>
                <button className="search-button" onClick={searchProductByUpc}>Search</button> 
            </div>
            <div className="employee-header">
                <button className="add-button">Add product</button>
                <button className="print-button" onClick={handlePrint}>Print information</button>
                <button className="sort-button" onClick={sortByProductName}>Sort by product name</button>
                <button className="sort-button" onClick={sortByAmount}>Sort by amount</button>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>UPC</th>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Products number</th>
                            <th>Promotional</th> 
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((d,i) => (
                            <tr key={i}>
                                <td>{d.upc}</td>
                                <td>{d.id_product}</td>
                                <td>{d.product_name}</td>
                                <td>{d.category_name}</td>
                                <td>{d.selling_price}</td>
                                <td>{d.products_number}</td>
                                <td>{d.promotional_product}</td>                  
                                <td>
                                    <button className="edit-button">Edit</button>
                                    <button className="delete-button" onClick={() => handleDelete(d.id_product)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductInStore;
