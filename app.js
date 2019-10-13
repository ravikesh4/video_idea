const express = require('express');
const path = require('path')
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// load routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/video-dev', {
  useMongoClient: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Load Idea Model
// require('./models/Idea');
// const Idea = mongoose.model('ideas');

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// express session 
app.use(session({
    secret: 'Secret',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }))

app.use(flash());

// global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next();
})

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});



//use routes
app.use('/ideas', ideas)
app.use('/users', users)

const port = 5000;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});