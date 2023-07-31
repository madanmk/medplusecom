const express = require("express");
const productModel = require("../models/product");
const cartModel = require("../models/cart");
const router = express.Router();
const formidable = require("formidable");
const fs = require("fs");

//endpoint to read all products
router.get("/", async (req, res) => {
  try {
    let products = await productModel.find().populate('category');
    res.send({ success: true, products });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      message: "Unable to fetch product at the moment",
    });
  }
});

//endpoint to get a single products
router.get("/singleproduct/:product_id/:user_id", async (req, res) => {
  let product_id = req.params.product_id;
  let user_id=req.params.user_id;

    try {
       
        let product = await productModel.findById(product_id).populate('category'); //find({_id:product_id})
        
        cartModel.findOne({product:product_id,user:user_id})
        .then((cartitem)=>{
              
            let presentInCart=false;
            if(cartitem!==null)
            {
                presentInCart=true;
            }

            res.send({success:true,product,presentInCart});
           
          })
        .catch((err)=>{
            console.log(err);
            res.send({success:false,message:"Unable to check product in cart"})
         })

   
    } catch (err) {
      console.log(err);
      res.send({
        success: false,
        message: "Unable to fetch product at the moment",
      });
    }
});

//endpoint to create a product
router.post("/create", async (req, res) => {
  //we create images empty array property in product object to store the FE images which we get in array format.
  let product = {};
  //console.log(req);

  //file uploaded we use formidable to read data in backend.
  const form = new formidable.IncomingForm();

  //for multiple files to fetch from FE we use parse first and later addListener() to get "field" and "file" property values
  //form.parse(req);
    form.parse(req, (err, fields, files) => {
    if (!err) {
      let fileData = fs.readFileSync(files.images.filepath);
      let ext = files.images.originalFilename.split(".")[1].toLowerCase();
      let newPath = null;
      let imagePath = null;
      product = fields;
      product.tags=product.tags.split(',');
      product.images = [];
      console.log("product---> before", product);
      if (
        ext === "jpg" ||
        ext === "jpeg" ||
        ext === "png" ||
        ext === "avif" ||
        ext === "webp"
      ) {
        newPath = "./products/" + files.images.newFilename + "." + ext;
        //path to acess the images in DB server from FE by the user.(internally it goes to products folder)
        imagePath =
          "http://localhost:8000/pro/images/" +
          files.images.newFilename +
          "." +
          ext;
        fs.writeFileSync(newPath, fileData);
        product.images.push(imagePath);
        // console.log("product---> After", product);
        // console.log("in db",product);

        console.log("out db:", product);
      productModel
      .create(product)
      .then((pro) => {
        console.log("in db:", pro);
        res.status(201).send({ success: true, message: "Prod C S" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ success: false, message: "Some P T A" });
      });

      
      } else {
        res.send({ message: "only images are allowed" });
      }
      
      
    }
  });

  



  // for multiple files to fetch from FE
  /*  form.addListener("field",(property,value)=>{

               product[property]=value;
         })

         form.addListener("file",(property,file)=>{

               let fileData=fs.readFileSync(file.filepath);
               let ext=file.originalFilename.split(".")[1].toUpperCase();
               let newPath=null;
               if(ext==="JPG" || ext==="JPEG" || ext==="PNG")
               {
                   newPath="./products/"+file.newFilename+"."+ext;
                   fs.writeFileSync(newPath,fileData);
               }

               product.images.push(newPath);
                
         })

         form.on("end",()=>{
            console.log(product);
            res.send({message:"All Working"});
         })*/

  /*  //only if publish property is true,product is published.
         if(product.publish!==undefined && product.publish===true)
         {
             product.approved=true;
         }

         try{
                await productModel.create(product);  
                res.send({success:true,message:"Product Created"});
         }
         catch(err){
            console.log(err);
            res.send({success:false,message:"Unable to create product"});
         }*/
});

