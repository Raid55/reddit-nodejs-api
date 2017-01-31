var bcrypt = require('bcrypt');
var HASH_ROUNDS = 10;


module.exports = function RedditAPI(conn) {
  return {
    createUser: function(user){
        return bcrypt.hash(user.password, HASH_ROUNDS)
        .then(function(hash){
          return conn.query('INSERT INTO users (username,password, createdAt) VALUES (?, ?, ?)',[user.username, hash, new Date()])
        })
        .then(function(res){
          return conn.query('SELECT id, username, createdAt, updatedAt FROM users WHERE id = ?', [res.insertId])
        })
        .then(function(res){
          return res[0]
        })
        .catch(function(err){
          if (err.code === 'ER_DUP_ENTRY') {
            throw new Error('A user with this username already exists');
          }else{
            throw err;
          }
        })
    },
    createPost: function(post){
      return conn.query('INSERT INTO posts (userId, subredditId, title, url, createdAt) VALUES (?, ?, ?, ?, ?)',
      [post.userId, post.subId, post.title, post.url, new Date()])
      .then(function(res){
        return conn.query('SELECT id,subredditId,title,url,userId, createdAt, updatedAt FROM posts WHERE id = ?', [res.insertId])
      })
      .then(function(res){
        return res[0]
      })
    },
    getAllPosts: function(options){
      if (!options) {
        options = {};
      }
      var sort = options.sortingMethod || 'new';
      var limit = options.numPerPage || 25;
      var offset = (options.page || 0) * limit;
      if(sort === 'top'){
        sort = 'score';
      }else{
        sort = 'posts.createdAt';
      }
      return conn.query(`
        SELECT posts.id as pId, title, url, posts.createdAt as createdAtP, posts.updatedAt as updatedAtP,
        users.id as uId, username, users.createdAt as createdAtU, users.updatedAt as updatedAtU, subreddits.id as idS,
        name, description, subreddits.createdAt as createdAtS,
        COALESCE(SUM(votes.vote),0) as score
        FROM posts
        LEFT JOIN users ON posts.userId = users.id
        LEFT JOIN subreddits ON posts.subredditId = subreddits.id
        LEFT JOIN votes ON votes.postId = posts.id
        GROUP BY pId
        ORDER BY ? DESC
        LIMIT ? OFFSET ?`, [sort, limit, offset])
      .then(function(res){
        return res.reduce(function(accu,el,indx){
          accu.push({
            id: el.pId,
            title: el.title,
            url: el.url,
            score: el.score,
            subreddit: {
              id: el.idS,
              name: el.name,
              description: el.description,
              createdAt: el.createdAtS
            },
            user:{
              id: el.uId,
              username: el.username,
              createdAt: el.createdAtU,
              updatedAt: el.createdAtU
            },
            createdAt: el.createdAtP,
            updatedAt: el.updatedAtP
          })
          return accu
        },[])
      })
    },
    getAllPostsForUser: function(userId, options){
      if (!options) {
        options = {};
      }
      var limit = options.numPerPage || 25;
      var offset = (options.page || 0) * limit;
      return conn.query(`
        SELECT posts.id as pId, title, url, userId, posts.createdAt as createdAtP, posts.updatedAt as updatedAtP,
        users.id as uId, username, users.createdAt as createdAtU, users.updatedAt as updatedAtU
        FROM posts
        LEFT JOIN users ON posts.userId = users.id
        WHERE posts.userId = ?
        ORDER BY posts.createdAt DESC
        LIMIT ? OFFSET ?`, [userId,limit, offset])
      .then(function(res){
        return res.reduce(function(accu,el,indx){
          accu.push({
            id: el.pId,
            title: el.title,
            url: el.url,
            createdAt: el.createdAtP,
            updatedAt: el.updatedAtP,
            user:{
              id: el.uId,
              username: el.username,
              createdAt: el.createdAtU,
              updatedAt: el.createdAtU
            }
          })
          return accu
        },[])
      })
    },
    getSinglePost: function(postId){
      return conn.query(`
        SELECT posts.id as pId, title, url, userId, posts.createdAt as createdAtP, posts.updatedAt as updatedAtP,
        users.id as uId, username, users.createdAt as createdAtU, users.updatedAt as updatedAtU
        FROM posts LEFT JOIN users ON posts.userId = users.id
        WHERE posts.id = ?
        ORDER BY posts.createdAt DESC`, [postId])
      .then(function(res){
        return res.reduce(function(accu,el,indx){
          accu.id= el.pId,
          accu.title= el.title,
          accu.url= el.url,
          accu.createdAt= el.createdAtP,
          accu.updatedAt= el.updatedAtP,
          accu.user={
            id: el.uId,
            username: el.username,
            createdAt: el.createdAtU,
            updatedAt: el.createdAtU
          }
          return accu
        },{})
      })
    },
    createSubreddit: function(sub){
      return conn.query('INSERT INTO subreddits (name,description,createdAt) VALUES (?, ?, ?)',
      [sub.name, sub.description, new Date()])
      .then(function(res){
        return conn.query('SELECT name,description,createdAt FROM subreddits WHERE id = ?', [res.insertId])
      })
      .then(function(res){
        return res[0]
      })
      .catch(function(err){
        if (err.code === 'ER_DUP_ENTRY') {
          throw new Error('A subbreddit with that name alredy exists!');
        }else{
          throw err;
        }
      })
    },
    getAllSubreddits: function(){
      return conn.query(`
        SELECT name
        FROM subreddits
        ORDER BY subreddits.createdAt DESC`)
      .then(function(res){
        return res.reduce(function(accu,el,indx){
          accu.push(el.name)
          return accu
        },[])
      })
    },
    createVoteorUpdate: function(voteObj){
      return conn.query(`INSERT INTO votes SET postId=?, userId=?, createdAt=?, vote=? ON DUPLICATE KEY UPDATE vote=?,
        updatedAt=?`, [voteObj.postId,voteObj.userId,new Date(),voteObj.vote,voteObj.vote,new Date()])
    },
    createComment: function(commentObj){
      if (!commentObj.parentId){
        return conn.query('INSERT INTO comments (text, userId, postId, createdAt) VALUES (?, ?, ?, ?)',
        [commentObj.text, commentObj.userId, commentObj.postId, new Date()])
        .then(function(res){
          return conn.query('SELECT text, userId, postId, createdAt FROM comments WHERE id = ?', [res.insertId])
        })
        .catch(function(err){
          throw err
        })
      }else{
        return conn.query('INSERT INTO comments (parentId, text, userId, postId, createdAt) VALUES (?, ?, ?, ?, ?)',
        [commentObj.parentId, commentObj.text, commentObj.userId, commentObj.postId, new Date()])
        .then(function(res){
          return conn.query('SELECT parentId, text, userId, postId, createdAt FROM comments WHERE id = ?', [res.insertId])
        })
        .catch(function(err){
          throw err
        })
      }
    },
    // getCommentsForPosts: function(postId){
    //   return conn.query(`SELECT * FROM comments
    //     WHERE postId = ?
    //     AND parentId IS NULL
    //     ORDER BY createdAt DESC`, [postId])
    //   .then(function(res){
    //     return res.reduce(function(accu,el,indx){
    //       if(el.parentId === null){
    //         var mainComment = {
    //           id: el.id,
    //           text: el.text,
    //           replies: []
    //         }
    //         res.forEach(function(ele){
    //           if(ele.parentId === el.id){
    //             var repComment = {
    //               id: ele.id,
    //               text: ele.text,
    //               replies: []
    //             }
    //             accu[el.id] = mainComment;
    //             accu[el.id].replies.push(repComment);
    //
    //             res.forEach(function(elem){
    //               if(elem.parentId === ele.id){
    //                 var rerepComment = {
    //                   id: elem.id,
    //                   text: elem.text,
    //                   replies:[]
    //                 }
    //                 accu[el.id].replies.forEach(function(inner){
    //                   if(inner.id === elem.parentId){
    //                     inner.replies.push(rerepComment)
    //                   }
    //                 })
    //               }
    //             })
    //           }else{
    //             accu[el.id] = mainComment;
    //           }
    //         })
    //       }
    //       return accu
    //     },{})
    //   })
    // }
  }
}


// resolve(res.reduce(function(accu,el,idx){
//   return conn.query(`
//     SELECT id, username, createdAt, updatedAt
//     FROM users
//     WHERE id = ?`, [el.userId])
//     .then(function(res){
//       el.user= res[0]
//       accu.push(el)
//       return accu
//     })
//     .catch(function(err){
//       el.user= 'There was an error fetching the username'
//       accu.push(el)
//       return accu
//     })
//   },[]))
