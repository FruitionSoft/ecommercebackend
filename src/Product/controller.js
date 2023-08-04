const Products = require('./model');
const mongoose = require('mongoose');

const newProduct = (req, res) => {
    console.log(req.body)
    const productData = new Products(req.body);
    productData.save().then(data => {
        return res.status(201).send({ success: true, message: 'Data saved' });
    }).catch(err => {
        return res.status(500).send({ error: err.message, success: false })
    })
}


const getProductList = async (req, res) => {
    const ProductList = await Products.find({ status: "ACTIVE" }).populate('category')
    .populate("productOwner",'shopName')
    .populate("category", 'name showDimensions showSizeSelection');
    if (!ProductList) {
        res.status(500).send({ success: false })
    } else {
        res.status(201).send({ success: true, message: '', data: ProductList });
    }
}

const getPendingStatusProductList = async (req, res) => {
    const ProductList = await Products.find({ status: "PENDING" }).populate('category');
    if (!ProductList) {
        res.status(500).send({ success: false })
    } else {
        res.status(200).send({ success: true, message: '', data: ProductList });
    }
}

const getRejectedStatusProductList = async (req, res) => {
    const ProductList = await Products.find({ status: "REJECTED" }).populate('category');
    if (!ProductList) {
        res.status(500).send({ success: false })
    } else {
        res.status(200).send({ success: true, message: '', data: ProductList });
    }
}

const getTopPicksData = async (req, res) => {
    let pageNumber = 1;
    let pageSize = Number(req.params.id);
    let skip = (pageNumber - 1) * pageSize;
    await Products.aggregate([
        { "$sample": { "size": pageSize } },
        { "$skip": skip }],
        {status: "ACTIVE"})
        .then(response => {
            return res.status(201).send({ success: true, message: '', data: response });
        }).catch(error => {
            return res.status(500).send({ success: false, message: error.message })
        })
}

const searchProduct = async (req, res) => {
    try {
        const SearchResult = await Products.find({ "$or": [{ name: new RegExp(req.params.id, 'i') }] },{status: "ACTIVE"});
        if (!SearchResult) {
            res.status(500).send({ success: false, message: "No data found." })
        } else {
            res.status(201).send({ success: true, message: '', data: SearchResult });
        }
    } catch (error) {
        res.status(404).send({ success: false, message: "Bad request" })
    }
}

const getProductListByCat = async (req, res) => {
    const ProductList = await Products.find({ category: req.params.id ,status:"ACTIVE"}).populate("productOwner",'shopName')
    .populate("category", 'name showDimensions showSizeSelection');
    if (!ProductList) {
        res.status(500).send({ success: false })
    } else {
        res.status(201).send({ success: true, message: '', data: ProductList ,count: ProductList.length});
    }
}

const getProductListBySeller = async (req, res) => {
    await Products.find({ productOwner: req.params.id }).populate("productOwner",'shopName')
    .populate("category", 'name showDimensions showSizeSelection parentCategory')
        .then(response => {
            return res.status(201).send({ success: true, message: '', data: response,count:response.length });
        }).catch(error => {
            return res.status(500).send({ success: false, error: error.message })
        })
}

const getProductById = async (req, res) => {
    await Products.find({ _id: req.params.id })
    .populate("productOwner",'shopName')
    .populate("category", 'name showDimensions showSizeSelection')
    
        .then(response => {
            return res.status(201).send({ success: true, message: '', data: response[0] });
        }).catch(error => {
            return res.status(500).send({ success: false, error: error.message })
        })
}

const getTodaysList = async (req, res) => {
    const ProductList = await Products.find({ category: req.params.id,status:'ACTIVE' }).limit(10);
    if (!ProductList) {
        res.status(500).send({ success: false })
    } else {
        res.status(201).send({ success: true, message: '', data: ProductList});
    }
}

const getProductAnalytics = async (req, res) => {
    const ProductCount = await Products.countDocuments({ status: "ACTIVE" });
    if (!ProductCount) {
        res.status(500).send({ success: false })
    } else {
        res.status(201).send({ success: true, message: '', total_product: ProductCount });
    }
}

const filterByCategories = async (req, res) => {
    let filterData = {};
    if (req.query.categories) {
        filterData = { category: req.query.categories.split(',') }
    }
    const ProductCount = await Products.find(filterData,{ status: "ACTIVE" });
    if (!ProductCount) {
        res.status(500).send({ success: false })
    } else {
        res.status(201).send({ success: true, message: '', total_product: ProductCount });
    }
}

const editProduct = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(500).send({ error: 'Invalid product id', success: false })
    }
    await Products.findByIdAndUpdate(req.params.id, req.body).then(response => {
        return res.status(201).send({ success: true, message: 'Data updated.' });
    }).catch(err => {
        return res.status(500).send({ error: err, success: false })
    })
    // const body = {
    //     "productOwner": "63ae5a5a7f3a9d3cbcccb048"
    // }
    // await Products.find()
    //     .then(async (response) => {
    //         response.map(async(item) => {
    //             await Products.findByIdAndUpdate(item._id, body).then(response => {
    //                 console.log("success")
    //             }).catch(err => {
    //                 console.log("fail")
    //             })
    //         })
    //         return res.status(201).send({ success: true, message: '', data: "done" });
    //     }).catch(error => {
    //         return res.status(500).send({ success: false, error: error.message })
    //     })
}

const deleteProduct = async (req, res) => {
    await Products.findByIdAndDelete(req.params.id).then(response => {
        if (response) {
            return res.status(201).send({ success: true, message: 'Data deleted.' });
        } else {
            return res.status(404).send({ success: false, message: 'Product not found' });
        }
    }).catch(err => {
        return res.status(500).send({ error: err, success: false })
    })
}

const deleteAllProduct = async (req, res) => {
    await Products.deleteMany({});
}

module.exports = {
    newProduct,
    getProductList,
    deleteProduct,
    editProduct,
    getTodaysList,
    getProductAnalytics,
    filterByCategories,
    getProductById,
    getProductListByCat,
    getTopPicksData,
    searchProduct,
    deleteAllProduct,
    getProductListBySeller,
    getPendingStatusProductList,
    getRejectedStatusProductList
};