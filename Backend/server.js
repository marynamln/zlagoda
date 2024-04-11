const express = require('express');
const mysql = require('mysql2')
const cors = require('cors')

const app = express()
app.use(cors())

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'melnykbdSQL2024',
    database: 'supermarket'
});


app.get('/', (re, res)=>{
    return res.json("From Backend Side");
})

app.get('/employee', (req, res) => {
    const surname = req.query.surname;
    let sql;
    if (surname) { 
        sql = "SELECT id_employee, empl_surname, empl_name, empl_patronymic, empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code FROM `employee` WHERE empl_surname = ?";
        db.query(sql, [surname], (err, data)=>{
        if(err) return res.json(err);
        return res.json(data); })
    } else {
        sql = "SELECT id_employee, empl_surname, empl_name, empl_patronymic, empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code FROM `employee`";
        db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data); })
    }
})

app.post('/employee', (req, res) => {
    const surname = req.query.surname;
    const name = req.query.name;
    const patronymic = req.query.patronymic;
    const role = req.query.role;
    const salary = req.query.salary;
    const phone = req.query.phone;
    const city = req.query.city;
    const street = req.query.street;
    const zipCode = req.query.zipCode;
    const dateBirth = req.query.dateBirth;
    const dateStart = req.query.dateStart;
    let sql;

    if (surname && name && patronymic && phone && city && street && zipCode && role && salary && dateBirth && dateStart){
        sql = "INSERT INTO `employee` (id_employee, empl_surname, empl_name, empl_patronymic, empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [surname, name, patronymic, role, salary, dateBirth, dateStart, phone, city, street, zipCode], (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
    } else if (surname && name && phone && city && street && zipCode && role && salary && dateBirth && dateStart){
        sql = "INSERT INTO `employee` (id_employee, empl_surname, empl_name, empl_patronymic, empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code) VALUES (NULL, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [surname, name, role, salary, dateBirth, dateStart, phone, city, street, zipCode], (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
    }
})

app.post('/employee/:id', (req, res) => {
    const emplID = req.params.id;
    const surname = req.query.surname;
    const name = req.query.name;
    const patronymic = req.query.patronymic;
    const role = req.query.role;
    const salary = req.query.salary;
    const phone = req.query.phone;
    const city = req.query.city;
    const street = req.query.street;
    const zipCode = req.query.zipCode;
    const dateBirth = req.query.dateBirth;
    const dateStart = req.query.dateStart;
    let sql;

    if (surname && name && phone && city && street && zipCode && role && salary){
        sql = "UPDATE `employee` SET empl_surname = ?, empl_name = ?, empl_patronymic = ?, empl_role = ?, salary = ?, date_of_birth = ?, date_of_start = ?, phone_number = ?, city = ?, street = ?, zip_code = ? WHERE id_employee = ?";
        db.query(sql, [surname, name, patronymic, role, salary, dateBirth, dateStart, phone, city, street, zipCode, emplID], (err, data) => {
            if(err) return res.json(err);
            return res.json(data);});
    }

    // if (surname && name && phone && city && street && zipCode && role && salary){
    //     sql = "UPDATE `employee` SET empl_surname = ?, empl_name = ?, empl_patronymic = ?, empl_role = ?, salary = ?, phone_number = ?, city = ?, street = ?, zip_code = ? WHERE id_employee = ?";
    //     db.query(sql, [surname, name, patronymic, role, salary, phone, city, street, zipCode, emplID], (err, data) => {
    //         if(err) return res.json(err);
    //         return res.json(data);});
    // }
})

app.delete('/employee/:id', (req, res) => {
    const employeeId = req.params.id;
    const sql = "DELETE FROM employee WHERE id_employee = ?";
    db.query(sql, [employeeId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Employee deleted successfully" });
    });
})

