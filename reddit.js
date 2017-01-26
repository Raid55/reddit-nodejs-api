var bcrypt = require('bcrypt');
var HASH_ROUNDS = 10;


module.exports = function RedditAPI(conn) {
  return {
    createUser: function(user){
      return new Promise(function(resolve, reject) {
        bcrypt.hash(user.password, HASH_ROUNDS)
        .then(function(hash){
          return conn.query('INSERT INTO users (username,password, createdAt) VALUES (?, ?, ?)',[user.username, hash, new Date()])
        })
        .then(function(res){
          return conn.query('SELECT id, username, createdAt, updatedAt FROM users WHERE id = ?', [res.insertId])
        })
        .then(function(res){
          resolve(res[0])
        })
        .catch(function(err){
          if (err.code === 'ER_DUP_ENTRY') {
            reject(new Error('A user with this username already exists'));
          }else{
            reject(err);
          }
        })
      })
    },
    createPost: function(post){
      return new Promise(function(resolve,reject){
        return conn.query('INSERT INTO posts (userId, title, url, createdAt) VALUES (?, ?, ?, ?)', [post.userId, post.title, post.url, new Date()])
        .then(function(res){
          return conn.query('SELECT id,title,url,userId, createdAt, updatedAt FROM posts WHERE id = ?', [res.insertId])
        })
        .then(function(res){
          resolve(res[0])
        })
        .catch(function(err){
          reject(err);
        })
      })
    },
    getAllPosts: function(options){
      return new Promise(function(resolve,reject){
        if (!options) {
          options = {};
        }
        var limit = options.numPerPage || 25; // if options.numPerPage is "falsy" then use 25
        var offset = (options.page || 0) * limit;
        conn.query(`
          SELECT id, title, url, userId, createdAt, updatedAt
          FROM posts
          ORDER BY createdAt DESC
          LIMIT ? OFFSET ?`, [limit, offset])
        .then(function(res){
          resolve(res)
        })
        .catch(function(err){
          reject(err)
        })
      })
    }
  }
}
