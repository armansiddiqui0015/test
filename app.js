const  express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const path = require('path');
const userModel = require('./models/user')
const jwt = require('jsonwebtoken')

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))


app.get('/', (req, res) => {
    res.render('index')
})

app.post('/create', (req, res) => {
    let {username, email,password,age} = req.body

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt, async (err,hash)=>{
            let userCreate = await userModel.create({
                username,email,password: hash,age  
            })
            let token = jwt.sign({email}, 'arman7062')
            res.cookie('token', token)
            res.redirect('/login')
        })
    })
   
})

app.get('/logout', (req, res) => {
    let {username, email,password,age} = req.body
    let token = jwt.sign({email}, 'arman7062')
    res.cookie('token', '')
    res.send('log out')
})
app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
   let user = await userModel.findOne({email:req.body.email})
    if (!user) return res.send('<h1 style="color: red">somthing went wrong</h1>')

    bcrypt.compare(req.body.password, user.password, (err,result) =>{
        if(result) res.send('<h1 style="color: green">you Login Succesfully</h1>')
        else res.send('<h1 style="color: red">somthing went wrong</h1>')
    })
})


app.listen(3000)