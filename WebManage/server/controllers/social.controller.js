const bcrypt = require('bcrypt');
const HttpStatus = require('http-status-codes');
const knex = require('../config/knex.js');
var squel = require("squel");
const TableManifest= require('../models/middlewareDatabase/TableManifest.js');
const mangerModel = require('../models/database/managerAll.model.js');
const {returnOK,returnFalse,returnNotFound } = require('../utils/returnResponse.js');
const {getRamdomData} = require('../utils/utilsString.js');
const ReportManager = require("../models/manager/ReportManager.js");
var reportManager= new ReportManager();
var socialCtrl={};

 
const BlogManager = require("../models/manager/BlogManager");
var blogManager = new BlogManager();

                          
socialCtrl.checkEmailRegister =async function (req, res) {
  
  try
  {
    var tableSelect=mangerModel('customer');
    var checkCustomer = squel.select().from('customer')
                        .where("email='"+req.body["email"]+"'")
                        .where("deleteflag=0");
    var dataCustomer = await  knex.raw(checkCustomer.toString());
    var empyUser=false;

    if ((dataCustomer==null)||(dataCustomer[0].length==0)) {
        empyUser=true;
        dataCustomer = await  knex.raw(tableSelect.addFormToTableSQL(req.body));
        if ((dataCustomer==null)||(dataCustomer[0].length==0)){
            returnFalse(res,"Database inval");
            return;
        }
    }
    tableSelect=mangerModel('mqtt_user');
    var dataIport = {};
    var nameEmail =req.body["email"].split('@');
    console.log(dataCustomer[0][0].email);
    dataIport["mqtt_user_id"]=0;
    dataIport["user_id"]=dataCustomer[0][0].customer_id;
    dataIport["content"]=nameEmail[0];
    dataIport["mqtt_pub"]='p_'+nameEmail[0];
    dataIport["mqtt_sub"]='s_'+nameEmail[0];
    dataIport["mqtt_user"]=nameEmail[0];
    dataIport["mqtt_pass"]=getRamdomData(10);
    dataIport["mqtt_id"]=nameEmail[0];
    console.log(empyUser);
    if(empyUser){
        dataCustomer = await  knex.raw(tableSelect.addFormToTableSQL(dataIport));
        returnOK(res,dataIport);
    }
    else
    {
        var chechMQTT = squel.select().from('mqtt_user')
                        .where("user_id="+dataCustomer[0][0].customer_id+"")
                        .where("deleteflag=0");
                        console.log(chechMQTT.toString());
        var dataMqttUser = await  knex.raw(chechMQTT.toString());                
        if ((dataMqttUser==null)||(dataMqttUser[0].length==0)){
            dataMqttUser = await  knex.raw(tableSelect.addFormToTableSQL(dataIport));
            returnOK(res,dataIport);
        }
        else
        {
            returnOK(res,dataMqttUser[0][0]);
        }

    }    
  }
  catch(ie){
      console.log(ie);
    returnFalse(res,ie.toString());
  } 
}

socialCtrl.gethome =async function(request, response) {
    let content=request.body["content"];
    reportManager.reportPage(content).then(function(result) {
        return response.send(result);	
    }).catch(function(err){ return  response.send(false);	} );
}


socialCtrl.getTotalPosts = function(request, response) {
    blogManager.getTotalPosts().then(function(result) {
        response.send(JSON.stringify({total:result}));
    })
};
socialCtrl.getPostsPagination = function(request, response) {
    var pageSize = request.query.pageSize;
    var pageNumber = request.query.pageNumber;
    blogManager.getPostsPagination(pageSize, (pageNumber-1)*pageSize).then(function(result) {
        response.send(JSON.stringify(result));
    });
};

socialCtrl.getPosts= function(request, response) {
    blogManager.getPosts().then(function(result) {
        response.send(JSON.stringify(result));
    })
}

socialCtrl.savePost= function(request, response) {
    var post = request.body;
    blogManager.savePost(post).then(function(result) {
        response.send(JSON.stringify(result));
    })
}


module.exports = socialCtrl

