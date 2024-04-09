import React, { useState, useEffect } from 'react';

function Categories() {
    const [data, setData] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [sortDirection, setSortDirection] = useState('asc');
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(()=>{
        fetch('http://localhost:8081/categories')
        .then(res => res.json())
        .then(data => {
            setData(data);
            setSortedData(data);
        })
        .catch(err => console.log(err));
    }, []);

    const handleDeleteCategory = (id) => {
        fetch(`http://localhost:8081/categories/${id}`, {
            method: 'DELETE',
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else if (res.status === 500) {
                alert("The category cannot be deleted because it contains products.");
                throw new Error("Cannot delete category as it contains products");
            }
        })
        .then(() => {
            setData(data.filter(item => item.category_number !== id));
            setSortedData(sortedData.filter(item => item.category_number !== id));
        })
        .catch(err => console.log(err.message));
    };

    const sortByCategoryName = () => {
        const sorted = [...sortedData].sort((a, b) => {
            const nameA = a.category_name.toUpperCase();
            const nameB = b.category_name.toUpperCase();
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

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Categories Report</title>');
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
        printWindow.document.write('<thead><tr><th>ID</th><th>Category Name</th></tr></thead>');
        printWindow.document.write('<tbody>');
        sortedData.forEach(d => {
            printWindow.document.write('<tr>');
            printWindow.document.write(`<td>${d.category_number}</td>`);
            printWindow.document.write(`<td>${d.category_name}</td>`);
            printWindow.document.write('</tr>');
        });
        printWindow.document.write('</tbody></table></body></html>');
        printWindow.document.close();
        printWindow.print();
    };    

    const handleAddCategory = (newCategoryName) => {
        const formattedCategoryName = newCategoryName.charAt(0).toUpperCase() + newCategoryName.slice(1);
        fetch(`http://localhost:8081/categories/${formattedCategoryName}`, {
            method: 'POST',
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
        })
        .then(() => {
            setNewCategoryName('');
        })
        .catch(err => console.log(err.message));

        fetch('http://localhost:8081/categories')
        .then(res => res.json())
        .then(data => {
            setData(data);
            setSortedData(data);
        })
        .catch(err => console.log(err));
    };

    return (
        <div className="cart-employee container">
            <div className="employee-header">
                <input className="input" type="text" placeholder="New category name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}></input>
                <button className="add-button" onClick={() => handleAddCategory(newCategoryName)}>Add category</button>
                {/* <button className="add-button" onClick={handleAddCategory}>Add category</button> */}
                <button className="print-button" onClick={handlePrint}>Print information</button>
                <button className="sort-button" onClick={sortByCategoryName}>Sort by category name</button>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Category number</th>
                            <th>Category name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((d,i) => (
                            <tr key={i}>
                                <td>{d.category_number}</td>
                                <td>{d.category_name}</td>
                                <td>
                                    <button className="edit-button">Edit</button>
                                    <button className="delete-button" onClick={() => handleDeleteCategory(d.category_number)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Categories;
