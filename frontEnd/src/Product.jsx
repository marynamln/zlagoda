import React, { useState, useEffect } from 'react';

function Product() {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortDirection, setSortDirection] = useState('asc');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

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
      })
      .catch(err => console.log(err));
  }, []);

  const handleDelete = id => {
    fetch(`http://localhost:8081/products/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (res.ok) {
            return res.json();
        } else if (res.status === 500) {
          alert("The product cannot be deleted because because it is available in the store.");
          throw new Error("Сannot delete product because it is available in the store");
        }
      })
      .then(() => {
        setData(data.filter(item => item.id_product !== id));
        setSortedData(sortedData.filter(item => item.id_product !== id)); 
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

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    if (event.target.value === "All Categories") {
      setSortedData(data);
    } else {
      const filteredData = data.filter(item => item.category_name === event.target.value);
      setSortedData(filteredData);
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
      <div className="employee-header">
        <button className="add-button">Add product</button>
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
              {sortedData.map((d,i) => (
                <tr key={i}>
                  <td>{d.id_product}</td>
                  <td>{d.product_name}</td>
                  <td>{d.characteristics}</td>
                  <td>{d.category_name}</td>
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

export default Product;
