import React, { useEffect, useState } from "react";

import "./App.css";
import LoginForm from "./LoginForm";
import Product from "./Product";
import ProductInStore from "./ProductInStore";
import Employee from "./Employee";
import AboutMe from "./AboutMe";
import Customers from "./Customers";
import Categories from "./Categories";
import Checks from "./Checks";

import ProductCashier from "./ProductCashier";
import ProductInStoreCashier from "./ProductInStoreCashier";
import CustomersCashier from "./CustomersCashier";
import AboutMeCashier from "./AboutMeCashier";
import ChecksCashier from "./ChecksCashier";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedInCashier, setIsLoggedInCashier] = useState(false);
  const [cashierInfo, setCashierInfo] = useState(null);
  const [managerInfo, setManagerInfo] = useState(null);
  
  const [showForm, setShowForm] = useState(false); 
  const [currentCategory, setCurrentCategory] = useState("about-me");
  const [aboutMe, setAboutMe] = useState(true);
  const [product, setProduct] = useState(false);
  const [productInStore, setProductInStore] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [customers, setCustomers] = useState(false);
  const [checks, setChecks] = useState(false);
  const [employee, setEmployee] = useState(false);
  
  const [currentCategoryCashier, setCurrentCategoryCashier] = useState("about-me");
  const [aboutMeCashier, setAboutMeCashier] = useState(true);
  const [productCashier, setProductCashier] = useState(false);
  const [productInStoreCashier, setProductInStoreCashier] = useState(false);
  const [customersCashier, setCustomersCashier] = useState(false);
  const [checksCashier, setChecksCashier] = useState(false);
  
  return (
    <>
        {(!isLoggedIn && !isLoggedInCashier) && <LoginForm setIsLoggedIn={setIsLoggedIn} setIsLoggedInCashier={setIsLoggedInCashier} setCashierInfo={setCashierInfo} setManagerInfo={setManagerInfo} />}
        {isLoggedIn && (
          <>
            <Header showForm={showForm} setShowForm={setShowForm} />
            <main className="main">
              <CategoryFilter
                setCurrentCategory={setCurrentCategory}
                currentCategory={currentCategory}
                setProduct={setProduct}
                setEmployee={setEmployee}
                setAboutMe={setAboutMe}
                setProductInStore={setProductInStore}
                setCustomers={setCustomers}
                setChecks={setChecks}
                setShowCategories={setShowCategories}
                setIsLoggedIn={setIsLoggedIn}
                isLoggedIn={isLoggedIn}
                setIsLoggedInCashier={setIsLoggedInCashier}
                isLoggedInCashier={isLoggedInCashier}
                setManagerInfo={setManagerInfo}
            />
            {aboutMe ? <AboutMe managerInfo={managerInfo} setAboutMe={setAboutMe} aboutMe={aboutMe} /> : null}
            {product ? <Product setProduct={setProduct} product={product} /> : null}
            {productInStore ? (<ProductInStore setProductInStore={setProductInStore} productInStore={productInStore} />
            ) : null}
            {showCategories ?  <Categories setShowCategories={setShowCategories} showCategories={showCategories} /> : null}
            {customers ? <Customers setCustomers={setCustomers} customers={customers} /> : null}
            {checks ? <Checks setChecks={setChecks} checks={checks} /> : null}
            {employee ? <Employee managerInfo={managerInfo} setEmployee={setEmployee} employee={employee} /> : null}
            </main>
          </>
        )} 

        {isLoggedInCashier && (
          <>
            <Header showForm={showForm} setShowForm={setShowForm} />
            <main className="main">
              <CategoryFilterCashier
                setCurrentCategoryCashier={setCurrentCategoryCashier}
                currentCategoryCashier={currentCategoryCashier}
                setProductCashier={setProductCashier}
                setAboutMeCashier={setAboutMeCashier}
                setProductInStoreCashier={setProductInStoreCashier}
                setCustomersCashier={setCustomersCashier}
                setChecksCashier={setChecksCashier}
                setIsLoggedInCashier={setIsLoggedInCashier}
                isLoggedInCashier={isLoggedInCashier}
                setIsLoggedIn={setIsLoggedIn}
                isLoggedIn={isLoggedIn}
                setCashierInfo={setCashierInfo}
            />
            {aboutMeCashier ? <AboutMeCashier cashierInfo={cashierInfo} setAboutMeCashier={setAboutMeCashier} aboutMeCashier={aboutMeCashier} /> : null}
            {productCashier ? <ProductCashier setProductCashier={setProductCashier} productCashier={productCashier} /> : null}
            {productInStoreCashier ? ( <ProductInStoreCashier setProductInStoreCashier={setProductInStoreCashier} productInStoreCashier={productInStoreCashier} />
            ) : null}
            {customersCashier ? <CustomersCashier setCustomersCashier={setCustomersCashier} customersCashier={customersCashier} /> : null}
            {checksCashier ? <ChecksCashier cashierInfo={cashierInfo} setChecksCashier={setChecksCashier} checksCashier={checksCashier} /> : null}
            </main>
          </>
        )}     
    </>
  );
}

