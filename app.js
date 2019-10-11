const express = require('express');
const exphbs  = require('express-handlebars');


const app = express();

//handlebars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//middleware

// app.use(function(req, res, next) {
//     console.log(Date.now());
//     req.name = 'ravi';
//     next();
// });

//index
app.get('/',(req, res) => {
    // console.log(req.name);
    const title = 'Welcome1'
    res.render('index',{
        title: title
    });
});

//about

app.get('/about', (req,res) => {
    res.render('about');
});

const port = 5000;

app.listen(port , () => {
    console.log(`server started on ${port}`);
});