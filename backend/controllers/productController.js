const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); 
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

//create product (ADMIN)
exports.createProduct = catchAsyncErrors(async(req,res,next)=>{

    let images=[];

    if(typeof req.body.images === "string"){
        images.push(req.body.images);
    }else{
        images=req.body.images;
    }
     
    const imagesLinks=[];
    for(let i=0; i<images.length; i++){
        const result = await cloudinary.v2.uploader.upload(images[i],{
            folder:"products",
        }); 

        imagesLinks.push({
            public_id:result.public_id,
            url:result.secure_url,
        })
    }


    req.body.images = imagesLinks;
    req.body.user = req.user.id;
    
    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    })
});

//Get all products 
exports.getAllProducts = catchAsyncErrors(async(req,res,next) => {

    // return next (
    //     new ErrorHandler("temp error",500)
    // );
    const resultperpage = 8;
    const productsCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(),req.query)
    .search()
    .filter();
    
    let products = await apiFeature.query;
    let filteredProductsCount = products.length;

    apiFeature.pagination(resultperpage);

     products = await apiFeature.query.clone(); // Use clone to prevent query execution error
    
    res.status(200).json({
        success:true,
        products,
        productsCount,
        resultperpage,
        filteredProductsCount,
    })
    
        
});

//Get all products (ADMIN)
exports.getAdminProducts = catchAsyncErrors(async(req,res,next) => {

    const products = await Product.find();

    res.status(200).json({
        success:true,
        products,
       
    })
    
        
});
//Get single product details
exports.getProductDetails = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    
    //ERROR HANDLING
    if(!product){
        return next(new ErrorHandler("Product not found",404))
        }

        res.status(200).json({
            success:true,
            product
        })
});


//Update product (admin)
exports.updateProduct = catchAsyncErrors(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);

    //ERROR HANDLING
    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }

    //images start here( 1 image hai ya array hai)
    let images=[];

    if(typeof req.body.images === "string"){
        images.push(req.body.images);
    }else{
        images=req.body.images;
    }

    if(images > 0){
        //deleting images from cloudinary(agar images mein kuch hai)

        for (let index = 0; index < product.images.length; index++) {
            await cloudinary.v2.uploader.destroy(product.images[index].public_id)  
     }
    

    const imagesLinks=[];
    for(let i=0; i<images.length; i++){
        const result = await cloudinary.v2.uploader.upload(images[i],{
            folder:"products",
        }); 

        imagesLinks.push({
            public_id:result.public_id,
            url:result.secure_url,
        })
    
    }
     req.body.images = imagesLinks;
    
}


    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        product
    })
});

//Delete product (admin)
exports.deleteProduct = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    //ERROR HANDLING
    if(!product){
        return next(new ErrorHandler("Product not found",404))
        }

    

    //deleting images from cloudinary

    for (let index = 0; index < product.images.length; index++) {
       await cloudinary.v2.uploader.destroy(product.images[index].public_id)
        
    }

    await product.deleteOne();
    res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })
});

//Create New Review or update the review
exports.createProductReview = catchAsyncErrors(async(req,res,next)=>{

    
    const {rating,comment,productId} = req.body;

    if (!productId) {
        return res.status(400).json({
            success: false,
            message: "Product ID is required"
        });
    }
    
    //Object
    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    //check if review already exist with this user
    const isReviewed = product.reviews.find((rev)=> rev.user.toString()=== req.user._id.toString()) 

    if(isReviewed){
        product.reviews.forEach(rev=>{
            if (rev.user.toString()===rev.user.id.toString())
            rev.rating = rating,
            rev.comment = comment
        })

    }
    else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg=0;
     product.reviews.forEach((rev)=>{
        avg += rev.rating;
     })
     console.log(avg);
     product.ratings = avg / product.reviews.length;

     await product.save({validateBeforSave : false});
     res.status(200).json({
        success:true,
        message:"Review added successfully"

       })
});


//Get all reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    
    const product = await Product.findById(req.query.id);   
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });

// Delete review
exports.deleteReview = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId);
  
    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }
  
    const reviews = product.reviews.filter(
        (rev)=>rev._id.toString()!==req.query.id.toString()
    )
  
    let avg=0;
     reviews.forEach((rev)=>{
        avg += rev.rating;
     })
     
     let ratings = 0;

     if (reviews.length === 0) {
       ratings = 0;
     } else {
       ratings = avg / reviews.length;
     }
  
     const numOfReviews = reviews.length;
  
     await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
     },
    {
        new:true,
        runValidators:true,
        useFindAndModify: false,
    });
  
        res.status(200).json({
            success:true,
            
        })
  })