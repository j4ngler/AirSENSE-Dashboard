var squel = require("squel");
const knex = require('../../config/knex.js');

class BlogManager {
    constructor() {}

    querryDbSQLTotalRecord=(table, where, join)=>
    {
        where = where == undefined ? '': 'WHERE ' + where.join(' AND ');
        join = join == undefined ? '': join;
        return new Promise( ( resolve, reject ) => {
            knex.raw('SELECT count(*) as total FROM `'+table+'` '+where+' '+join)
            .then(function(result) {  
                resolve( result);
            }).catch(function(err){ return reject(err);} )
        } );
    }

    getTotalPosts() {
        var where = [];
        where.push("post_status = 'publish'");
        where.push("(post_title IS NOT NULL AND post_title !='')");
        where.push("post_type = 'post'");
        return new Promise((resolve, reject) => {
            this.querryDbSQLTotalRecord('sparc_posts',where).then(function(result) {
                resolve(result.result[0].total);
            }).catch(function(err){ return reject(err);} );
        })
        
    }
    querryDbSQLPagination=(table, limit, offset, where, join)=>
    {
        where = where == undefined ? '': 'WHERE ' + where.join(' AND ');
        join = join == undefined ? '': join;
        return new Promise( ( resolve, reject ) => {
            knex.raw('SELECT * FROM `'+table+'` '+where+'  ORDER BY ID DESC LIMIT '+offset+', '+limit+' '+join)
            .then(function(result) {  
                resolve( result);
            }).catch(function(err){ return reject(err);} )
        } );
    }

    getPostsPagination(limit, offset) {
        var where = [];
        where.push("post_status = 'publish'");
        where.push("(post_title IS NOT NULL AND post_title !='')");
        where.push("post_type = 'post'");
        return new Promise((resolve, reject) => {
            mySQLConfig.querryDbSQLPagination('sparc_posts', limit, offset,where).then(function(result) {
                resolve(result.result);
            });
        })
    }
  
    getPosts() {
        var query = squel.select().from("sparc_posts").where("post_status = 'publish' AND (post_title IS NOT NULL AND post_title !='')  AND post_type = 'post'");
        return new Promise((resolve, reject) => {
            knex.raw(query.toString()).then(function(result) {  
                resolve( result);
            }).catch(function(err){ return reject(err);} )
        })
    }

    savePost(post) {
        var query;
        if(post.ID) {
            query = squel.update().table('sparc_posts')
                        .set('post_author',post.post_author)
                        .set('post_title', post.post_title)
                        .set('post_content', post.post_content)
                        .set('post_status', post.post_status)
                        .where("ID = '" + post.ID + "'");
        } else {
            query = squel.insert().into('sparc_posts')
                        .set('post_author',post.post_author)
                        .set('post_title', post.post_title)
                        .set('post_content', post.post_content)
                        .set('post_status', post.post_status)
                        .set('deleteflag', '0');
        }
        
        return new Promise((resolve, reject) => {
            knex.raw(query.toString()).then(function(result) {  
                resolve( result);
            }).catch(function(err){ return reject(err);} )
        })
    }

  

    getPostById(id) {
        var query = squel.select().from("sparc_posts").order("id",false).where('ID ='+ id);
        return new Promise( ( resolve, reject ) => {
            knex.raw(query.toString()).then(function(result) { 
                resolve( result[0]);
            }).catch(function(err){ return reject(err);} )
        });
    }
}

module.exports = BlogManager;