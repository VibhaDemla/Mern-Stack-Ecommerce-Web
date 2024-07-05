import React, { Fragment ,useEffect, useState} from 'react'
import "./Product.css";
import { useSelector,useDispatch } from 'react-redux';
import { clearErrors,getProduct } from '../../actions/productAction';
import Loader from '../layout/Loader/Loader';
import ProductCard from '../Home/ProductCard';
import { useParams } from 'react-router-dom';
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import {useAlert} from "react-alert";
import MetaData from '../layout/MetaData';

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "Smartphone",
];

const Products = ({match}) => {       

    const dispatch = useDispatch();
    const alert = useAlert();

    const { keyword } = useParams();  // Extract the 'id' parameter from the URL
    const [currentPage,setCurrentPage] = useState(1);
    const [price,setPrice] = useState([0,1000000]);
    const [category,setCategory] = useState("");
    const [ratings,setRatings] = useState(0)

    const {products,loading,error,productsCount,resultperpage,filteredProductsCount} = useSelector(
        state => state.products
    );

    const setCurrentPageNo =(e)=>{
      setCurrentPage(e)
    }

    const priceHandler = (event,newprice) => {
      setPrice(newprice);
    }
  

    useEffect(() => {
      if(error){
        alert.error(error);
        dispatch(clearErrors());
      }
      console.log("Fetching products for page:", currentPage); 
      dispatch(getProduct(keyword, currentPage, price, category,ratings));
    }, [dispatch, keyword, currentPage, price, category,ratings,alert,error]);

     let count= filteredProductsCount;
    
  return (
    <Fragment>
        {loading ? <Loader/> : 
        <Fragment>

              <MetaData title="PRODUCTS--ECOMMERCE"/>
              <h2 className='productsHeading'>Products</h2>

              <div className='products'>
                {products && products.map((product)=>(
                    <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* filter by price */}
              {keyword && <div className="filterBox">
                  <Typography>Price</Typography>
                  <Slider
                      value={price}
                      onChange={priceHandler}
                      valueLabelDisplay="auto"
                      aria-labelledby="range-slider"
                      min={0}
                      max={1000000}
                  />

                 <Typography>Categories</Typography>
                  <ul className='categoryBox'>
                  {categories.map((category) => (
                    <li
                      className='category-link'
                      key={category}
                      onClick={() => setCategory(category)}
                    >
                      {category}
                    </li>
                  ))}
                </ul> 

                <fieldset>
                  <Typography component="legend">Ratings Above</Typography>
                  <Slider 
                      value={ratings}
                      onChange={(e,newRating) => {
                        setRatings(newRating);
                      }}
                      aria-labelledby="continuous-slider"
                      valueLabelDisplay="auto"
                      min={0}
                      max={5}
                      
                  />
                </fieldset>
              </div>}

              {/* pagination */}
                {resultperpage < count && (
                  <div className='paginationBox'>
                  <Pagination 
                    activePage={currentPage}
                    itemsCountPerPage={resultperpage}
                    totalItemsCount={productsCount}
                    onChange={setCurrentPageNo}
                    nextPageText="Next"
                    prevPageText="Prev"
                    firstPageText="1st"
                    lastPageText="Last"
                    itemClass='page-item'
                    linkClass='page-link'
                    activeClass='pageItemActive'
                    activeLinkClass='pageLinkActive'
                  />
                </div>
                )}
              
        </Fragment>}
    </Fragment>
  )
}

export default Products