function Header() {
  const appTitle = "Zlagoda";

  return (
    <header className="header">
      <div className="logo">
        <h1>{appTitle}</h1>
      </div>
    </header>
  );
}

function CategoryFilterCashier({
  setCurrentCategoryCashier,
  currentCategoryCashier,
  setProductCashier,
  setAboutMeCashier,
  setProductInStoreCashier,
  setCustomersCashier,
  setChecksCashier,
  setIsLoggedInCashier,
  isLoggedInCashier,
  setIsLoggedIn,
  isLoggedIn,
}) {

  return(
    <aside>
      {isLoggedInCashier && (
        <ul>
          <li className="products">
          <button
            className="btn btn-all-categories"
            onClick={() => {
              if (currentCategoryCashier === "about-me") {
                setAboutMeCashier(false);
              } else if (currentCategoryCashier === "products-in-store") {
                setProductInStoreCashier(false);
              } else if (currentCategoryCashier === "customers") {
                setCustomersCashier(false);
              } else if (currentCategoryCashier === "checks") {
                setChecksCashier(false);
              }
              setCurrentCategoryCashier("product");
              setProductCashier(true);
            }}
          >
            Products
          </button>
          </li>

          <li className="products-in-store">
          <button
            className="btn btn-all-categories"
            onClick={() => {
              if (currentCategoryCashier === "about-me") {
                setAboutMeCashier(false);
              } else if (currentCategoryCashier === "product") {
                setProductCashier(false);
              } else if (currentCategoryCashier === "customers") {
                setCustomersCashier(false);
              } else if (currentCategoryCashier === "checks") {
                setChecksCashier(false);
              }
              setCurrentCategoryCashier("products-in-store");
              setProductInStoreCashier(true);
            }}
          >
            Products in store
          </button>
        </li>

        <li className="customers">
          <button
            className="btn btn-all-categories"
            onClick={() => {
              if (currentCategoryCashier === "about-me") {
                setAboutMeCashier(false);
              } else if (currentCategoryCashier === "product") {
                setProductCashier(false);
              } else if (currentCategoryCashier === "products-in-store") {
                setProductInStoreCashier(false);
              } else if (currentCategoryCashier === "checks") {
                setChecksCashier(false);
              }
              setCurrentCategoryCashier("customers");
              setCustomersCashier(true);
            }}
          >
            Customers cards
          </button>
        </li>

        <li className="checks">
          <button
            className="btn btn-all-categories"
            onClick={() => {
              if (currentCategoryCashier === "about-me") {
                setAboutMeCashier(false);
              } else if (currentCategoryCashier === "product") {
                setProductCashier(false);
              } else if (currentCategoryCashier === "products-in-store") {
                setProductInStoreCashier(false);
              } else if (currentCategoryCashier === "customers") {
                setCustomersCashier(false);
              }
              setCurrentCategoryCashier("checks");
              setChecksCashier(true);
            }}
          >
            Checks
          </button>
        </li>

        <li className="about-me">
          <button
            className="btn btn-all-categories"
            onClick={() => {
              if (currentCategoryCashier === "checks") {
                setChecksCashier(false);
              } else if (currentCategoryCashier === "product") {
                setProductCashier(false);
              } else if (currentCategoryCashier === "products-in-store") {
                setProductInStoreCashier(false);
              } else if (currentCategoryCashier === "customers") {
                setCustomersCashier(false);
              }
              setCurrentCategoryCashier("about-me");
              setAboutMeCashier(true);
            }}
          >
            About me
          </button>
        </li>

        <li className="log-out">
          <button
            className="btn btn-all-categories"
            onClick={() => { setIsLoggedIn(false); setIsLoggedInCashier(false); }}
          >
            Log out
          </button>
        </li>
        </ul>
      )}
    </aside>
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
  setIsLoggedIn,
  isLoggedIn,
}) {

  return (
    <aside>
      {isLoggedIn && (
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
              if (currentCategory === "product") {
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
            onClick={() => { 
              setIsLoggedIn(false); 
              setIsLoggedInCashier(false); }}
          >
            Log out
          </button>
        </li>
      </ul>
      )}
    </aside>
  );
}

export default App;