const History = require('../models/history.model');

exports.create = async function(req, res){
    let obj = req.body;
    if(obj.thietbi_id===undefined || obj.thietbi_id===null || obj.thietbi_id===''){
        res.status(500).send({
            message: "error"
        })
    }else{
        let history = new History(req.body);
        history.save(function(err){
            if(err){
                return next(err);
            }
            res.send('Create successfully');
        })
    }
    
}

exports.findAll = async function(req, res){
    History.find({}).sort({time:-1}).exec(function(err, results){
        res.send(results);
    });
    
}
exports.findById = async function(req, res){
    const id = req.params.id;
    if(id===undefined || id===null || id===''){
        res.status(500).send({
            message: "error"
        })
    }else{
        Status.find({thietbi_id: id}).sort({time: -1}).exec(function(err, result){
            res.send(result);
        })
    }
    
}