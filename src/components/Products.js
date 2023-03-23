import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {

  const [items, setItems] = useState([])
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState([])
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [debounceTimeout,setDebounceTimeout] = useState("")
  const token = localStorage.getItem("token")

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
setIsLoading(true)

      try{
        const res = await axios.get(`${config.endpoint}/products`);
        setIsLoading(false)
        setProducts(res.data)
        setFilteredProducts(res.data)
        return res.data
      }catch(e){
        setIsLoading(false)
        if(e.response && e.response.status === 400){
          enqueueSnackbar(e.response.data.message, {variant: "error"})
        }else
         enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {variant : "error"})
      }

  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {

    try{
      const res = await axios.get(`${config.endpoint}/products/search?value=${text}`);
     
      setFilteredProducts(res.data)
      return res.data
    }catch(e){
      
      if(e.response.status === 404){
        //enqueueSnackbar(e.response.data.message, {variant: "error"})
        setFilteredProducts([])
      }else
       enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {variant : "error"})
    }


  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;

    if(debounceTimeout){
      clearTimeout(debounceTimeout)
    }

    const timeout = setTimeout(()=>{
      performSearch(value)
    },500)
setDebounceTimeout(timeout);

  };

    useEffect(()=>{
      const onLoadHandler = async () =>{
        const productData = await performAPICall()
      }
      onLoadHandler()
    },[])

    const handleDebounceDesktop = (e) =>{
      debounceSearch(e, debounceTimeout)
    }




  return (
    <div>
      <Header desktopSearch = {handleDebounceDesktop}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
      
      </Header>
     

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange = {(e)=>{debounceSearch(e, debounceTimeout)}}
      />
       <Grid container>
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid>
       </Grid>

          {isLoading ? (
            <Box className = "loading">
              <CircularProgress />
              <h4>Loading Products...</h4>
            </Box>
          ) : (
              <Grid container spacing={2}>
                {filteredProducts.length ? (
                  filteredProducts.map((product)=>(
                    <Grid item xs={6} md = {3} key ={product._id}>
                      <ProductCard
                      product={product}
                      />
                    </Grid>

                  ))
                ):(
                  <Box className = "loading">
                    <SentimentDissatisfied />
                    <h4>No products found</h4>
                  </Box>
                )
              
              }
                </Grid>
              
          )
          
          
          }


      <Footer />
    </div>
  );
};

export default Products;
