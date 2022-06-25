const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');

const { initializeDatabase } = require('./config/db');
const { PORT } = require('./constants');
const { authentication } = require('./middleware/authMiddleware');
const routes = require('./routes');
const app = express();

app.engine('hbs', handlebars.engine({
    extname: 'hbs'
}));
app.set('view engine', 'hbs');
app.set('views', './src/views');

let hbsHelper = handlebars.create({});

hbsHelper.handlebars.registerHelper('select', function (payment, options){
    let pattern = 'value="' + payment + '"';
    let regex = new RegExp(pattern);

    return options.fn(this)
        .split('\n')
        .map( opt => regex.test(opt) ? opt.replace(pattern, pattern + " selected") : opt );
});

app.use('/static', express.static('./src/public'));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(authentication);
app.use(routes)


initializeDatabase();

app.listen(PORT, () => console.log(`App is listening on port: ${PORT}`));