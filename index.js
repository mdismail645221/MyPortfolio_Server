const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const nodemailer = require('nodemailer');
require('dotenv').config();


// middleware
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send("MY PORTFOLIO RUNNING")
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.cn0mdvb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });








// sending email
const sendEmail = (emailData) => {
    // console.log("emailData", emailData)'

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: emailData?.email,
        to: process.env.EMAIL,
        subject: emailData?.subject,
        html: `
        <p>Contact user Name ${emailData.name}</p>
        <p>${emailData.message}</p>
        `
    };


    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            // do something useful
        }
    });
}

async function run() {
    try {
        const projectsCollection = client.db("MyPortFolio").collection("myProjects");
        const clientMessageCollection = client.db("MyPortFolio").collection("clientMessage");


        app.get('/projects', async (req, res) => {
            const query = {};
            const result = await projectsCollection.find(query).toArray();
            res.send(result)
        })

        // signle project
        app.get('/projects/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await projectsCollection.findOne(query);
            res.send(result)

        })

        app.post('/projects', async(req, res) => {
            const { name, email, message } = req.body;
            // console.log(body)
            const result = await clientMessageCollection.insertOne(req.body)
            if(result){
                res.send({
                    success: true,
                    data: result
                })
                sendEmail({
                    message: message,
                    name,
                    email,
                    subject: "CONTACT OF PORTFOLIO CLIENT"
                })
            }else{
                res.send({
                    success: false,
                    message: "no found data. please another try now"
                })
                return;
            }
           
        })



    }
    catch {
        (e) => {
            console.dir(e)
        }
    }
}

run().catch((e) => {
    console.log(e)
})






app.listen(port, () => {
    console.log("my portfolio is running", port)
})