var express = require('express');
var router = express.Router();

const { dbName, dbUrl, mongodb } = require('../config/dbConfig')
const {userModel,vendorModel,productModel,vendorNameModel,productTypeModel,productCategoryModel,assetModel,employeeModel,managerModel,departmentModel,locationModel,mongoose} = require('../config/dbSchema')

const {hashPassword,hashCompare}=require('../config/auth')
mongoose.connect(dbUrl)
//VENDORS 
// add vendor
//register user
router.post('/signup',async(req,res)=>{
  try{
    let users=await userModel.findOne({userEmail:req.body.userEmail})
    if(users){   
    res.send({
    statusCode:400,
    message:"Email Id already Exists",
    
    })
   }else{
   let hashedPassword =await hashPassword(req.body.userPassword)
   req.body.userPassword=hashedPassword
   let users=await userModel.create(req.body)
    res.send({
    statusCode:200,
    message:"user added successfully",
    
    })
  }
  }catch(err){
    res.send({
      statusCode:500,
      message:"All Fields Are Required"
    })
  }
})
//login
router.post('/login',async(req,res)=>{
  try{
    let users=await userModel.findOne({userEmail:req.body.userEmail})
    if(users){ 
     const compare= hashCompare(req.body.userPassword,users.userPassword)   
     if(compare){
    res.send({
     statusCode:200,
     message:"User Login successful"
     })
    }else{
    res.send({
     statusCode:400,
     message:"Password didn't match"
     })
    }
    }else{
     res.send({
     statusCode:400,
     message:"User doesn't exist"
     })
    }
    
    
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//forgot password
router.put('/forgot-passm/:email',async(req,res)=>{
  try{
    let users=await userModel.findOne({userEmail:req.params.email})
    if(users){
      if(req.body.userPassword==req.body.userConfirmPassword){
        let hashedPassword =await hashPassword(req.body.userPassword)
       let password=await userModel.updateOne({userEmail:req.params.email},{$set:{userPassword:hashedPassword}})
        res.send({
          statusCode:200,
          message:"password Updated successfully"
        })
      }else{
        res.send({
          statusCode:400,
          message:"Password mismatch"
        })
      }
    }else{
      res.send({
        statusCode:400,
        message:"User not exist"
      })
    }

  }catch(err){
    res.send({
      statusCode:500,
      message:"Internal Server Error"
    })
  }
})
//get user details by email
router.post('/get-users/:id',async(req,res)=>{
  try{
  let users=await userModel.findOne({userEmail:req.params.id})
  if(users){
  res.send({
    statusCode:200,
    message:"User details fetched successfully",
    users
  })
  }else{
    res.send({
      statusCode:400,
      message:"Provided email not find"
    })
  }
  }catch(err){
    res.send({
      statusCode:500,
      message:"Internal server error"
    })
  }
})

//add vendor
router.post('/add-vendor',async(req,res)=>{
  try{
  let addvendor= await vendorModel.create(req.body);
  res.send({
    statusCode:200,
    message:"Vendor Added Successfully"
  })
  }catch(err){
    res.send({
      statusCode:500,
      message:"Required Field Shouldn't Be Empty"
    })
  }
})
//get vendors
router.get('/get-vendor', async (req, res) => {
  try {
    let vendors = await vendorModel.find();
    res.send({
      statusCode: 200,
      message: "Vendors fetched successfully",
      vendors
    })
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get vendors count
router.get('/get-vendor-count', async (req, res) => {
  try {
    let vendors = await vendorModel.find().count();
    res.send({
      statusCode: 200,
      message: "Vendors fetched successfully",
      vendors
    })
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//edit vendor
router.put('/edit-vendor/:id', async (req, res) => {
  try {
    let editvendor = await vendorModel.findOne({ _id: mongodb.ObjectId(req.params.id) });
    if (editvendor) {
      let editedvendor = await vendorModel.updateOne({_id: mongodb.ObjectId(req.params.id) }, {
        $set: {
          vendorName:req.body.vendorName,
          vendorEmail:req.body.vendorEmail,
          vendorMobile:req.body.vendorMobile,
          contactPerson:req.body.contactPerson,
          designation: req.body.designation,
          country:req.body.country,
          state:req.body.state,
          city:req.body.city,
          pincode:req.body.pincode,
          address:req.body.address,
          description: req.body.description,
        }
      })
      res.send({
        statusCode: 200,
        message: "Vendor Edited Successfully"
      })
    }
    else {
      res.send({
        statusCode: 400,
        message: "Provided Id not found"
      })
    }
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//delete vendor
router.delete('/delete-vendor/:id', async (req, res) => {
  try {
    let editvendor = await vendorModel.deleteOne({ _id: mongodb.ObjectId(req.params.id) });
    res.send({
      statusCode: 200,
      message: "Vendor deleted successfully"
    })
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get array of vendor names
router.get('/get-vendor-names',async(req,res)=>{
  try{
    let vendors=await vendorModel.find({})
    let vendorNames=[]
       vendors.map((e)=>{
        vendorNames.push(e.vendorName)
    })
   res.send({
    statusCode:200,
    message:"Vendor Name Fetched successfully",
    vendorNames
  })
  }catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get vendor by id
router.get('/get-vendor-by-id/:id', async (req, res) => {
  try {
    let vendor = await vendorModel.findOne({_id:mongodb.ObjectId(req.params.id)});
   if(vendor){
    res.send({
      statusCode:200,
      message:"Vendor by id fetched successfully",
      vendor
    })
   }else{
    res.send({
      statusCode:400,
      message:"Provided Id not found"
    })
   }
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})


//PRODUCTS
//add product
router.post('/add-product', async (req, res) => {
  try {
    let addproduct = await productModel.create(req.body)
    res.send({
      statusCode: 200,
      message: "Product Added successfully",
    })
  } catch (error) {
    console.log("error")
    res.send({
      statusCode: 500,
      message: "Required Fields Shouldn't Be Empty",
    })
  }
})
//get product
router.get('/get-products', async (req, res) => {
  try {
    let products = await productModel.find();
    res.send({
      statusCode: 200,
      message: "Products fetched successfully",
      products
    })
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get products count
router.get('/get-products-count', async (req, res) => {
  try {
    let products = await productModel.find().count();
    res.send({
      statusCode: 200,
      message: "Products fetched successfully",
      products
    })
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get product by id
router.get('/get-product-by-id/:id', async (req, res) => {
  try {
    let product = await productModel.findOne({_id:req.params.id});
    if(product){
      res.send({
        statusCode: 200,
        message: "Product by id fetched successfully",
        product
      })
    }else{
      res.send({
        statusCode: 400,
        message: "Provided id not found",
        products
      })
    }
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//edit product
router.put('/edit-product/:id', async (req, res) => {
  try {
    let editproduct = await productModel.findOne({ _id: mongodb.ObjectId(req.params.id) });
    if (editproduct) {
      let editedproduct = await productModel.updateOne({_id: mongodb.ObjectId(req.params.id) }, {
        $set: {
          productName:req.body.productName,
          productType:req.body.productType,
          productCategory:req.body.productCategory,
          vendorName:req.body.vendorName,
          description: req.body.description,
         
        }
      })
      res.send({
        statusCode: 200,
        message: "product Edited Successfully"
      })
    }
    else {
      res.send({
        statusCode: 400,
        message: "Provided Id not found"
      })
    }
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//delete product
router.delete('/delete-product/:id', async (req, res) => {
  try {
    let editproduct = await productModel.deleteOne({ _id: mongodb.ObjectId(req.params.id) });
    res.send({
      statusCode: 200,
      message: "Product deleted successfully"
    })
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//add product Categories
router.post('/add-product-category',async(req,res)=>{
  try{
    let productCategories=await productCategoryModel.create(req.body);
    res.send({
      statusCode: 200,
      message: "Product Category Added successfully"
    })
  }catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get product Categories
router.get('/get-product-category',async(req,res)=>{
  try{
    let getProductCategories=await productCategoryModel.find();
    res.send({
      statusCode: 200,
      message: "Product Categories Fetched successfully",
      getProductCategories
    })
  }catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get product category array
router.get('/get-product-category-array',async(req,res)=>{
  try{
    let vendors=await productCategoryModel.find({})
    let productCatNames=[]
       vendors.map((e)=>{
        productCatNames.push(e.product_category)
    })
   res.send({
    statusCode:200,
    message:"Product Category Array Fetched successfully",
    productCatNames
  })
  }catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get product based on product type
router.get('/get-product-by-type/:type', async (req, res) => {
  try {
    let departments= await productModel.find({"productType":req.params.type});
    res.send({
      statusCode: 200,
      message: "product based on type fetched successfully",
      departments
    })
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//ASSETS
//add asset
router.post('/add-asset',async(req,res)=>{
  try{
    let assets=await assetModel.create(req.body);
    res.send({
      statusCode: 200,
      message: "Assets Added successfully"
    })
  }catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get asset
router.get('/get-assets', async (req, res) => {
  try {
    let assets = await assetModel.find();
    res.send({
      statusCode: 200,
      message: "Assets fetched successfully",
      assets
    })
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get asset by id
router.get('/get-asset-by-id/:id', async (req, res) => {
  try {
    let assets = await assetModel.findOne({_id:mongodb.ObjectId(req.params.id)});
   if(assets){
    res.send({
      statusCode:200,
      message:"asset by id fetched successfully",
      assets
    })
   }else{
    res.send({
      statusCode:400,
      message:"Provided Id not found"
    })
   }
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//edit asset
router.put('/edit-asset/:id', async (req, res) => {
  try {
    let editasset = await assetModel.findOne({ _id: mongodb.ObjectId(req.params.id) });
    if (editasset) {
      let editedasset = await assetModel.updateOne({_id: mongodb.ObjectId(req.params.id) }, {
        $set: {
          assetName:req.body.assetName,
          productName:req.body.productName,
          productType:req.body.productType,
          productCategory:req.body.productCategory,
          vendorName:req.body.vendorName,
          serialNumber: req.body.serialNumber,
          price:req.body.price,
          purchaseDate:req.body.purchaseDate,
          expiryDate:req.body.expiryDate,
          description: req.body.description,
          assignedTo: req.body.assignedTo,
          country:req.body.country,
          state:req.body.state
        }
      })
      res.send({
        statusCode: 200,
        message: "Asset Edited Successfully"
      })
    }
    else {
      res.send({
        statusCode: 400,
        message: "Provided Id not found"
      })
    }
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//delete-asset
router.delete('/delete-asset/:id', async (req, res) => {
  try {
    let deleteasset = await assetModel.deleteOne({ _id: mongodb.ObjectId(req.params.id) });
    res.send({
      statusCode: 200,
      message: "Asset deleted successfully"
    })
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})


//get assets whose asset status is true
router.get('/get-all-assets',async(req,res)=>{
  try{
  let users=await assetModel.find({assetStatus:true})
  if(users){
   res.send({
     statusCode:200,
     message:"deleted assets fetched successfully",
     users
   })
  }else{
   res.send({
     statusCode:400,
     message:"No deleted assets"
   })
  }
  }catch(error){
   res.send({
     statusCode:500,
     message:"Internal server error"
   })
  }
 })
//delete asset by changing asset status
router.put('/delete-asset/:id', async (req, res) => {
  try {
    let editasset = await assetModel.findOne({ _id: mongodb.ObjectId(req.params.id) });
    if (editasset) {
      let editedasset = await assetModel.updateOne({_id: mongodb.ObjectId(req.params.id) }, {
        $set: {
         assetStatus:false
        }
      })
      res.send({
        statusCode: 200,
        message: "Asset deleted Successfully"
      })
    }
    else {
      res.send({
        statusCode: 400,
        message: "Provided Id not found"
      })
    }
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get deleted assets
router.get('/get-deleted-assets',async(req,res)=>{
 try{
 let users=await assetModel.find({assetStatus:false})
 if(users){
  res.send({
    statusCode:200,
    message:"deleted assets fetched successfully",
    users
  })
 }else{
  res.send({
    statusCode:400,
    message:"No deleted assets"
  })
 }
 }catch(error){
  res.send({
    statusCode:500,
    message:"Internal server error"
  })
 }
})
//undo deleted asset by changing asset status
router.put('/undo-asset/:id', async (req, res) => {
  try {
    let editasset = await assetModel.findOne({ _id: mongodb.ObjectId(req.params.id) });
    if (editasset) {
      let editedasset = await assetModel.updateOne({_id: mongodb.ObjectId(req.params.id) }, {
        $set: {
         assetStatus:true
        }
      })
      res.send({
        statusCode: 200,
        message: "Undo Successfully"
      })
    }
    else {
      res.send({
        statusCode: 400,
        message: "Provided Id not found"
      })
    }
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})



//get assigned assets
router.get('/get-assigned-assets', async (req, res) => {
  try {
    let assignedassets = await assetModel.find({assignedTo: {$ne:null}});
  //  let assignedassets=await assetModel.find({'as'})
    res.send({
      statusCode: 200,
      message: "Assets fetched successfully",
      assignedassets
    })
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})

//Assign & Re-Assign assets
router.put('/re-assign-asset/:id', async (req, res) => {
  try {
    let editasset = await assetModel.findOne({ _id: mongodb.ObjectId(req.params.id) });
    if (editasset) {
      let editedasset = await assetModel.updateOne({_id: mongodb.ObjectId(req.params.id) }, {
        $set: {
          assignedTo: req.body.assignedTo,
        }
      })
      res.send({
        statusCode: 200,
        message: "Asset Re-Assigned Successfully"
      })
    }
    else {
      res.send({
        statusCode: 400,
        message: "Provided Id not found"
      })
    }
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get assets count
router.get('/get-assets-count', async (req, res) => {
  try {
    let assets = await assetModel.find().count();
    res.send({
      statusCode: 200,
      message: "Assets fetched successfully",
      assets
    })
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get assigned assets count
router.get('/get-assigned-assets-count', async (req, res) => {
  try {
    let assignedassets = await assetModel.find({assignedTo: {$ne:null}}).count();
  //  let assignedassets=await assetModel.find({'as'})
    res.send({
      statusCode: 200,
      message: "Assets fetched successfully",
      assignedassets
    })
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get unassigned assets count
router.get('/get-unassigned-assets-count', async (req, res) => {
  try {
    let unassignedassets = await assetModel.find({assignedTo: {$eq:null}}).count();
  //  let assignedassets=await assetModel.find({'as'})
    res.send({
      statusCode: 200,
      message: "Assets fetched successfully",
      unassignedassets
    })
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get assets total price
router.get('/get-assets-price', async (req, res) => {
  try {
    let assets = await assetModel.aggregate([ {
      $group: {
         _id: null,
          "TotalPrice": {
             $sum: "$price"
          }
      }
    } ] );
    res.send({
      statusCode: 200,
      message: "Assets fetched successfully",
      assets
    })
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//EMPLOYEES
//add employee

router.post('/add-employee',async(req,res)=>{
  try{
    let employees=await employeeModel.create(req.body);
    res.send({
      statusCode: 200,
      message: "Employees Added successfully"
    })
  }catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get employee
router.get('/get-employee', async (req, res) => {
  try {
    let employees = await employeeModel.find();
    res.send({
      statusCode: 200,
      message: "Employees fetched successfully",
      employees
    })
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get employees count
router.get('/get-employee-count', async (req, res) => {
  try {
    let employees = await employeeModel.find().count();
    res.send({
      statusCode: 200,
      message: "Employees fetched successfully",
      employees
    })
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//edit employee
router.put('/edit-employee/:id', async (req, res) => {
  try {
    let editemployee = await employeeModel.findOne({ _id: mongodb.ObjectId(req.params.id) });
    if (editemployee) {
      let editedemployee = await employeeModel.updateOne({_id: mongodb.ObjectId(req.params.id) }, {
        $set: {
          employeeName:req.body.employeeName,
          employeeEmail:req.body.employeeEmail,
          employeeID:req.body.employeeID,
          password:req.body.password,
          mobile: req.body.mobile,
          role:req.body.role,
          employeeCountry:req.body.employeeCountry,
          employeeState:req.body.employeeState,
          employeeManager:req.body.employeeManager
          
        }
      })
      res.send({
        statusCode: 200,
        message: "Employee Edited Successfully"
      })
    }
    else {
      res.send({
        statusCode: 400,
        message: "Provided Id not found"
      })
    }
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//delete employee
router.delete('/delete-employee/:id', async (req, res) => {
  try {
    let editvendor = await employeeModel.deleteOne({ _id: mongodb.ObjectId(req.params.id) });
    res.send({
      statusCode: 200,
      message: "Employee deleted successfully"
    })
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get employee based on asset location(state) --need to be tested
router.get('/get-employee-by-state/:state', async (req, res) => {
  try {
    let departments= await employeeModel.find({employeeState:req.params.state});
    
    if(departments){
      let employeeNames=[]
    departments.map((e)=>{
      employeeNames.push(e.employeeName)
    })
    res.send({
      statusCode: 200,
      message: "Employees based on state fetched successfully",
      employeeNames
    })
  }else{
    res.send({
      statusCode:400,
      message:"No employees for provided state"
    })
  }
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get employee by id
router.get('/get-employee-by-id/:id', async (req, res) => {
  try {
    let employee = await employeeModel.findOne({_id:mongodb.ObjectId(req.params.id)});
   if(employee){
    res.send({
      statusCode:200,
      message:"employee by id fetched successfully",
      employee
    })
   }else{
    res.send({
      statusCode:400,
      message:"Provided Id not found"
    })
   }
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get employee name array based on state
router.get('/get-employees-names',async(req,res)=>{
  try{
    let employees=await employeeModel.find({})
    let employeeNames=[]
    employees.map((e)=>{
      employeeNames.push(e.employeeName)
    })
   res.send({
    statusCode:200,
    message:"employee Name Fetched successfully",
    employeeNames
  })
  }catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//MANAGER
//add manager
router.post('/add-manager', async (req, res) => {
  try {
    let addmanager = await managerModel.create(req.body)
    res.send({
      statusCode: 200,
      message: "Manager Added successfully",
    })
  } catch (error) {
    console.log("error")
    res.send({
      statusCode: 500,
      message: " Internal server error",
    })
  }
})
//get manager
router.get('/get-managers', async (req, res) => {
  try {
    let managers = await managerModel.find();
    res.send({
      statusCode: 200,
      message: "managers fetched successfully",
      managers
    })
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//edit manager
router.put('/edit-manager/:id', async (req, res) => {
  try {
    let editmanager = await managerModel.findOne({ _id: mongodb.ObjectId(req.params.id) });
    if (editmanager) {
      let editedemployee = await managerModel.updateOne({_id: mongodb.ObjectId(req.params.id) }, {
        $set: {
          managerName:req.body.managerName,
          managerEmail:req.body.managerEmail,
          managerID:req.body.managerID,
          managerDepartmentName:req.body.managerDepartmentName,
          }
      })
      res.send({
        statusCode: 200,
        message: "Manager Edited Successfully"
      })
    }
    else {
      res.send({
        statusCode: 400,
        message: "Provided Id not found"
      })
    }
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//delete manager
router.delete('/delete-manager/:id', async (req, res) => {
  try {
    let editmanager = await managerModel.deleteOne({ _id: mongodb.ObjectId(req.params.id) });
    res.send({
      statusCode: 200,
      message: "manager deleted successfully"
    })
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get manager by id
router.get('/get-manager-by-id/:id', async (req, res) => {
  try {
    let manager = await managerModel.findOne({_id:mongodb.ObjectId(req.params.id)});
   if(manager){
    res.send({
      statusCode:200,
      message:"manager by id fetched successfully",
      manager
    })
   }else{
    res.send({
      statusCode:400,
      message:"Provided Id not found"
    })
   }
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get array of manager namses
router.get('/get-manager-names',async(req,res)=>{
  try{
    let managers=await managerModel.find({})
    let managerNames=[]
    managers.map((e)=>{
      managerNames.push(e.managerName)
    })
   res.send({
    statusCode:200,
    message:"manager Name Fetched successfully",
    managerNames
  })
  }catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//Department
//add department
router.post('/add-department', async (req, res) => {
  try {
    let adddepartment= await departmentModel.create(req.body)
    res.send({
      statusCode: 200,
      message: "department Added successfully",
    })
  } catch (error) {
    console.log("error")
    res.send({
      statusCode: 500,
      message: " Internal server error",
    })
  }
})
//get department
router.get('/get-departments', async (req, res) => {
  try {
    let departments= await departmentModel.find();
    res.send({
      statusCode: 200,
      message: "departments fetched successfully",
      departments
    })
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//edit department
router.put('/edit-department/:id', async (req, res) => {
  try {
    let editmanager = await departmentModel.findOne({ _id: mongodb.ObjectId(req.params.id) });
    if (editmanager) {
      let editedemployee = await departmentModel.updateOne({_id: mongodb.ObjectId(req.params.id) }, {
        $set: {
          departmentName:req.body.departmentName,
          departmentEmail:req.body.departmentEmail,
          departmentMobile:req.body.departmentMobile,
          contactName:req.body.contactName,
          }
      })
      res.send({
        statusCode: 200,
        message: "department Edited Successfully"
      })
    }
    else {
      res.send({
        statusCode: 400,
        message: "Provided Id not found"
      })
    }
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//delete department
router.delete('/delete-department/:id', async (req, res) => {
  try {
    let editdepartment = await departmentModel.deleteOne({ _id: mongodb.ObjectId(req.params.id) });
    res.send({
      statusCode: 200,
      message: "department deleted successfully"
    })
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get department by id
router.get('/get-department-by-id/:id', async (req, res) => {
  try {
    let department = await departmentModel.findOne({_id:mongodb.ObjectId(req.params.id)});
   if(department){
    res.send({
      statusCode:200,
      message:"department by id fetched successfully",
      department
    })
   }else{
    res.send({
      statusCode:400,
      message:"Provided Id not found"
    })
   }
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get array of department names
router.get('/get-department-names',async(req,res)=>{
  try{
    let departments=await departmentModel.find({})
    let departmentNames=[]
    departments.map((e)=>{
      departmentNames.push(e.departmentName)
    })
   res.send({
    statusCode:200,
    message:"Vendor Name Fetched successfully",
    departmentNames
  })
  }catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//PRODUCT TYPE
//add producttype
router.post('/add-product-type', async (req, res) => {
  try {
    let adddepartment= await productTypeModel.create(req.body)
    res.send({
      statusCode: 200,
      message: "product type Added successfully",
    })
  } catch (error) {
    console.log("error")
    res.send({
      statusCode: 500,
      message: " Internal server error",
    })
  }
})
//get producttype
router.get('/get-product-types', async (req, res) => {
  try {
    let productTypes= await productTypeModel.find();
    res.send({
      statusCode: 200,
      message: "product types fetched successfully",
      productTypes
    })
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//edit producttype
router.put('/edit-product-type/:id', async (req, res) => {
  try {
    let editmanager = await productTypeModel.findOne({ _id: mongodb.ObjectId(req.params.id) });
    if (editmanager) {
      let editedemployee = await productTypeModel.updateOne({_id: mongodb.ObjectId(req.params.id) }, {
        $set: {
          product_types:req.body.product_types,
          product_Category:req.body.product_Category
         
          }
      })
      res.send({
        statusCode: 200,
        message: "producttype Edited Successfully"
      })
    }
    else {
      res.send({
        statusCode: 400,
        message: "Provided Id not found"
      })
    }
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//delete producttype
router.delete('/delete-product-type/:id', async (req, res) => {
  try {
    let editdepartment = await productTypeModel.deleteOne({ _id: mongodb.ObjectId(req.params.id) });
    res.send({
      statusCode: 200,
      message: "product type deleted successfully"
    })
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
router.get('/get-product-type-by-id/:id', async (req, res) => {
  try {
    let product = await productTypeModel.findOne({_id:mongodb.ObjectId(req.params.id)});
   if(product){
    res.send({
      statusCode:200,
      message:"product by id fetched successfully",
      product
    })
   }else{
    res.send({
      statusCode:400,
      message:"Provided Id not found"
    })
   }
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get product types based on product category
   
router.get('/get-product-type-by-category/:categ-array', async (req, res) => {
  try {
    let departments= await employeeModel.find({product_Category:req.params.category});
    
    if(departments){
      let productTypeNames=[]
    departments.map((e)=>{
      productTypeNames.push(e.product_types)
    })
    res.send({
      statusCode: 200,
      message: "product types based on category fetched successfully",
      productTypeNames
    })
  }else{
    res.send({
      statusCode:400,
      message:"No product types for provided pcategory"
    })
  }
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})


//get product types arraybased on product category
router.get('/get-product-type-by-categ-array/:category',async(req,res)=>{
  try{
    let vendors=await productTypeModel.find({"productCategory":req.params.category})
    let productTypeNames=[]
       vendors.map((e)=>{
        productTypeNames.push(e.product_types)
    })
   res.send({
    statusCode:200,
    message:"Product Type Array Fetched successfully",
    productTypeNames
  })
  }catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})

//LOCATION
// add Location
router.post('/add-location', async (req, res) => {
  try {
    let addvendor = await locationModel.create(req.body)
    res.send({
      statusCode: 200,
      message: "Location Added successfully",
    })
  } catch (error) {
    console.log("error")
    res.send({
      statusCode: 500,
      message: " Internal server error",
    })
  }
})
//get locations
router.get('/get-locations', async (req, res) => {
  try {
    let locations = await locationModel.find();
    res.send({
      statusCode: 200,
      message: "locations fetched successfully",
      locations
    })
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get location count
router.get('/get-locations-count', async (req, res) => {
  try {
    let locations = await locationModel.find().count();
    res.send({
      statusCode: 200,
      message: "locations fetched successfully",
      locations
    })
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//edit location
router.put('/edit-location/:id', async (req, res) => {
  try {
    let editvendor = await locationModel.findOne({ _id: mongodb.ObjectId(req.params.id) });
    if (editvendor) {
      let editedvendor = await locationModel.updateOne({_id: mongodb.ObjectId(req.params.id) }, {
        $set: {
          officeName:req.body.officeName,
          addressLineFirst:req.body.addressLineFirst,
          addressLineLast:req.body.addressLineLast,
          locationCountry:req.body.country,
          locationState:req.body.state,
          locationPincode:req.body.pincode,
          locationContactPerson:req.body.contactPerson,
          locationContactEmail:req.body.contactEmail,
          locationContactMobile:req.body.contactMobile,
        }
      })
      res.send({
        statusCode: 200,
        message: "Location Edited Successfully"
      })
    }
    else {
      res.send({
        statusCode: 400,
        message: "Provided Id not found"
      })
    }
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//delete location
router.delete('/delete-location/:id', async (req, res) => {
  try {
    let editvendor = await locationModel.deleteOne({ _id: mongodb.ObjectId(req.params.id) });
    res.send({
      statusCode: 200,
      message: "Location deleted successfully"
    })
  } catch (error) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})
//get location by id
router.get('/get-location-by-id/:id', async (req, res) => {
  try {
    let  location= await locationModel.findOne({_id:mongodb.ObjectId(req.params.id)});
   if(location){
    res.send({
      statusCode:200,
      message:"location by id fetched successfully",
      location
    })
   }else{
    res.send({
      statusCode:400,
      message:"Provided Id not found"
    })
   }
  } catch (err) {
    res.send({
      statusCode: 500,
      message: "Internal Server Error"
    })
  }
})

//NEW

//get product types array based on product category
router.get('/get-prodtype-by-category/:categ',async(req,res)=>{
  try{
    let productcat=await productTypeModel.find({product_Category:req.params.categ})
    let productTypes=[]
    if(productcat){
      productcat.map((e)=>{
        productTypes.push(e.product_types)
      })
      res.send({
        statusCode:200,
        message:"Product types fetched successfully",
       
        productTypes
      })
    }else{
      res.send({
        statusCode:400,
        message:"Provided category not found"
      })
    }

  }catch(err){
    res.send({
      statusCode:500,
      message:"Internal Server Eror"
    })
  }
})

//change asset status
router.put('/change-asset-status/:id',async(req,res)=>{
  try{
   let asset=await assetModel.findOne({_id:req.params.id})
   if(asset){
   let assets=await assetModel.updateOne({_id:req.params.id},{$set:{assetAssignedStatus:true}})
   res.send({
    statusCode:200,
    message:"Asset assigned status set to true"
  })
   }else{
    res.send({
      statusCode:400,
      message:"Provided ID not found"
    })
   }
  }catch(err){
    res.send({
      statusCode:500,
      message:"Internal Server Error"
    })
  }
})
//add assets -include location
//fetch assets based on location
module.exports = router;