app.get('/customers', (req, res)=>{
    const percent = req.query.percent;
    let sql;
    if (percent) {
        sql = "SELECT card_number, cust_surname, cust_name, cust_patronymic, phone_number, city, street, zip_code, percent FROM customer_card WHERE percent = ?";
        db.query(sql, [percent], (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
    } else {
        sql = "SELECT card_number, cust_surname, cust_name, cust_patronymic, phone_number, city, street, zip_code, percent FROM customer_card";
        db.query(sql, (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
    }
});

app.post('/customers', (req, res) => {
    const card = req.query.card;
    const surname = req.query.surname;
    const name = req.query.name;
    const patronymic = req.query.patronymic;
    const phone = req.query.phone;
    const city = req.query.city;
    const street = req.query.street;
    const zipCode = req.query.zipCode;
    const percent = req.query.percent;
    let sql;

    if (card && surname && name && patronymic && phone && city && street && zipCode && percent){
        sql = "INSERT INTO `customer_card` (card_number, cust_surname, cust_name, cust_patronymic, phone_number, city, street, zip_code, percent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [card, surname, name, patronymic, phone, city, street, zipCode, percent], (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
        //немає побатькові
    } else if (card && surname && name && phone && city && street && zipCode && percent){
        sql = "INSERT INTO `customer_card` (card_number, cust_surname, cust_name, cust_patronymic, phone_number, city, street, zip_code, percent) VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?)";
        db.query(sql, [card, surname, name, phone, city, street, zipCode, percent], (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
        // немає міста
    } else if (card && surname && name && patronymic && phone && street && zipCode && percent){
        sql = "INSERT INTO `customer_card` (card_number, cust_surname, cust_name, cust_patronymic, phone_number, city, street, zip_code, percent) VALUES (?, ?, ?, ?, ?, NULL, ?, ?, ?)";
        db.query(sql, [card, surname, name, patronymic, phone, street, zipCode, percent], (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
        // немає вулиці
    } else if (card && surname && name && patronymic && phone && city && zipCode && percent){
        sql = "INSERT INTO `customer_card` (card_number, cust_surname, cust_name, cust_patronymic, phone_number, city, street, zip_code, percent) VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?)";
        db.query(sql, [card, surname, name, patronymic, phone, city, zipCode, percent], (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
        // немає поб, міста, вул, інд
    } else if (card && surname && name && phone && percent){
        sql = "INSERT INTO `customer_card` (card_number, cust_surname, cust_name, cust_patronymic, phone_number, city, street, zip_code, percent) VALUES (?, ?, ?, NULL, ?, NULL, NULL, NULL, ?)";
        db.query(sql, [card, surname, name, phone, percent], (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
        // немає міста, вул, інд
    } else if (card && surname && name && patronymic && phone && percent){
        sql = "INSERT INTO `customer_card` (card_number, cust_surname, cust_name, cust_patronymic, phone_number, percent) VALUES (?, ?, ?, ?, ?, NULL, NULL, NULL, ?)";
        db.query(sql, [card, surname, name, patronymic, phone, percent], (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
    }

});

app.post('/customers/:id', (req, res) => {
    const card = req.params.id;
    const surname = req.query.surname;
    const name = req.query.name;
    const patronymic = req.query.patronymic;
    const phone = req.query.phone;
    const city = req.query.city;
    const street = req.query.street;
    const zipCode = req.query.zipCode;
    const percent = req.query.percent;
    let sql;

    if (surname && name && phone && percent){
        sql = "UPDATE `customer_card` SET cust_surname = ?, cust_name = ?, cust_patronymic = ?, phone_number = ?, city = ?, street = ?, zip_code = ?, percent = ? WHERE card_number = ?";
        db.query(sql, [surname, name, patronymic, phone, city, street, zipCode, percent, card], (err, data) => {
            if(err) return res.json(err);
            return res.json(data);
        });
    } 
});

app.delete('/customers/:id', (req, res) => {
    const custId = req.params.id;
    const sql = "DELETE FROM customer_card WHERE card_number = ?";
    db.query(sql, [custId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Customer deleted successfully" });
    });
})

app.get('/products', (req, res)=>{
    const sql = "SELECT id_product,	product_name, characteristics, category_number, (SELECT category_name FROM category WHERE category_number = product.category_number) AS category_name FROM product";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.delete('/products/:id', (req, res) => {
    const productId = req.params.id;
    const sql = "DELETE FROM product WHERE id_product = ?";
    db.query(sql, [productId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Product deleted successfully" });
    });
})

app.post('/products', (req, res) => {
    const name = req.query.name;
    const characteristics = req.query.characteristics;
    const category = req.query.category;
    let sql;

    if(name && characteristics && category){
        sql = "INSERT INTO `product` (id_product, product_name, characteristics, category_number) VALUES (NULL, ?, ?, ?);"
        db.query(sql, [name, characteristics, category], (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
    }
})

app.post('/products/:id', (req, res) => {
    const prodID = req.params.id;
    const name = req.query.name;
    const characteristics = req.query.characteristics;
    const category = req.query.category;
    let sql;

    if(name && characteristics && category){
        sql = "UPDATE `product` SET product_name = ?, characteristics = ?, category_number = ? WHERE id_product = ?";
        db.query(sql, [name, characteristics, category, prodID], (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
    }
});

app.get('/productsInStore', (req, res)=>{
    const upc = req.query.upc;
    let sql;
    if (upc) {
        sql = "SELECT upc,id_product, (SELECT product_name FROM product WHERE id_product = store_product.id_product) AS product_name, selling_price, products_number, promotional_product, (SELECT category_name FROM category WHERE category_number = (SELECT category_number FROM product WHERE id_product = store_product.id_product)) AS category_name FROM store_product WHERE upc = ?";
        db.query(sql, [upc], (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
    } else {
        sql = "SELECT upc, id_product, (SELECT product_name FROM product WHERE id_product = store_product.id_product) AS product_name, selling_price, products_number, promotional_product, (SELECT category_name FROM category WHERE category_number = (SELECT category_number FROM product WHERE id_product = store_product.id_product)) AS category_name FROM store_product";
        db.query(sql, (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
    }
});

app.post('/productsInStore', (req, res) => {
    const idProduct = req.query.idProduct;
    const upc = req.query.upc;
    const price = req.query.price;
    const number = req.query.number;
    const prom = req.query.prom;
    let sql;

    if(idProduct && upc && price && prom && number){
        sql = "INSERT INTO `store_product` (upc, upc_prom, id_product, selling_price, products_number, promotional_product) VALUES (?, ?, ?, ?, ?, ?);"
        db.query(sql, [upc, upc, idProduct, price, number, prom], (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
    }
})

app.post('/productsInStore/:id', (req, res) => {
    const upc = req.params.id;
    const prodID = req.query.prodID;
    const price = req.query.price;
    const number = req.query.number;
    const prom = req.query.prom;
    let sql;

    if(prodID && price && prom && number){
        sql = "UPDATE `store_product` SET id_product = ?, selling_price = ?, products_number = ?, promotional_product = ? WHERE upc = ?"
        db.query(sql, [prodID, price, number, prom, upc], (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
    }
})

app.get('/promotionalProducts', (req, res) => {
    const sql = "SELECT upc FROM `store_product`;"
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    });
})

app.delete('/productsInStore/:id', (req, res) => {
    const productId = req.params.id;
    const sql = "DELETE FROM store_product WHERE id_product = ?";
    db.query(sql, [productId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Product deleted successfully" });
    });
})

app.get('/categories', (req, res)=>{
    const sql = "SELECT * FROM category";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.delete('/categories/:id', (req, res) => {
    const categoryId = req.params.id;
    const sql = "DELETE FROM category WHERE category_number = ?";
    db.query(sql, [categoryId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Category deleted successfully" });
    });
})

app.post('/categories/:id', (req, res) => {
    const categoryId = req.params.id;
    const newCategoryName = req.query.newCategoryName;

    const sql = "UPDATE `category` SET category_name = ? WHERE category_number = ?";
    console.log(sql);
    db.query(sql, [newCategoryName, categoryId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Category updated successfully" });
    });
})

app.post('/categories', (req, res) => {
    const categoryName = req.query.categoryName;
    const sql = "INSERT INTO category (category_number,category_name) VALUES (NULL, ?)";
    db.query(sql, [categoryName], (err, data)=>{
        if(err) return res.json(err);
        return res.json({ message: "Category added successfully" });
    })
});

app.get('/cashiers', (req, res) => {
    const sql = "SELECT id_employee, empl_surname, empl_name FROM employee WHERE empl_role = 'cashier'";
    
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

app.get('/check', (req, res) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const employeeId = req.query.employeeId;

    let sql;
    let params = [];
    if (startDate && endDate && employeeId) {
        sql = "SELECT check_number, card_number, print_date, sum_total, vat, id_employee FROM `check` WHERE print_date BETWEEN ? AND ? AND id_employee = ?";
        params = [startDate, endDate, employeeId];
    } else if (startDate && endDate){
        sql = "SELECT check_number, card_number, print_date, sum_total, vat, id_employee FROM `check` WHERE print_date BETWEEN ? AND ?";
        params = [startDate, endDate];
    } else if (startDate && employeeId) {
        sql = "SELECT check_number, card_number, print_date, sum_total, vat, id_employee FROM `check` WHERE print_date > ? AND id_employee = ?";
        params = [startDate, employeeId];
    } else if (endDate && employeeId) {
        sql = "SELECT check_number, card_number, print_date, sum_total, vat, id_employee FROM `check` WHERE print_date < ? AND id_employee = ?";
        params = [endDate, employeeId];
    } else if (startDate) {
        sql = "SELECT check_number, card_number, print_date, sum_total, vat, id_employee FROM `check` WHERE print_date > ?";
        params = [startDate];
    } else if (endDate) {
        sql = "SELECT check_number, card_number, print_date, sum_total, vat, id_employee FROM `check` WHERE print_date < ?";
        params = [endDate];
    } else if (employeeId) {
        sql = "SELECT check_number, card_number, print_date, sum_total, vat, id_employee FROM `check` WHERE id_employee = ?";
        params = [employeeId];
    }else {
        sql = "SELECT check_number, card_number, print_date, sum_total, vat, id_employee FROM `check`";
    }

    db.query(sql, params, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

app.get('/checkProducts', (req, res) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const productId = req.query.productId;

    let sql;
    let params = [];
    if (startDate && endDate && productId) {
        sql = "SELECT sp.id_product, p.product_name, SUM(s.product_number) AS total_units_sold FROM `check` JOIN sale s ON `check`.check_number = s.check_number JOIN store_product sp ON s.upc = sp.upc JOIN product p ON sp.id_product = p.id_product WHERE `check`.print_date > ? AND `check`.print_date < ? AND p.id_product = ? GROUP BY sp.id_product, p.product_name;";
        params = [startDate, endDate, productId];
    } else if (startDate && endDate){
        sql = "SELECT SUM(s.product_number) AS total_units_sold FROM `check` JOIN sale s ON `check`.check_number = s.check_number JOIN store_product sp ON s.upc = sp.upc JOIN product p ON sp.id_product = p.id_product WHERE `check`.print_date > ? AND `check`.print_date < ? GROUP BY sp.id_product, p.product_name;";
        params = [startDate, endDate];
    } else if (startDate && productId) {
        sql = "SELECT sp.id_product, p.product_name, SUM(s.product_number) AS total_units_sold FROM `check` JOIN sale s ON `check`.check_number = s.check_number JOIN store_product sp ON s.upc = sp.upc JOIN product p ON sp.id_product = p.id_product WHERE `check`.print_date > ? AND p.id_product = ? GROUP BY sp.id_product, p.product_name;";
        params = [startDate, productId];
    } else if (endDate && productId) {
        sql = "SELECT sp.id_product, p.product_name, SUM(s.product_number) AS total_units_sold FROM `check` JOIN sale s ON `check`.check_number = s.check_number JOIN store_product sp ON s.upc = sp.upc JOIN product p ON sp.id_product = p.id_product WHERE `check`.print_date < ? AND p.id_product = ? GROUP BY sp.id_product, p.product_name;";
        params = [endDate, productId];
    } else if (startDate) {
        sql = "SELECT sp.id_product, p.product_name, SUM(s.product_number) AS total_units_sold FROM `check` JOIN sale s ON `check`.check_number = s.check_number JOIN store_product sp ON s.upc = sp.upc JOIN product p ON sp.id_product = p.id_product WHERE `check`.print_date > ? GROUP BY sp.id_product, p.product_name;";
        params = [startDate];
    } else if (endDate) {
        sql = "SELECT sp.id_product, p.product_name, SUM(s.product_number) AS total_units_sold FROM `check` JOIN sale s ON `check`.check_number = s.check_number JOIN store_product sp ON s.upc = sp.upc JOIN product p ON sp.id_product = p.id_product WHERE `check`.print_date < ? GROUP BY sp.id_product, p.product_name;";
        params = [endDate];
    } else if (productId) {
        sql = "SELECT sp.id_product, p.product_name, SUM(s.product_number) AS total_units_sold FROM `check` JOIN sale s ON `check`.check_number = s.check_number JOIN store_product sp ON s.upc = sp.upc JOIN product p ON sp.id_product = p.id_product WHERE p.id_product = ? GROUP BY sp.id_product, p.product_name;";
        params = [productId];
    }else {
        sql = "SELECT SUM(s.product_number) AS total_units_sold FROM `check` JOIN sale s ON `check`.check_number = s.check_number JOIN store_product sp ON s.upc = sp.upc JOIN product p ON sp.id_product = p.id_product;";
    }

    db.query(sql, params, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

app.get('/sumCheck', (req, res) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const employeeId = req.query.employeeId;

    let sql;
    let params = [];
    if (startDate && endDate && employeeId) {
        sql = "SELECT SUM(sum_total) AS sum FROM `check` WHERE print_date BETWEEN ? AND ? AND id_employee = ?";
        params = [startDate, endDate, employeeId];
    } else if (startDate && endDate){
        sql = "SELECT SUM(sum_total) AS sum FROM `check` WHERE print_date BETWEEN ? AND ?";
        params = [startDate, endDate];
    } else if (startDate && employeeId) {
        sql = "SELECT SUM(sum_total) AS sum FROM `check` WHERE print_date > ? AND id_employee = ?";
        params = [startDate, employeeId];
    } else if (endDate && employeeId) {
        sql = "SELECT SUM(sum_total) AS sum FROM `check` WHERE print_date < ? AND id_employee = ?";
        params = [endDate, employeeId];
    } else if (startDate) {
        sql = "SELECT SUM(sum_total) AS sum FROM `check` WHERE print_date > ?";
        params = [startDate];
    } else if (endDate) {
        sql = "SELECT SUM(sum_total) AS sum FROM `check` WHERE print_date < ?";
        params = [endDate];
    } else if (employeeId) {
        sql = "SELECT SUM(sum_total) AS sum FROM `check` WHERE id_employee = ?";
        params = [employeeId];
    }else {
        sql = "SELECT SUM(sum_total) AS sum FROM `check`";
    }

    db.query(sql, params, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

app.get('/sales', (req, res) => {
    const checkNumber = req.query.checkNumber;

    const sql = "SELECT (SELECT product_name FROM product WHERE id_product = (SELECT id_product FROM store_product WHERE upc = s.upc)) AS product_name, s.product_number, s.selling_price FROM sale s WHERE s.check_number = ?";

    db.query(sql, [checkNumber], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

app.delete('/check/:id', (req, res) => {
    const checkId = req.params.id;
    const sql = "DELETE FROM `check` WHERE check_number = ?";
    db.query(sql, [checkId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Check deleted successfully" });
    });
})

app.listen(8081, ()=> {
    console.log("listen");
})