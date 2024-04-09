import React, { useEffect, useState } from "react";
import "./App.css";
import Product from "./Product";
import ProductInStore from "./ProductInStore";
import Employee from "./Employee";
import AboutMe from "./AboutMe";
import Customers from "./Customers";
import Categories from "./Categories";
import Checks from "./Checks";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("about-me");
  const [aboutMe, setAboutMe] = useState(true);
  const [product, setProduct] = useState(false);
  const [productInStore, setProductInStore] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [customers, setCustomers] = useState(false);
  const [checks, setChecks] = useState(false);
  const [employee, setEmployee] = useState(false);
  const [editProduct, setEditProduct] = useState(false);

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />

      <main className="main">
        <CategoryFilter
          setCurrentCategory={setCurrentCategory}
          currentCategory={currentCategory}
          setProduct={setProduct}
          setAboutMe={setAboutMe}
          setProductInStore={setProductInStore}
          setCustomers={setCustomers}
          setChecks={setChecks}
          setEmployee={setEmployee}
          setShowCategories={setShowCategories}
        />
        {aboutMe ? <AboutMe setAboutMe={setAboutMe} aboutMe={aboutMe} /> : null}
        {product ? <Product setProduct={setProduct} product={product} /> : null}
        {productInStore ? (
          <ProductInStore
            setProductInStore={setProductInStore}
            productInStore={productInStore}
            editProduct={editProduct}
            setEditProduct={setEditProduct}
          />
        ) : null}
        {showCategories ?  <Categories setShowCategories={setShowCategories} showCategories={showCategories} /> : null}
        {customers ? <Customers setCustomers={setCustomers} customers={customers} /> : null}
        {checks ? <Checks setChecks={setChecks} checks={checks} /> : null}
        {employee ? <Employee setEmployee={setEmployee} employee={employee} /> : null}
      </main>
    </>
  );
}

function Header({ showForm, setShowForm }) {
  const appTitle = "Zlagoda";

  return (
    <header className="header">
      <div className="logo">
        <h1>{appTitle}</h1>
      </div>
    </header>
  );
}

function CategoryFilter({
  setCurrentCategory,
  currentCategory,
  setProduct,
  setAboutMe,
  setProductInStore,
  setCustomers,
  setChecks,
  setEmployee,
  setShowCategories,
}) {
  return (
    <aside>
      <ul>
        <li className="products">
          <button
            className="btn btn-all-categories"
            onClick={() => {
              if (currentCategory === "about-me") {
                setAboutMe(false);
              } else if (currentCategory === "products-in-store") {
                setProductInStore(false);
              } else if (currentCategory === "customers") {
                setCustomers(false);
              } else if (currentCategory === "employee") {
                setEmployee(false);
              } else if (currentCategory === "checks") {
                setChecks(false);
              } else if (currentCategory === "categories") {
                setShowCategories(false);
              }
              setCurrentCategory("product");
              setProduct(true);
            }}
          >
            Products
          </button>
        </li>
        <li className="products-in-store">
          <button
            className="btn btn-all-categories"
            onClick={() => {
              if (currentCategory === "about-me") {
                setAboutMe(false);
              } else if (currentCategory === "product") {
                setProduct(false);
              } else if (currentCategory === "customers") {
                setCustomers(false);
              } else if (currentCategory === "checks") {
                setChecks(false);
              } else if (currentCategory === "employee") {
                setEmployee(false);
              } else if (currentCategory === "categories") {
                setShowCategories(false);
              }
              setCurrentCategory("products-in-store");
              setProductInStore(true);
            }}
          >
            Products in store
          </button>
        </li>

        <li className="products-in-store">
          <button
            className="btn btn-all-categories"
            onClick={() => {
              if (currentCategory === "about-me") {
                setAboutMe(false);
              } else if (currentCategory === "product") {
                setProduct(false);
              } else if (currentCategory === "customers") {
                setCustomers(false);
              } else if (currentCategory === "checks") {
                setChecks(false);
              } else if (currentCategory === "employee") {
                setEmployee(false);
              }else if (currentCategory === "products-in-store") {
                setProductInStore(false);
              }
              setCurrentCategory("categories");
              setShowCategories(true);
            }}
          >
            Categories
          </button>
        </li>

        <li className="customers">
          <button
            className="btn btn-all-categories"
            onClick={() => {
              if (currentCategory === "about-me") {
                setAboutMe(false);
              } else if (currentCategory === "product") {
                setProduct(false);
              } else if (currentCategory === "products-in-store") {
                setProductInStore(false);
              } else if (currentCategory === "checks") {
                setChecks(false);
              } else if (currentCategory === "employee") {
                setEmployee(false);
              } else if (currentCategory === "categories") {
                setShowCategories(false);
              }
              setCurrentCategory("customers");
              setCustomers(true);
            }}
          >
            Customers cards
          </button>
        </li>
        <li className="checks">
          <button
            className="btn btn-all-categories"
            onClick={() => {
              if (currentCategory === "about-me") {
                setAboutMe(false);
              } else if (currentCategory === "products-in-store") {
                setProductInStore(false);
              } else if (currentCategory === "customers") {
                setCustomers(false);
              } else if (currentCategory === "product") {
                setProduct(false);
              } else if (currentCategory === "employee") {
                setEmployee(false);
              } else if (currentCategory === "categories") {
                setShowCategories(false);
              }
              setCurrentCategory("checks");
              setChecks(true);
            }}
          >
            Checks
          </button>
        </li>
        <li className="employee">
          <button
            className="btn btn-all-categories"
            onClick={() => {
              if (currentCategory === "about-me") {
                setAboutMe(false);
              } else if (currentCategory === "product") {
                setProduct(false);
              } else if (currentCategory === "products-in-store") {
                setProductInStore(false);
              } else if (currentCategory === "checks") {
                setChecks(false);
              } else if (currentCategory === "customers") {
                setCustomers(false);
              } else if (currentCategory === "categories") {
                setShowCategories(false);
              }
              setCurrentCategory("employee");
              setEmployee(true);
            }}
          >
            Employee
          </button>
        </li>
        <li className="about-me">
          <button
            className="btn btn-all-categories"
            onClick={() => {
              if (currentCategory === "ptoduct") {
                setProduct(false);
              } else if (currentCategory === "products-in-store") {
                setProductInStore(false);
              } else if (currentCategory === "customers") {
                setCustomers(false);
              } else if (currentCategory === "checks") {
                setChecks(false);
              } else if (currentCategory === "employee") {
                setEmployee(false);
              } else if (currentCategory === "categories") {
                setShowCategories(false);
              }
              setCurrentCategory("about-me");
              setAboutMe(true);
            }}
          >
            About me
          </button>
        </li>
        <li className="log-out">
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory("log-out")}
          >
            Log out
          </button>
        </li>
      </ul>
    </aside>
  );
}

export default App;


// import React, { useEffect, useState } from 'react'

// function App(){
//   const [data, setData] = useState([])
//   useEffect(()=>{
//       fetch('http://localhost:8081/users')
//       .then(res => res.json())
//       .then(data => setData(data))
//       .catch(err => console.log(err));
//   }, []
//   )
//     return(
//       <div>
//           <table>
//             <thead>
//               <tr>
//                 <th>id_employee</th>
//                 <th>empl_surname</th>
//                 <th>empl_name</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((d,i) => (
//                 <tr key={i}>
//                   <td>{d.id_employee}</td>
//                   <td>{d.empl_surname}</td>
//                   <td>{d.empl_name}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//       </div>
//     )
// }

// export default App

