import React, { useState, useEffect } from 'react';

function ProductInStore() {
    const [data, setData] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [sortDirection, setSortDirection] = useState('asc');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [upc, setUpc] = useState('');
    const [products, setProducts] = useState([]);
    const [newProductID, setNewProductID] = useState([]);
    const [newProductUPC, setNewProductUPC] = useState([]);
    const [newProductPrice, setNewProductPrice] = useState([]);
    const [newProductNumber, setNewProductNumber] = useState([]);
    const [newProductProm, setNewProductProm] = useState([]);
    const [editedData, setEditedData] = useState([...sortedData]);
    const [editName, setEditName] = useState(''); 
    const [editPrice, setEditPrice] = useState('');
    const [editNumber, setEditNumber] = useState('');
    const [editProm, setEditProm] = useState('');

    useEffect(() => {
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
                setEditedData(data);
            })
            .catch(err => console.log(err));

        fetch('http://localhost:8081/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
            })
            .catch(err => console.log(err));  
    }, []);

    const handleEdit = (index) => {
        const updatedData = [...editedData];
        updatedData[index].isEditing = true;
        setEditedData(updatedData);
        setEditName(updatedData[index].id_product);
        setEditNumber(updatedData[index].products_number);
        setEditPrice(updatedData[index].selling_price);
        setEditProm(updatedData[index].promotional_product);
    };

    const handleSave = (id) => {
        fetch(`http://localhost:8081/productsInStore/${id}?prodID=${editName}&price=${editPrice}&number=${editNumber}&prom=${editProm}`, {
            method: 'POST',
        })
        .then(res => {
            if (res.ok) {
                const updatedData = [...editedData];
                setEditedData(updatedData);
            }
        })
        .catch(err => console.log(err.message));
    
        fetch('http://localhost:8081/productsInStore')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setSortedData(data);
                setEditedData(data);
            })
            .catch(err => console.log(err));
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:8081/productsInStore/${id}`, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(() => {
            setData(data.filter(item => item.id_product !== id));
            setSortedData(sortedData.filter(item => item.id_product !== id)); 
            setEditedData(editedData.filter(item => item.id_product !== id));
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
                setEditedData(data);
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
          setEditedData(filteredData);
        }
    };

    useEffect(() => {
        setEditedData([...sortedData]);
    }, [sortedData]);

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
            setEditedData(filteredData);
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

    const handleAdd = () => {
        const existingProduct = data.find(product => product.upc === newProductUPC);
        if (existingProduct) {
            alert("Product with the same UPC already exists!");
            setNewProductUPC('');
            return;
        }

        fetch(`http://localhost:8081/productsInStore?idProduct=${newProductID}&upc=${newProductUPC}&price=${newProductPrice}&number=${newProductNumber}&prom=${newProductProm}`, {
            method: 'POST',
        })
        .then(res => {
        if (res.ok) {
            return res.json();
        }
        })
        .then(() => {
            setNewProductUPC('');
            setNewProductID('');
            setNewProductPrice('');
            setNewProductNumber('');
            setNewProductProm('');
        })
        .catch(err => console.log(err.message));

        fetch('http://localhost:8081/productsInStore')
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
                <input className="input" type="text" placeholder="New UPC" value={newProductUPC} onChange={(e) => setNewProductUPC(e.target.value)}></input>
                <select className="input-product-select" value={newProductID} onChange={(e) => setNewProductID(e.target.value)}>
                    <option>Select product</option>
                    {products.map((d, i) => (
                        <option key={i} value={d.id_product}> {d.id_product} - {d.product_name}</option>
                    ))}
                </select>
                <input className="input" type="number" min={0} placeholder="Price" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)}></input>
                <input className="input" type="number" min={1} placeholder="Number" value={newProductNumber} onChange={(e) => setNewProductNumber(e.target.value)}></input>
                <select value={newProductProm} onChange={(e) => setNewProductProm(e.target.value)}>
                    <option value="select-promotional">Is promotional?</option>
                    <option value="1">Promotional product</option>
                    <option value="0">Non-promotional product</option>
                </select>
                <button className="add-button" onClick={handleAdd}>Add product</button>
            </div>

            <div className="employee-header">
                <button className="print-button" onClick={handlePrint}>Print information</button>
                <button className="sort-button" onClick={sortByProductName}>Sort by product name</button>
                <button className="sort-button" onClick={sortByAmount}>Sort by amount</button>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>UPC</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Promotional</th> 
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>

                    {editedData.map((d, i) => (
                        <tr key={i}>
                            <td>{d.upc}</td>
                            <td>
                            {d.isEditing ?
                                (
                                  <select value={editName} onChange={(e) => setEditName(e.target.value)}>
                                        {products.map((data, k) => 
                                          <option key={k} value={data.id_product}>
                                          {data.id_product} - {data.product_name}
                                          </option>
                                        )}
                                  </select>
                                ) : (d.product_name)
                                }     
                            </td>
                            <td>{d.category_name}</td>
                            <td>
                                {d.isEditing ?
                                (<input className="input-categoty" type="number" min={0} value={editPrice} onChange={(e) => setEditPrice(e.target.value)}/>
                                ) : 
                                (d.selling_price)
                                }                                
                            </td>
                            <td>
                                {d.isEditing ?
                                (<input className="input-categoty" type="number" min={1} value={editNumber} onChange={(e) => setEditNumber(e.target.value)}/>
                                ) : 
                                (d.products_number)
                                }                                
                            </td>
                            <td>
                            {d.isEditing ?
                                (
                                  <select value={editProm} onChange={(e) => setEditProm(e.target.value)}>
                                        <option value="1">1</option>
                                        <option value="0">0</option>
                                  </select>
                                ) : (d.promotional_product)
                                }     
                            </td>
                            <td>
                                {d.isEditing ? (<button className="save-button" onClick={() => handleSave(d.upc)}>Save</button>
                                ) : (
                                    <>
                                        <button className="edit-button" onClick={() => handleEdit(i)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDelete(d.id_product)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}

                        {/* {sortedData.map((d,i) => (
                            <tr key={i}>
                                <td>{d.upc}</td>
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
                        ))} */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductInStore;
