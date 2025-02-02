import React from "react";
import "../assets/css/browsepage.css";
import "../assets/css/checkbox.css";
import Checkbox from "./Checkbox";
import ProductCard from "./ProductCard";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  CartItemDataContext,
  StoreContext,
  SearchContext,
  RetrieveCartItemData,
  ProductContext,
  FetchProductsContext,
  DetectedCategoriesContext
} from "../ContextList";

import {jss} from "../assets/js/jss.js"
import DetailedPage from "./DetailedPage.jsx"
import "../assets/css/detailedpage.css"

export default function BrowsePage() {


  


  const [admin, setAdmin] = useState(false);

  let [data, setData] = React.useState({});
  let [details, setDetails] = React.useState([]);
  const [storeData, useStoreData] = useContext(StoreContext);
  const [productData, setProductData] = useContext(ProductContext);
  const [cartItemData, setCartItemData] = useContext(CartItemDataContext);
  const fetchProducts = useContext(FetchProductsContext);
  const [detectedCategories, setDetectedCategories] = useContext(DetectedCategoriesContext);
  const [modernFilters, setModernFilters] = useState(true);
  const [createItem, setCreateItem] = useState(false);

  const navigate = useNavigate();
 

  const retrieveCartItemData = useContext(RetrieveCartItemData);


  // begin insane search section
  
  function stringMatch(string1, string2) {
    return string1.toLowerCase().replace(/\s+/g, '').includes(string2.toLowerCase().replace(/\s+/g, ''));
  }
  const {accessSearch,
    accessSearch: { 
      category, 
      searchTerm, 
      minPrice, 
      maxPrice, 
      detailFilters },
    setSearch: {
      setCategory,
      setSearchTerm,
      setMinPrice,
      setMaxPrice,
      setDetailFilters,
    },
  } = useContext(SearchContext);

 const [filteredProducts, setFilteredProducts] = useState([]);

 function updateSearch() {

  if(productData?.length > 0){console.log(category)
  console.log(Object.values(detailFilters))
  let noFilters = false
  if(((Object.values(detailFilters).every((value) => value = []))) || detailFilters == {}){noFilters = true; console.log("no filters")}
  let nonEmptyDetailFilterKeyMatches = {}

  console.log(nonEmptyDetailFilterKeyMatches)
  // filtered products be declared first because using setstate doesnt doesnt alter value for immediate use.. state is for dom to "react" to, not normal js
  let localFilteredProducts = productData.filter((product) => {
    nonEmptyDetailFilterKeyMatches = {}
    Object.keys(detailFilters).forEach((key) => {
      if (detailFilters[key]?.length > 0) {
        nonEmptyDetailFilterKeyMatches[key] = false
      }
    })
    let filterMatch = false
    
    //   filterMatch = true
    // }
    // for each detail key in product
    Object.keys(product.details_object).forEach((key) => {
      // check if product key has data in detailFilters
      if (detailFilters[key]?.length > 0) {
        // and if it does, check if any of the values in that key in the product details object are present in detailfilters with that key
        detailFilters[key].forEach((value) => {
          // console.log(key)
          if (product.details_object[key].includes(value)) {
            // console.log(product.product_id + product.product_name + key + " " + value);
            nonEmptyDetailFilterKeyMatches[key] = true
            filterMatch = true
            noFilters = false
         } 
        })
        
      }

    })
    // if((filterMatch = false) && ((Object.values(detailFilters).every((value) => value = []))) || detailFilters == {}){filterMatch = true}
    // console.log(Object.values(nonEmptyDetailFilterKeyMatches))
    let outputBoolean = 
    stringMatch(product.product_name, searchTerm) && 
    (filterMatch || noFilters) && 
    (Object.values(nonEmptyDetailFilterKeyMatches).every((value) => value == true)) &&
    (product.store_id == storeData[0] || storeData[0] == -1)

    return (
      outputBoolean
    );
  })
  console.log(localFilteredProducts)
  setFilteredProducts(localFilteredProducts);
  // console.log("useeffect triggered by accessSearch change or productData change. resulted filtered products below");
  // console.log(filteredProducts);
  let newDetails = calculateDetails(localFilteredProducts);

  // // why do i have to do tostring
  // if (JSON.stringify(details) != JSON.stringify(newDetails)){
  //   if(!modernFilters){newDetails = calculateDetails(productData)}
  //   setDetails(newDetails) // here is the magic 
  //   // console.log("executing 93")
  // }

  // why do i have to do tostring
  if (JSON.stringify(details) != JSON.stringify(newDetails)){
    setDetails(calculateDetails(productData)) // here is the magic 
    // console.log("executing 93")
  


  
  // setDetails with new details means potentially new checkboxes.. now update search context
  Object.keys(detailFilters).forEach((key) => {
    detailFilters[key].forEach((value) => {
      console.log(key, value);
      if (!newDetails[key] || !newDetails[key].includes(value)) {
        console.log("executing 98")
        let newDetailFilters = { ...detailFilters, [key]: detailFilters[key].filter((filter) => filter !== value) }
        if(detailFilters != newDetailFilters){console.log ("updating");setDetailFilters(newDetailFilters);}
      }
    });
  })}
  console.log(details)
}
}

 useEffect(() => {
  // why did i have to invoke update search in Checkbox.jsx instead of only here? I'm really upset
  updateSearch()
  if(storeData[0] == -1){
    navigate('/');
  }

  }, [modernFilters, accessSearch, productData, null]);


  // // finish insane search section
 
  function calculateDetails(data) {
    console.log("hi")
    let details = {};
    // console.log(data.length);
    console.log(data)
    for (let productIndex = 0; productIndex < data.length; productIndex++) {
      // for each product
      let detailList = data[productIndex].details_object;
      let detailListKeys = Object.keys(detailList);
      // console.log(detailListKeys);

      for (
        let detailCount = 0;
        detailCount < detailListKeys.length;
        detailCount++
      ) {
        // for each detail
        // console.log(detailList);
        // console.log(detailListKeys[detailCount]);

        let detailKey = detailListKeys[detailCount];
        let detailValue = detailList[detailListKeys[detailCount]];

        if (!details[detailKey]) {
          details[detailKey] = [];
        }
        if (!details[detailKey].includes(detailValue)) {
          details[detailKey].push(detailValue);
        }
      }
    }

    return details;
  }


  useEffect(() => {
    if(storeData[1].length > 0 && storeData[2] != -1) {
        
              // set background color for particular store browse page
      document.documentElement.style.setProperty('--col1', storeData[1][storeData[2]].style.triColorBack[1]);
      document.documentElement.style.setProperty('--col2', storeData[1][storeData[2]].style.triColorBack[2]);
      document.documentElement.style.setProperty('--col3', storeData[1][storeData[2]].style.triColorBack[3]);
    }
}, [storeData])

  return (
    <>
      <div className="detailed-page-container"><DetailedPage /></div>
      
      <div className="search-container" onMouseLeave={(e) => e.target.scrollTop = 0}>
        <input placeholder="Search..." className="search-input" type="text" onChange={(e) => {setSearchTerm(e.target.value); console.log(e.target.value)}}/>
        <div className="filter-container" onMouseLeave={(e) => e.target.scrollTop = 0}>
          {Object.keys(details).length > 0 &&
            Object.keys(details).map((detailKey, index) => {
              return (
                <div className="filter-checkboxes-collection" key={index}>
                  <p className="checkbox-collection-label">{detailKey}</p>
                  {details[detailKey].map((detailValue, index) => {
                    return <Checkbox updateSearch={updateSearch} key={index} detailKey={detailKey} detailValue={detailValue} />;
                  })}
                </div>
              );
            })}
        </div>

        {/* <div className="current-filter-behavior">Current Filter Behavior: <span onClick={() => setModernFilters(!modernFilters)}>{modernFilters? "Modern" : "Classic"}</span></div> */}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="product-container">
          
          {createItem && <ProductCard product ={{product_id: "", product_name: "Product Name", images: null, price: 12.34, description: "description", stock: 10, details_object: {key: "value", key2: "value2"}}} admin={admin} editableID={true}/>}
          {filteredProducts
          .map((product, index) => {
            return <ProductCard key={index} product={product} admin={admin} />;
          })}
        </div>
      ) : null}
      <button className={`admin-button ${admin ? "shown" : ""}`} onClick={()=>{setAdmin(!admin)}}>ADMIN ACTIVE</button>
      <button className={`create-item-button ${admin ? "shown" : ""}`} onClick={() => {setCreateItem(!createItem)}}>CREATE ITEM</button>
    </>
  );
}
  // array[x].product_id
  // array[x].product_name
  // array[x].images
  // array[x].price
  // array[x].description
  // array[x].stock
  // array[x].details_object