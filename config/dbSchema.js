const mongoose = require('mongoose')
const validator = require('validator')
//creating a schema with columns
var userSchema = new mongoose.Schema({
  userFirstName: { type: 'string', required: true },
  userLastName: { type: 'string', required: true },
  userEmail: {
    type: 'string',
    required: true,
    lowercase: true,
    validate: (value) => {
      return validator.isEmail(value)
    }
  },
  userMobile: { type: 'string', default: "000-000-0000" },
  userPassword: { type: 'string', required: true },
 
})

var vendorSchema = new mongoose.Schema({
  vendorName: { type: 'string', required: true },
  vendorEmail: {
    type: 'string',
    required: true,
    lowercase: true,
    validate: (value) => {
      return validator.isEmail(value)
    }
  },
  vendorMobile: { type: 'string', default: "000-000-0000" },
  contactPerson: { type: 'string', required: true },
  designation: { type: 'string', required: true },
  country: { type: 'string', required: true },
  state: { type: 'string', required: true },
  city: { type: 'string', required: true },
  pincode: { type: 'string', required: true },
  address: { type: 'string' },
  description: { type: 'string' },
})

var productSchema = new mongoose.Schema({
  productCategory: { type: 'string', required: true },
  productType: { type: 'string', required: true },
  productName: { type: 'string', required: true },
  vendorName: { type: 'string', required: true },
  description: { type: 'string' },
})

var productTypesSchema = new mongoose.Schema({
  product_types: { type: 'string', required: true },
  product_Category:{ type: 'string', required: true },
})

var productCategorySchema = new mongoose.Schema({
  product_category: { type: 'string', required: true },
})

var assetSchema = new mongoose.Schema({
  assetName: { type: 'string', required: true },
  productName: { type: 'string', required: true },
  productType: { type: 'string', required: true },
  productCategory: { type: 'string', required: true },
  vendorName: { type: 'string', required: true },
  serialNumber: { type: 'string', required: true },
  price: { type: 'number', required: true },
  purchaseDate: { type: 'string' },
  expiryDate: { type: 'string' },
  description: { type: 'string' },
  assignedTo: { type: 'string',default:null },
  country: { type: 'string', required: true },
  state: { type: 'string', required: true },
  assetStatus:{type:'string',default:true},
  assetAssignedStatus:{type:'string',default:false}
  })

  var employeeSchema = new mongoose.Schema({
    employeeName: { type: 'string', required: true },
    employeeEmail:  {
      type: 'string',
      required: true,
      lowercase: true,
      validate: (value) => {
        return validator.isEmail(value)
      }
    },
    employeeID: { type: 'string', required: true },
    password: { type: 'string', required: true },
    mobile: { type: 'string', required: true },
    role: { type: 'string', required: true },
    employeeCountry: { type: 'string', required: true },
    employeeState: { type: 'string', required: true },
    employeeManager: { type: 'string' , required: true},
   
   })

   var managerSchema=new mongoose.Schema({
    managerName:{ type: 'string', required: true },
    managerEmail: {
      type: 'string',
      required: true,
      lowercase: true,
      validate: (value) => {
        return validator.isEmail(value)
      }
    },
    managerID:{ type: 'string', required: true },
    managerDepartmentName:{ type: 'string', required: true },
   })

   var departmentSchema=new mongoose.Schema({
    departmentName:{ type: 'string', required: true },
    contactName:{ type: 'string', required: true },
    departmentEmail: {
      type: 'string',
      required: true,
      lowercase: true,
      validate: (value) => {
        return validator.isEmail(value)
      }
    },
    departmentMobile:{ type: 'string', required: true },
    })

    var locationSchema = new mongoose.Schema({
      officeName: { type: 'string', required: true },
      addressLineFirst: { type: 'string', required: true },
      addressLineLast: { type: 'string'},
      locationCountry: { type: 'string', required: true },
      locationState: { type: 'string', required: true },
      locationPincode: { type: 'string', required: true },
      locationContactPerson: { type: 'string', required: true },
      locationContactEmail: {
        type: 'string',
        required: true,
        lowercase: true,
        validate: (value) => {
          return validator.isEmail(value)
        }
      },
      locationContactMobile: { type: 'string', required: true },
      })
    
let userModel = mongoose.model('users', userSchema)      
let vendorModel = mongoose.model('vendors', vendorSchema)  //mongoose.model(collectionName, schema)
let productModel = mongoose.model('products', productSchema)
let productTypeModel = mongoose.model('producttypes', productTypesSchema)
let productCategoryModel = mongoose.model('productcategory', productCategorySchema)
let assetModel = mongoose.model('assets', assetSchema)
let employeeModel = mongoose.model('employees', employeeSchema)
let managerModel = mongoose.model('managers', managerSchema)
let departmentModel = mongoose.model('departments', departmentSchema)
let locationModel = mongoose.model('locations', locationSchema)

module.exports = { userModel,vendorModel, productModel, productTypeModel, productCategoryModel,assetModel,employeeModel,managerModel,departmentModel,locationModel ,mongoose }