import React, { useState, useEffect } from 'react';

function ProductCashier() {
    const [data, setData] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [sortDirection, setSortDirection] = useState('asc');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [nameSearch, setNameSearch] = useState('');

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

  const searchByName = () => {
    fetch(`http://localhost:8081/products?name=${nameSearch}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setSortedData(data);
      })
      .catch(err => console.log(err));
  }

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

  return (
    <div className="cart-employee container">
      <div className="employee-header">  
                <input className="input" type="text" placeholder="Enter name" value={nameSearch} onChange={(e) => setNameSearch(e.target.value)}></input>
                <button className="search-button" onClick={searchByName}>Search</button> 
      </div>

      <hr className='line'></hr>

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
              </tr>
            </thead>
            <tbody>
              {sortedData.map((d,i) => (
                <tr key={i}>
                  <td>{d.id_product}</td>
                  <td>{d.product_name}</td>
                  <td>{d.characteristics}</td>
                  <td>{d.category_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}
export default ProductCashier;