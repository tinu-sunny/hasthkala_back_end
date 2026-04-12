const users = require('../Models/UserModel.js');
const products = require('../Models/ProductModel.js');


exports.adminAccess=async(req, res) => {
    res.status(200).json({ message: "Welcome Admin" });
  }


exports.adminAllCustomerView = async (req, res) => {
  try {
    // get all users except admin
    const allUsers = await users.find({ role: { $ne: "admin" } });

    res.status(200).json({
      message: "All users data",
      users: allUsers
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
      err
    });
  }
};


exports.addnewProduct = async(req,res)=>{
  console.log("req body",req.body);
  try{
    const {name,description,price,category,stock,sku,draftId}= req.body

    if(draftId){
      const findproduct = await products.findOne({_id:draftId, isDraft: true}) 
      if(findproduct) {
        const existingproduct = await products.findOne({sku, isDraft: false})
        if(existingproduct){
          res.status(409).json({ success: false,
            error: "DUPLICATE_SKU",
            message: `Product with SKU ${sku} already exists`})
        } else {
          const updateproduct = await products.findOneAndUpdate({_id:draftId, isDraft: true}, { $set: { name, description, price, category, stock, sku, isDraft: false } }, { returnDocument: 'after' } )
          res.status(200).json({
            message: "Product added successfully",
            data: updateproduct
          });
        }
      } else {
        res.status(404).json({ message: "Draft not found" });
      }
    } else {
      const existingproduct = await products.findOne({sku, isDraft: false})
      if(existingproduct){
        res.status(409).json({ success: false,
          error: "DUPLICATE_SKU",
          message: `Product with SKU ${sku} already exists`})
      } else {
        const newproduct= new products({
          name, description, price, category, stock, sku, isDraft: false
        });
        await newproduct.save();
        res.status(200).json({ success: true,
          message: "Product added successfully"
        })
      }
    }
  }
  catch(err){
    console.log(err);
    res.status(500).json({message:"server error", err})
  }
}



exports.savedraft = async(req,res)=>{
  try{
    
    const {name, description, price, category, stock, sku,draftId} = req.body;
    
    let draft = await products.findOne({ _id:draftId, isDraft: true });
    
    if (draft) {
      // Update existing draft
      draft.name = name !== undefined ? name : draft.name;
      draft.description = description !== undefined ? description : draft.description;
      draft.price = price !== undefined ? price : draft.price;
      draft.category = category !== undefined ? category : draft.category;
      draft.stock = stock !== undefined ? stock : draft.stock;
      draft.sku = sku !== undefined && sku.trim() !== '' ? sku : draft.sku;
      await draft.save();
      res.status(200).json({ success: true, message: "Draft updated successfully",updatedraft:draft });
    } else {
      // Create new draft
      const newDraft = new products({
      
        isDraft: true,
        name,
        description,
        price,
        category,
        stock,
        sku: sku && sku.trim() !== '' ? sku : null
      });
      await newDraft.save();
      res.status(200).json({ success: true, message: "Draft saved successfully",draftdara:newDraft });
    }
  }
  catch(err){
    console.log(err);
    res.status(500).json({message:"server error"})
  }
}

exports.updateProduct = async(req,res)=>{
  try{
    const {productId, name, description, price, category, stock, sku} = req.body;

    const product = await products.findOne({_id: productId, isDraft: false});
    if(!product){
      return res.status(404).json({ message: "Product not found" });
    }

    // Check for SKU conflict if SKU is being updated
    if(sku && sku !== product.sku){
      const existingProduct = await products.findOne({sku, isDraft: false, _id: { $ne: productId }});
      if(existingProduct){
        return res.status(409).json({ success: false, error: "DUPLICATE_SKU", message: `Product with SKU ${sku} already exists` });
      }
    }

    // Update fields
    if(name !== undefined) product.name = name;
    if(description !== undefined) product.description = description;
    if(price !== undefined) product.price = price;
    if(category !== undefined) product.category = category;
    if(stock !== undefined) product.stock = stock;
    if(sku !== undefined) product.sku = sku;

    await product.save();

    res.status(200).json({ success: true, message: "Product updated successfully", data: product });
  }
  catch(err){
    console.log(err);
    res.status(500).json({message:"server error", err})
  }
}

exports.deleteDraft = async(req,res)=>{
  try{

    const {draftId}=req.body
    if(draftId){
      const removeproductdata = await products.findOneAndDelete({_id:draftId, isDraft: true })
      res.status(200).json({success:true,message:"Draft cleared successfully"})
    }

  }
  catch(err){
    console.log(err);
    res.status(500).json({message:"server error"})
    
  }
}

exports.viewproductsadmin = async (req, res) => {
  try {
    const allproducts = await products.find({isDraft:false}).sort({ _id: -1 });;

    res.status(200).json({
      message: "All products fetched successfully",
      allproducts: allproducts
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching products",
      error: err.message
    });
  }
};

exports.deleteProduct = async(req,res)=>{
  try{
 const {id}=req.body

 const deleteproduct = await products.findByIdAndDelete({_id:id})
 res.status(200).json({message:"data delete from the db ...."})
  }
  catch(err){
    console.log("deleteing error",err);
    res.status(500).json({message:"error in deleteing data"})
    
  }
}


exports.viewproductbyid = async(req,res)=>{

  const {id}= req.params
  try{
   const product = await products.findById(id);
     if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      product,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }

}