//endpoint to update a product
router.put("/update/:product_id", (req, res) => {
  let product_id = req.params.product_id;
  let data = req.body;

  productModel
    .updateOne({ _id: product_id }, data)
    .then((info) => {
      res.send({ success: true, message: "Product Updated successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "unable to Update Product" });
    });
});

//update images for new upload
router.put("/addnewimage/:id",async (req,res)=>{
      
       //let produc={};
       console.log("req:",req);
       let product_id=req.params.id;
       let product=await productModel.findById(product_id);

       const form=new formidable.IncomingForm();

       form.parse(req,(err,fields,files)=>{

            if(!err)
            {
               console.log(files);
               let fileData = fs.readFileSync(files.image.filepath);
               let ext = files.image.originalFilename.split(".")[1].toLowerCase();
               let newPath = null;
               let imagePath = null;
             //  produc= fields;
             //  produc.tags=produc.tags.split(',');
             //  produc.images = [];
             //  console.log("product---> before", produc);
               if (
                 ext === "jpg" ||
                 ext === "jpeg" ||
                 ext === "png" ||
                 ext === "avif" ||
                 ext === "webp"
               ) {
                 newPath = "./products/" + files.image.newFilename + "." + ext;
                 //path to acess the images in DB server from FE by the user.(internally it goes to products folder)
                 imagePath =
                   "http://localhost:8000/pro/images/" +
                   files.image.newFilename +
                   "." +
                   ext;
                 fs.writeFileSync(newPath, fileData);
                 product.images.push(imagePath);

                 productModel.findByIdAndUpdate(product_id,product)
                 .then((info)=>{
                      res.send({success:true,image:imagePath,message:"Files Update Upload Working"});
                 })
                 .catch((err)=>{
                      console.log(err);
                      res.send({success:false,message:"Some Issue in file Upload"});
                 })
            }
            else
            {
              res.send({success:false,message:"File type is not allowed"});
            }
          }
       })

      

})

//update images to remove a image
router.put("/deleteSinImg/:id",async (req,res)=>{

        let product_id=req.params.id;
        let data=req.body;
        let product=await productModel.findById(product_id);
        //get all images array and find the index of particular img to delete.
        let images=product.images;

        let index=images.findIndex((img,ind)=>{
            return img===data.image;
        })
        

        images.splice(index,1);

        product.images=images;

        productModel.findByIdAndUpdate(product_id,product)
        .then((info)=>{
              
             //to delete image after updating in FE we select only last path of the imagepath.
             let imageSplit=data.image.split("/");
             let imgName=imageSplit[imageSplit.length-1];
             
             fs.unlinkSync("./products/"+imgName);

             res.send({success:true,images:product.images,message:"Files Removed S"});
        })
        .catch((err)=>{
             console.log(err);
             res.send({success:false,message:"Some Issue in file Removed"});
        })

})


//endpoint to delete a product
router.delete("/delete/:product_id", (req, res) => {
  let product_id = req.params.product_id;

  productModel
    .findByIdAndDelete(product_id)
    .then((info) => {
      res.send({ success: true, message: "Product Deleted successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.send({success:false, message: "unable to Delete Product" });
    });
});

//endpoint to get data from cart
router.get("/datafromcart/:user_id",async (req,res)=>{

    let user_id=req.params.user_id;

    let products=await cartModel.find({user:user_id}).populate('product');
   
    res.send({success:true,products});

})


//endpoint to add to cart
router.post("/cart", (req, res) => {
  let data = req.body;

  cartModel
    .create(data)
    .then((info) => {
      res.send({ success: true, message: "Product Added to cart" });
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "unable to Add Product to cart" });
    });
});

//endpoint to remove from cart
router.delete("/cart/:id", (req, res) => {
  let id = req.params.id;
  cartModel
    .findByIdAndDelete(id)
    .then((info) => {
      res.send({ success: true, message: "Product Removed from cart" });
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "unable to Remove Product fromcart" });
    });
});

//endpoint to check if the product is already in cart
router.get("/cart/check/:userid/:productid",(req,res)=>{
   
     let userid=req.params.userid;
     let productid=req.params.productid;
     
     cartModel.findOne({product:productid,user:userid})
     .then((cartitem)=>{
          
         if(cartitem!==undefined)
         {
            res.send({success:true,message:"Product already in cart"});
         }
         else
         {
            res.send({success:false,message:"Product not in cart"});
         }

     })
     .catch((err)=>{
        console.log(err);
        res.send({success:false,message:"Unable to check product in cart"})
     })

})


//endpoint to update products in cart
router.put("/cart/:id", (req, res) => {
  let id = req.params.id;
  let data = req.body;
  cartModel
    .findByIdAndUpdate(id, data)
    .then((info) => {
      res.send({ success: true, message: "Product Updated in cart" });
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "unable to Update  Product in cart" });
    });
});

//endpoint to fetch products for homepage

router.get('/products/homepage',async (req,res)=>{
  
   //products based on tags we selecting.
   let products_1={title:"Medicine",products:[]};
   products_1.products=await productModel.find({tags:"Allergy Relief"}).limit(3);
  
   let products_2={title:"Food",products:[]};
   products_2.products=await productModel.find({tags:"Cat Food"}).limit(3);
   
   res.send({success:true,products_1,products_2});

})

//endpoint to search a product for users
router.get("/products/searchproduct/:searchValue",async (req,res)=>{

  let searchValue=req.params.searchValue;
  //'$regex' is used for half/full match of the value to compare and we use OR opertaion to get the searchValue.
  let products=await productModel.find({$or:[
      {name:{$regex:searchValue,$options:"i"},approved:true},
      {tags:{$regex:searchValue,$options:"i"},approved:true}
  ]}).limit(10);
  
  res.send({success:true,products});

})

module.exports = router;
