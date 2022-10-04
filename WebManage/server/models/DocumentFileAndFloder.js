
var fs = require('fs');
var dataView = "";


class DocumentFileAndFloder{
    constructor() {
      this.checkfileAndWrite=this.checkfileAndWrite.bind(this);
      this.setPathData=this.setPathData.bind(this);
      this.generateRandomString=this.generateRandomString.bind(this);
    }

    setPathData(patch){
        dataView=patch;
    }
    generateRandomString(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
         
        for (var i = 0; i < length; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
         
       // console.log(text);
        return text;
    }

    checkfileAndWrite(floder,path,content){
       
        var dir =  './public/'+floder;
        try {
            console.log('Lyric dataView .............!',dir);
            if (!fs.existsSync(dir)){
                console.log('Lyric existsSync .............!',dir);
                fs.mkdirSync(dir,{ recursive: true });
            }
            dir=dir+"/"+path;
            console.log('Lyric dir .............!',dir);
           
            fs.writeFile(dir, content, (err) => {
                // throws an error, you could also catch it here
                if (err) throw err;
                console.log('Lyric saved!');
            });
          } catch(err) {
            console.error(err)
            return null;
          }
        return (floder+"/"+path);
    }
    createNewfile(content,floder){
        var ts = 'file'+this.generateRandomString(20)+ (new Date().getTime())+".html";
        return  this.checkfileAndWrite(floder,ts,content);
    }
    readFileInFolder(input){
        var dir = dataView+'\\storeHtml\\' +input;
        return new Promise( ( resolve, reject ) => {
            try {
                fs.readFile(dir, {encoding: 'utf-8'}, function(err,data){
                    if (!err) {
                        resolve(data);
                    } else {
                    //  console.log(" loi ");
                        reject(err);
                    }
                });
            }
            catch(err) {
                reject(err);
            }
        });
    }
    
}

module.exports = DocumentFileAndFloder;