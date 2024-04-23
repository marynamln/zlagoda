import React, { useState, useEffect } from 'react';

function Product() {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortDirection, setSortDirection] = useState('asc');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [newProductName, setNewProductName] = useState([]);
  const [newProductCharacteristics, setNewProductCharacteristics] = useState([]);
  const [newProductCategory, setNewProductCategory] = useState([]);
  const [editedData, setEditedData] = useState([...sortedData]);
  const [editName, setEditName] = useState(''); 
  const [editCategory, setEditCategory] = useState('');
  const [editCharacteristics, setEditCharacteristics] = useState('');

  useEffect(()=>{
    fetch('http://localhost:8081/categories')
      .then(res => res.json())
      .then(data => {
        setCategories([...data]);
      })
      .catch(err => console.log(err));

    fetch('http://localhost:8081/products')
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
    setEditName(updatedData[index].product_name);
    setEditCharacteristics(updatedData[index].characteristics);
    setEditCategory(updatedData[index].category_number);
  };

  const handleSave = (id) => {
    fetch(`http://localhost:8081/products/${id}?name=${editName}&characteristics=${editCharacteristics}&category=${editCategory}`, {
        method: 'POST',
    })
    .then(res => {
        if (res.ok) {
            const updatedData = [...editedData];
            setEditedData(updatedData);
        }
    })
    .catch(err => console.log(err.message));

    fetch('http://localhost:8081/products')
    .then(res => res.json())
    .then(data => {
        setData(data);
        setSortedData(data);
        setEditedData(data);
    })
    .catch(err => console.log(err));
};

  const handleDelete = id => {
    fetch(`http://localhost:8081/products/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (res.ok) {
            return res.json();
        } else if (res.status === 500) {
          alert("The product cannot be deleted because because it is available in the store.");
          throw ("The product cannot be deleted because because it is available in the store.");
        }
      })
      .then(() => {
        setData(data.filter(item => item.id_product !== id));
        setSortedData(sortedData.filter(item => item.id_product !== id)); 
        setEditedData(editedData.filter(item => item.id_product !== id));
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

  useEffect(() => {
    setEditedData([...sortedData]);
  }, [sortedData]);

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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Products Report</title>');
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
    printWindow.document.write('<thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Characteristics</th></tr></thead>');
    printWindow.document.write('<tbody>');
    sortedData.forEach(d => {
        printWindow.document.write('<tr>');
        printWindow.document.write(`<td>${d.id_product}</td>`);
        printWindow.document.write(`<td>${d.product_name}</td>`);
        printWindow.document.write(`<td>${d.category_name}</td>`);
        printWindow.document.write(`<td>${d.characteristics}</td>`);
        printWindow.document.write('</tr>');
    });
    printWindow.document.write('</tbody></table></body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const handleAddProduct = () => {
    if(newProductName.length == 0 || newProductCharacteristics.length == 0 || newProductCategory.length == 0){
      alert("Not all required fields are filled!");
      throw ("Not all required fields are filled!");
    }

    const formattedProductName = newProductName.charAt(0).toUpperCase() + newProductName.slice(1);

    fetch(`http://localhost:8081/products?name=${formattedProductName}&characteristics=${newProductCharacteristics}&category=${newProductCategory}`, {
            method: 'POST',
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
    })
    .then(() => {
      setNewProductName('');
      setNewProductCharacteristics('');
      setNewProductCategory('');
    })
    .catch(err => console.log(err.message));

    fetch('http://localhost:8081/products')
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
        <option key={i} value={d.category_name}>
            {d.category_name}
        </option>
            ))}
      </select>
      </div>

      <hr className='line'></hr>

      <div className="employee-header">
        <input className="input-product" type="text" placeholder="New product name" value={newProductName} onChange={(e) => setNewProductName(e.target.value)}></input>
        <input className="input-characteristics" type="text" placeholder="Characteristics" value={newProductCharacteristics} onChange={(e) => setNewProductCharacteristics(e.target.value)}></input>
        <select value={newProductCategory} onChange={(e) => setNewProductCategory(e.target.value)}>
        <option value="Select">Select category</option>
            {categories.map((d, i) => (
              <option key={i} value={d.category_number}>
                {d.category_name}
              </option>
            ))}
        </select>
        <button className="add-button" onClick={handleAddProduct}>Add product</button>
      </div>

      <hr className='line'></hr>
      
      <div className="employee-header">
        <button className="print-button" onClick={handlePrint}>Print information</button>
        <button className="sort-button" onClick={sortByProductName}>Sort by product name</button>
      </div>
      
      <div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Characteristics</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>

            {editedData.map((d, i) => (
                        <tr key={i}>
                            <td>{d.id_product}</td>
                            <td>
                                {d.isEditing ? 
                                (<input className="input-categoty" type="text" value={editName} onChange={(e) => setEditName(e.target.value)}/>) 
                                : 
                                (
                                    d.product_name
                                )}
                            </td>
                            <td>
                                {d.isEditing ? 
                                (<input className="input-categoty" type="text" value={editCharacteristics} onChange={(e) => setEditCharacteristics(e.target.value)}/>) 
                                : 
                                (
                                    d.characteristics
                                )}
                            </td>
                            <td>
                                {d.isEditing ?
                                (
                                  <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                                        {categories.map((data, k) => 
                                          <option key={k} value={data.category_number}>
                                          {data.category_name}
                                          </option>
                                        )}
                                  </select>
                                ) : (d.category_name)
                                }                                
                            </td>
                            <td>
                                {d.isEditing ? (<button className="save-button" onClick={() => handleSave(d.id_product)}>Save</button>
                                ) : (
                                    <>
                                        <button className="edit-button" onClick={() => handleEdit(i)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDelete(d.id_product)}>Delete</button>
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

export default Product;
