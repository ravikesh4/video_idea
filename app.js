const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');


const app = express();


//map global promise
mongoose.Promise = global.Promise;
//connect to mongoose

mongoose.connect('mongodb://localhost/video-dev', {
    // useMongoClient: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected ....'))
    .catch(err => console.log(err));

//load Idea model
require('./models/idea');
const Idea = mongoose.model('ideas');

//handlebars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


//body parser middleware
app.use(bodyParse.urlencoded({ extended: false }))

//parse application/json
app.use(bodyParse.json());

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

//ideas index 
app.get('/ideas', (req, res) => {
    Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
        res.render('ideas/index', {
            ideas:ideas
        });
    });
    // res.render('ideas/index');
});

//Add Indeas

app.get('/ideas/add', (req,res) => {
    res.render('ideas/add');
});

//process form
app.post('/ideas',(req, res) =>{
    // console.log(req.body)
    // res.send('ok');

    let errors = [];

    if(!req.body.title){
        errors.push({text: 'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text: 'Please add a details'});
    }
    if(errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            // user: req.user.id
        }
        new Idea(newUser)
        .save()
        .then(idea => {
            res.redirect('/ideas');
        })
}
});


const port = 5000;

app.listen(port , () => {
    console.log(`server started on ${port}`);
});