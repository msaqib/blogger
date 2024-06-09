module.exports = (req, res, next) => {
    console.log('Requeste arrived')
    console.log(req.method, req.url)
    if (req.method === 'GET' && req.url === '/posts') {
        const posts = require('../db.json').posts
        const delay = 3000
        let sentCount = 0; // Track sent posts
        res.write('[')
    for (const [index, post] of posts.entries()) {
      setTimeout(() => {
        res.write(JSON.stringify(post)); // Send post as a string
        sentCount++;
        console.log(sentCount)
        if (sentCount < posts.length) {
            res.write(',');  // Add comma after all posts except the last one
          } else {
            res.write(']')
          res.end();  // End response after all posts are sent
        }
      }, delay * index);
    }
    } else {
      next(); // Continue with other requests as usual
    }
  };  