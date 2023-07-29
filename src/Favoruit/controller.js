const { FavData } = require('./model');

const addFav = async(req, res) => {
    try {
        const FavListData = new FavData(req.body);
        await FavListData.save().then(response => {
            return res.status(201).send({success: true, message: 'Data saved.'})
        }).catch(err => {
            return res.status(500).send({success: false, message: '', error: err})
        })
    }catch(e) {
        return res.status(404).send({success: false, message: 'Bad request.'})
    }
}

const FavList = async(req, res) => {
        const FavListData = await FavData.find({userId: req.params.id});
        if(FavListData.length === 0) {
            return res.status(404).send({success: false, message: 'No data found!'})
        }else {
            return res.status(200).send({success: true, message: '', data: FavListData});
        }
}

const FavDetailedList = async(req, res) => {
    try {
    const FavListData = await FavData.find({userId: req.params.id}).populate("itemId");
    if(!FavListData) {
        res.status(404).send({success: false, message: 'No data found!'})
    }else {
        res.status(200).send({success: true, message: '', data: FavListData});
    }
}catch(e) {
    res.status(400).send({success: false, message: 'Bad request.'})
}

}

const deleteFavProduct = async(req, res) => {
    var query = { '_id': req.params.id };
    try {
        if (!req.params.id) {
          res.status(400).send({ success: false, status: 400, error: 'Bad Request', message: 'Need to pass Product id' })
        } else {
            const deleteFav = await FavData.findByIdAndDelete(query);
          res.send({ success: true, status: 200, message: 'Product deleted successfully' })
        }
      } catch (error) {
        res.status(400).send({ success: false, status: res.status, error: 'Bad Request', message: 'Product deletion failed' })
      }
}

module.exports = {
    addFav,
    FavList,
    deleteFavProduct,
    FavDetailedList
}