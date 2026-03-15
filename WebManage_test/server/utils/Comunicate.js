var https = require('https');
const axios = require('axios');
var Comunicate={};
function getValueMessageZalo(item,template_id,template_data=null){
    var data='{';
    data+=' "phone": "'+item['phone']+'",';
    data+=' "template_id": "'+template_id+'",';
    data+=' "template_data": '+template_data+',"tracking_id": "0"';
   /* data+=' "customer_name": "'+item['customer_name']+'",';
    data+=' "customer_number": "'+item['customer_number']+'",';
    data+=' "delivery_time": "'+item['delivery_time']+'",';
    data+=' "custom_id": "'+item['custom_id']+'",';
    data+=' "product": "'+item['product']+'",';
    data+=' "product_id": "'+item['product_id']+'",';
    data+=' "fullname": "'+item['fullname']+'",';
    data+=' "full_name": "'+item['full_name']+'",';
    data+=' "date": "'+item['date_time']+'",';
    data+=' "a": "'+item['a']+'",';
    data+=' "b": "'+item['b']+'",';
    data+=' "c": "'+item['c']+'",';
    data+=' "money": "'+item['money']+'",';
    data+=' "order_id": "'+item['order_id']+'",';
    data+=' "address": "'+item['address']+'", "tracking_id": "0" ';*/
    data+='}';

    return data;
}

function getValueMessageZaloTemplate(item,template_id){
    var data = '{"phone": "'+item['phone']+'",'
                +'"template_id": "'+template_id+'",'
                +   '"template_data": {'
                +                '"customer_name": "'+item['customer_name']+'",'
                +                '"customer_number": "'+item['customer_number']+'",'
                +                '"delivery_time": "'+item['delivery_time']+'",'
                +                '"custom_id": "'+item['custom_id']+'",'
                +                '"product": "'+item['product']+'",'
                +                '"product_id": "'+item['product_id']+'",'
                +                '"fullname": "'+item['fullname']+'",'
                +                '"full_name": "'+item['full_name']+'",'
                +                '"date": "'+item['delivery_time']+'",'
                +                '"a": "'+item['a']+'",'
                +                '"b": "'+item['b']+'",'
                +                '"c": "'+item['c']+'",'
                +                '"money": "'+item['money']+'",'
                +                '"order_id": '+item['order_id']+','
                +                '"address": "'+item['address']+'"'
                + '},'
                +'"tracking_id":"tracking_id"'
                +'}';
    return data;
}

function getValueMessageZaloTemplateData(item,template_id){
    var data = {phone:item['phone'],template_id:template_id,
                template_data:{customer_name:item['customer_name'],
                customer_number: item['customer_number'],
                delivery_time: item['delivery_time'],
                custom_id:+item['custom_id'],
                product: item['product'],
                product_id:item['product_id'],
                fullname:item['fullname'],
                full_name:item['full_name'],
                date:item['delivery_time'],
                a:item['a'],
                b:item['b'],
                c:item['c'],
                money:item['money'],
                order_id:item['order_id'],
                address: item['address'],
                },
                tracking_id:"tracking_id",
                };
    return data;
}

/*

{
    "phone": "84389992137",
    "template_id": "204004",
    "template_data": 
        {
            "date":"14/4/2021",
            "product":"Hosting ABC",
            "full_name":"Do Viet Dung",
            "product_id":"A123"
        },
        "tracking_id": "tracking_id"
    }
*/
Comunicate.sendOneMessage = function ( item,template_id,token) {
    return new Promise( ( resolve, reject ) => {
        //https://business.openapi.zalo.me/template/all
        var url = "http://188.166.254.175/send-message-zalo?access_token="+token;
        console.log("sendMessage ...................>>>>>>>>>>>",template_id);
        if(template_id!=null && template_id > 0) {
            var data_send=getValueMessageZaloTemplateData(item,template_id);
            //'{"phone": "84389992137","template_id": "204004","template_data": {"date":"14/04/2021","product":"Hosting ABC","full_name":"Do Viet Dung","customer_name":"Do Viet Dung","order_id":1,"a":"test","b":"test","c":"test","product_id":"A123"}, "tracking_id": "tracking_id" }';
            axios.post(url,
                    data_send,
                        {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                    }
                )
                .then((response) => {
                    console.log(response.data)
                    item['message']=response.data['message'];
                    item['error_code']=response.data['error'];
                    console.log("response.data 1",response.data.data);
                    if(!!response.data.data){
                        console.log("response.data 2");
                        item['sent_time']=response.data.data.sent_time;
                        item['msg_id']=response.data.data.msg_id;
                    }  
                    else
                    {
                        console.log("response.data 3");
                        item['sent_time']=null;
                        item['msg_id']=null;
                    }
                    console.log("response.data 3");
                    item['send_count']+=1;
                    console.log("response.data 4");
                    if(response.data['error']==0 ) item['send_success_count']=item['send_count'];
                    item.status_send=3;
                    console.log("response.data 5");
                    resolve(response.data);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });

        }
    });
}


