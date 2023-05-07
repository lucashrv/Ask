const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const connection = require('./database/database')

const Question = require('./database/models/Question')
const Response = require('./database/models/Response')

connection
    .authenticate()
    .then(() => console.log('Conexão ao DB'))
    .catch(err => console.log(err))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    Question.findAll({
        raw: true,
        order: [
            ['id', 'DESC']
        ]
    })
        .then(questions => {
            res.render('index', {
                questions
            })
        })
})

app.get('/perguntar', (req, res) => {
    res.render('perguntar')
})

app.get('/notfound', (req, res) => res.render('notFound'))

app.get('/pergunta/:id', (req, res) => {
    const id = req.params.id

    Question.findOne({
        where: { id: id }
    }).then(question => {
        if(question != undefined){
            Response.findAll({
                where: { questionId: question.id },
                order: [
                    ['id', 'DESC']
                ]
            })
                .then((response) => {
                    res.render('question', {
                        question,
                        response
                    })
                })
        } else {
            res.redirect('/notfound')
        }
    })

})

app.post('/saveask', (req, res) => {

    const title = req.body.title
    const description = req.body.description

    Question
        .create({
            title,
            description
        })
        .then(() => res.redirect('/'))
})

app.post('/response', (req, res) => {
    const message = req.body.message
    const questionId = req.body.pergunta

    if(message.length > 0){
        Response
            .create({
                message,
                questionId
            })
            .then(() => res.redirect(`/pergunta/${questionId}`))
    } else {
        res.redirect(`/pergunta/${questionId}`)
    }
})

app.listen(port, () => {
    console.log(`Start in port ${port}`)
})