const express = require('express');
const mysql = require('mysql2')
const cors = require('cors')
const crypto = require('crypto');

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
    const id = req.query.id;
    let sql;
    if (surname) { 
        sql = "SELECT id_employee, empl_surname, empl_name, empl_patronymic, empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code, password FROM `employee` WHERE empl_surname = ?";
        db.query(sql, [surname], (err, data)=>{
        if(err) return res.json(err);
        return res.json(data); })
    } else if (id) { 
        sql = "SELECT id_employee, empl_surname, empl_name, empl_patronymic, empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code FROM `employee` WHERE id_employee = ?";
        db.query(sql, [id], (err, data)=>{
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
    const password = req.query.password;
    let sql;

    if (surname && name && phone && city && street && zipCode && role && salary && dateBirth && dateStart && password){
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        sql = "INSERT INTO `employee` (id_employee, empl_surname, empl_name, empl_patronymic, empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code, password) VALUES (NULL, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [surname, name, role, salary, dateBirth, dateStart, phone, city, street, zipCode, hashedPassword], (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
    }
});

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
            return res.json(data);
        });
    }
})

app.post('/updatePassword', (req, res) => {
    const id = req.query.id;
    const password = req.query.password;
    let sql;

    if (id && password) {
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        sql = "UPDATE `employee` SET password = ? WHERE id_employee = ?";
        db.query(sql, [hashedPassword, id], (err, data) => {
            if(err) return res.json(err);
            return res.json(data);
        });
    }
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
    const surname = req.query.surname;
    let sql;
    if (surname) {
        sql = "SELECT card_number, cust_surname, cust_name, cust_patronymic, phone_number, city, street, zip_code, percent FROM customer_card WHERE cust_surname = ?";
        db.query(sql, [surname], (err, data)=>{
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

app.get('/customersPercent', (req, res)=>{
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
    const name = req.query.name;
    let sql;

    if(name){
        sql = "SELECT id_product,	product_name, characteristics, category_number, (SELECT category_name FROM category WHERE category_number = product.category_number) AS category_name FROM product WHERE product_name = ?";
        db.query(sql, [name], (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
    } else{
        sql = "SELECT id_product,	product_name, characteristics, category_number, (SELECT category_name FROM category WHERE category_number = product.category_number) AS category_name FROM product";
        db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
    }
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

app.get('/productsInStoreForCheck', (req, res)=>{
    
    const sql = "SELECT upc, id_product, (SELECT product_name FROM product WHERE id_product = store_product.id_product) AS product_name, selling_price, products_number, promotional_product, (SELECT category_name FROM category WHERE category_number = (SELECT category_number FROM product WHERE id_product = store_product.id_product)) AS category_name FROM store_product WHERE products_number > 0";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err); 
        return res.json(data);
    });
});

app.get('/nonPromProductsInStore', (req, res)=>{
    
    const sql = "SELECT upc, upc_prom, id_product, (SELECT product_name FROM product WHERE id_product = store_product.id_product) AS product_name, selling_price, products_number, promotional_product FROM `store_product` WHERE upc_prom IS NULL AND products_number > 0";
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        return res.json(data);
    });
    
});

app.post('/productsInStore', (req, res) => {
    const idProduct = req.query.idProduct;
    const upc = req.query.upc;
    const price = req.query.price;
    const number = req.query.number;
    const prom = req.query.prom;
    let sql;

    if(idProduct && upc && price && prom && number){
        sql = "INSERT INTO `store_product` (upc, upc_prom, id_product, selling_price, products_number, promotional_product) VALUES (?, NULL, ?, ?, ?, ?);"
        db.query(sql, [upc, idProduct, price, number, prom], (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
    }
})

app.post('/productsInStorePromotional', (req, res) => {
    const upc = req.query.upc;
    const upcProm = req.query.upcProm;
    const number = req.query.number;
    let sql;

    if(upcProm && upc && number){
        sql = "INSERT INTO `store_product` (upc, upc_prom, id_product, selling_price, products_number, promotional_product)" + 
        " SELECT ?, ?, nsp.id_product, nsp.selling_price * 0.8, ?, 1 FROM `store_product` AS nsp WHERE nsp.upc = ?"
        db.query(sql, [upc, upcProm, number, upcProm], (err, data)=>{
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
    let sql;

    if(prodID && price && upc && number){
        sql = "UPDATE `store_product` SET id_product = ?, selling_price = ?, products_number = ? WHERE upc = ?"
        db.query(sql, [prodID, price, number, upc], (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
    }
})

app.post('/productsInStoreUpdateProm', (req, res) => {
    const upc = req.query.upc;
    const upcProm = req.query.upcProm;
    let sql;

    if(upc && upcProm){
        sql = "UPDATE `store_product` SET upc_prom = ? WHERE upc = ?"
        db.query(sql, [upcProm, upc], (err, data)=>{
            if(err) return res.json(err);
            return res.json(data);
        });
    }
})

app.post('/updateNumberProd', (req, res) => {
    const upc = req.query.upc;
    const number = req.query.number;
    let sql;

    if(upc && number){
        sql = "UPDATE `store_product` SET products_number = ? WHERE upc = ?"
        db.query(sql, [number, upc], (err, data)=>{
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
    const upc = req.params.id;

    const sql = "DELETE FROM store_product WHERE upc = ?";
    db.query(sql, [upc], (err, result) => {
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

app.post('/sale', (req, res) => {
    const upc = req.query.upc;
    const checkNum = req.query.checkNum;
    const prodNum = req.query.prodNum;
    let sql;

    if(upc && checkNum && prodNum){
        sql = "INSERT INTO `sale` (upc, check_number, product_number, selling_price) SELECT ?, ?, ?, sp.selling_price FROM `store_product` AS sp WHERE sp.upc = ?";
        db.query(sql, [upc, checkNum, prodNum, upc], (err, data)=>{
            if(err) return res.json(err);
            return res.json({ message: "Sale added successfully" });
        })
    }

})

app.post('/checkAdd', (req, res) => {
    const checkNum = req.query.checkNum;
    const cardNum = req.query.cardNum;
    const date = req.query.date;
    const id = req.query.id;
    let sql;

    if(cardNum && checkNum && date && id){
        sql = "INSERT INTO `check` (check_number, card_number, print_date, sum_total, vat, id_employee) VALUES (?, ?, ?, 0, 0, ?)";
        db.query(sql, [checkNum, cardNum, date, id], (err, data)=>{
            if(err) return res.json(err);
            return res.json({ message: "Check added successfully" });
        })
    } else if(checkNum && date && id) {
        sql = "INSERT INTO `check` (check_number, card_number, print_date, sum_total, vat, id_employee) VALUES (?, NULL, ?, 0, 0, ?)";
        db.query(sql, [checkNum, date, id], (err, data)=>{
            if(err) return res.json(err);
            return res.json({ message: "Check added successfully" });
        })
    }

});

app.post('/checkUpdate', (req, res) => {
    const checkNum = req.query.checkNum;
    const sumTotal = req.query.sumTotal;
    const vat = req.query.vat;
    let sql;

    if (checkNum && sumTotal && vat) {
        sql = "UPDATE `check` SET sum_total = ?, vat = ? WHERE check_number = ?";
        db.query(sql, [sumTotal, vat, checkNum], (err, data) => {
            if (err) return res.json(err);
            return res.json({ message: "Check updated successfully" });
        });
    }
});

app.get('/saleTotal', (req, res) => {
    const checkNum = req.query.checkNum;
    const cardNum = req.query.cardNum;
    let sql;

    if (checkNum && cardNum) {
        sql = "SELECT ((SUM(`sale`.product_number * `sale`.selling_price)) - ((SUM(`sale`.product_number * `sale`.selling_price)) * (`customer_card`.percent/100))) AS total FROM `sale` JOIN `check` ON `sale`.check_number = `check`.check_number JOIN `customer_card` ON `check`.card_number = `customer_card`.card_number WHERE `sale`.check_number = ?";
        db.query(sql, [checkNum], (err, data) => {
            if (err) return res.json(err);
            const total = data[0].total || 0;
            return res.json({ total });
        });
    } else if (checkNum) {
        sql = "SELECT SUM(`sale`.product_number * `sale`.selling_price) AS total FROM `sale` WHERE `sale`.check_number = ?";
        db.query(sql, [checkNum], (err, data) => {
            if (err) return res.json(err);
            const total = data[0].total || 0;
            return res.json({ total });
        });
    }
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
        sql = "SELECT check_number, card_number, print_date, sum_total, vat, id_employee FROM `check` WHERE print_date >= ? AND id_employee = ?";
        params = [startDate, employeeId];
    } else if (endDate && employeeId) {
        sql = "SELECT check_number, card_number, print_date, sum_total, vat, id_employee FROM `check` WHERE print_date <= ? AND id_employee = ?";
        params = [endDate, employeeId];
    } else if (startDate) {
        sql = "SELECT check_number, card_number, print_date, sum_total, vat, id_employee FROM `check` WHERE print_date >= ?";
        params = [startDate];
    } else if (endDate) {
        sql = "SELECT check_number, card_number, print_date, sum_total, vat, id_employee FROM `check` WHERE print_date <= ?";
        params = [endDate];
    } else if (employeeId) {
        sql = "SELECT check_number, card_number, print_date, sum_total, vat, id_employee FROM `check` WHERE id_employee = ?";
        params = [employeeId];
    } else {
        sql = "SELECT check_number, card_number, print_date, sum_total, vat, id_employee FROM `check`";
    }

    db.query(sql, params, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

app.get('/checkToday', (req, res) => {
    const date = req.query.date;
    const employeeId = req.query.employeeId;

    const sql = "SELECT check_number, card_number, print_date, sum_total, vat, id_employee FROM `check` WHERE id_employee = ? AND print_date = ?";
    db.query(sql, [employeeId, date], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

app.get('/checkNumber', (req, res) => {
    const checkNumber = req.query.checkNumber;
    const employeeId = req.query.employeeId;
    let sql;

    if(checkNumber && employeeId){
        sql = "SELECT check_number, card_number, print_date, sum_total, vat, id_employee FROM `check` WHERE check_number = ? AND id_employee = ?";
        db.query(sql, [checkNumber, employeeId], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
        });
    } else if(employeeId) {
        sql = "SELECT check_number, card_number, print_date, sum_total, vat, id_employee FROM `check` WHERE id_employee = ?";
        db.query(sql, [employeeId], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
        });
    } else {
        sql = "SELECT check_number, card_number, print_date, sum_total, vat, id_employee FROM `check`";
        db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
        });
    }
});

app.get('/checkCashierAll', (req, res) => {
    const employeeId = req.query.employeeId;

    const sql = "SELECT check_number, card_number, print_date, sum_total, vat, id_employee FROM `check` WHERE id_employee = ?";
    db.query(sql, [employeeId], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

app.get('/checkProducts', (req, res) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const productUpc = req.query.productUpc;
    let sql;
    let params = [];

    if (startDate && endDate && productUpc) {
        sql = "SELECT sp.upc, p.product_name, SUM(s.product_number) AS total_units_sold FROM `check` JOIN sale s ON `check`.check_number = s.check_number JOIN store_product sp ON s.upc = sp.upc JOIN product p ON sp.id_product = p.id_product WHERE `check`.print_date > ? AND `check`.print_date < ? AND sp.upc = ? GROUP BY sp.upc, p.product_name;";
        params = [startDate, endDate, productUpc];
    } else if (startDate && endDate){
        sql = "SELECT sp.upc, p.product_name, SUM(s.product_number) AS total_units_sold FROM `check` JOIN sale s ON `check`.check_number = s.check_number JOIN store_product sp ON s.upc = sp.upc JOIN product p ON sp.id_product = p.id_product WHERE `check`.print_date > ? AND `check`.print_date < ? GROUP BY sp.upc, p.product_name;";
        params = [startDate, endDate];
    } else if (startDate && productUpc) {
        sql = "SELECT sp.upc, p.product_name, SUM(s.product_number) AS total_units_sold FROM `check` JOIN sale s ON `check`.check_number = s.check_number JOIN store_product sp ON s.upc = sp.upc JOIN product p ON sp.id_product = p.id_product WHERE `check`.print_date > ? AND sp.upc = ? GROUP BY sp.upc, p.product_name;";
        params = [startDate, productUpc];
    } else if (endDate && productUpc) {
        sql = "SELECT sp.upc, p.product_name, SUM(s.product_number) AS total_units_sold FROM `check` JOIN sale s ON `check`.check_number = s.check_number JOIN store_product sp ON s.upc = sp.upc JOIN product p ON sp.id_product = p.id_product WHERE `check`.print_date < ? AND sp.upc = ? GROUP BY sp.upc, p.product_name;";
        params = [endDate, productUpc];
    } else if (startDate) {
        sql = "SELECT sp.upc, p.product_name, SUM(s.product_number) AS total_units_sold FROM `check` JOIN sale s ON `check`.check_number = s.check_number JOIN store_product sp ON s.upc = sp.upc JOIN product p ON sp.id_product = p.id_product WHERE `check`.print_date > ? GROUP BY sp.upc, p.product_name;";
        params = [startDate];
    } else if (endDate) {
        sql = "SELECT sp.upc, p.product_name, SUM(s.product_number) AS total_units_sold FROM `check` JOIN sale s ON `check`.check_number = s.check_number JOIN store_product sp ON s.upc = sp.upc JOIN product p ON sp.id_product = p.id_product WHERE `check`.print_date < ? GROUP BY sp.upc, p.product_name;";
        params = [endDate];
    } else if (productUpc) {
        sql = "SELECT sp.upc, p.product_name, SUM(s.product_number) AS total_units_sold FROM `check` JOIN sale s ON `check`.check_number = s.check_number JOIN store_product sp ON s.upc = sp.upc JOIN product p ON sp.id_product = p.id_product WHERE sp.upc = ? GROUP BY sp.upc, p.product_name;";
        params = [productUpc];
    } else {
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
});

app.get('/customersStatistics', (req, res) => {
    const sql = "SELECT cc.card_number, cc.cust_surname, cc.cust_name, COUNT(ch.check_number) AS total_purchases, " +
   " SUM(ch.sum_total) AS total_sum, AVG(ch.sum_total) AS average_sum, " +
   "GROUP_CONCAT(DISTINCT e.empl_surname SEPARATOR ', ') AS cashier_surnames " +
   "FROM `customer_card` AS cc " +
   "LEFT JOIN `check` AS ch ON cc.card_number = ch.card_number " +
   "LEFT JOIN `employee` AS e ON ch.id_employee = e.id_employee " +
   "GROUP BY cc.card_number";

    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
});

app.get("/employee/statistics", (req, res) => {
    sql =
      "SELECT employee.id_employee, employee.empl_name, employee.empl_surname, employee.empl_patronymic,s.product_number, COUNT(ch.check_number) AS checks_count, COALESCE(SUM(ch.sum_total + ch.vat), 0) AS total_sum FROM `employee` INNER JOIN `check` AS ch ON ch.id_employee = employee.id_employee INNER JOIN sale AS s ON ch.check_number = s.check_number AND s.product_number >= 2 GROUP BY employee.id_employee, employee.empl_name, employee.empl_surname, employee.empl_patronymic,s.product_number;";
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

  app.get("/check/statistics", (req, res) => {
    sql =
      "SELECT * FROM `check` WHERE NOT EXISTS( SELECT * FROM `sale` WHERE check.check_number=sale.check_number AND sale.upc NOT IN(SELECT upc FROM `store_product` st LEFT OUTER JOIN `product` p ON st.id_product = p.id_product LEFT OUTER JOIN `category` c ON p.category_number= c.category_number WHERE category_name IN ('Dairy') ) );";
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

app.get('/custCategory', (req, res) => {
    const category = req.query.category;

    const sql = "SELECT DISTINCT * " +
    "FROM customer_card AS cc " +
    "WHERE NOT EXISTS (" +
        "SELECT * " +
        "FROM `check` AS c " +
        "WHERE c.card_number = cc.card_number " +
        "AND EXISTS (" +
            "SELECT * " +
            "FROM `sale` AS s " +
            "INNER JOIN `store_product` AS sp ON sp.upc = s.upc " +
            "INNER JOIN `product` AS p ON p.id_product = sp.id_product " +
            "WHERE c.check_number = s.check_number " +
            "AND p.category_number <> ?)" +
    ") AND EXISTS (" +
        "SELECT * " +
        "FROM `check` AS c " +
        "WHERE c.card_number = cc.card_number " +
        "AND NOT EXISTS (" +
            "SELECT * " +
            "FROM `sale` AS s " +
            "INNER JOIN `store_product` AS sp ON sp.upc = s.upc " +
            "INNER JOIN `product` AS p ON p.id_product = sp.id_product " +
            "WHERE c.check_number = s.check_number " +
            "AND p.category_number <> ?))";

    db.query(sql, [category, category], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

app.post('/login', (req, res) => {
    const id = req.query.id;
    const password = req.query.password;

    if (id && password) {
        db.query("SELECT id_employee, password, empl_role FROM `employee` WHERE id_employee = ?", [id], (err, data) => {
            if (err) return res.status(500).json({ error: 'Internal Server Error' });
            if (data.length === 0) {
                return res.status(401).json({ error: 'Invalid ID or password' });
            } else {
                const employee = data[0];
                const hashedPasswordFromDB = employee.password;

                const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

                if (hashedPassword === hashedPasswordFromDB) {
                    return res.status(200).json({ message: 'Login successful', role: employee.empl_role, ID: employee.id_employee });
                } else {
                    return res.status(401).json({ error: 'Invalid ID or password' });
                }
            }
        });
    }
});

app.listen(8081, ()=> {
    console.log("listen");
});

// UPDATE employee
// SET password = SHA2(password, 256);