Comunicate.getAllTemplate = function (token) {
    return new Promise( ( resolve, reject ) => {
       // https://business.openapi.zalo.me/template/all?access_token=
       //jrzcEJ9-PIA-NMGuF7Td8BnKO3SzQ0DKiGbL2trrMrQ1C5bEV41S9vWvBNaTR587c1KLMnH1Pa72ENnSBny8DFrA2ci31tiRutGlHpOyK5d9U0m5D5a9SF8O2ZrmOt4hW08FKq9x2XQnA5n9CL4xKCqIOnucQHLz_1Ts20PK4sBS4se1E5CLITivHbOLIJq9-IfZLdv13HR-ArDG8NzS4U42FWaXLs9Gyn8HC39IRLxS6Yr50MfxNUPD9I8-FLL4qtem1WmnTa_iO7O26ZPtT-Py6YfOJhGIDoymOsKa&offset=0&limit=100
        var url = "/template/all?access_token="+token+"&offset=0&limit=100";
        console.log("Comunicate.getAllTemplate",url);
        if(token!=null) {
            var options = {
                hostname: 'business.openapi.zalo.me',
                path: url,
                method: 'GET',
                json: true,
                headers: {
                    'Content-Type': 'application/json',
                    //'Content-Length': data_send.length,
                }
            }
            console.log("Comunicate.getAllTemplate begin",url);
            var req = https.request(options, res => {
                console.log('STATUS: ' + res.statusCode);
                res.setEncoding('utf8');
                res.on('data', d => {
                    console.log('data: ',d);
                    resolve(JSON.parse(d));
                });
            });
            req.on('error', error => {
                console.log(error);
                reject(error);
            });
            req.end();
        }
    });
}

Comunicate.createTemplate = function (info,token) {
    return new Promise( ( resolve, reject ) => {
        var url = "/message/template?access_token="+token;
        if(template_id!=null && template_id > 0) {
            var data_send=info;
            //http://103.130.212.210:2000/send-message-zalo
            var options = {
                hostname: '188.166.254.175',
                path: url,
                method: 'POST',
                json: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data_send.length,
                }
            }
            console.log("sendMessage ...................>>>>>>>>>>>ol 1",data_send, data_send.length);
            var req = https.request(options, res => {
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
               
                res.on('data', d => {
                    console.log("https.request=======>",d)
                    item['message']=d['message'];
                    item['error_code']=d['error'];
                    if(!!d.data){
                        item['sent_time']=d.data.sent_time;
                        item['msg_id']=d.data.msg_id;
                    }  
                    else
                    {
                        item['sent_time']=null;
                        item['msg_id']=null;
                    }
                    item['send_count']+=1;
                    if(d['error']==0 ) item['send_success_count']=item['send_count'];
                    item.status_send=3;
                    resolve(d);
                });
            });
            console.log("sendMessage ...................>>>>>>>>>>>ol 2");
            req.on('error', error => {
                console.log(error);
                reject(error);
            });
            console.log("sendMessage ...................>>>>>>>>>>>ol 4");
            req.write(data_send);
            req.end();
            console.log("sendMessage ...................>>>>>>>>>>>ol 6");
        }
    });
}

module.exports=Comunicate;