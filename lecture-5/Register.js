const express = require("express");
const mongoose = require("mongoose");
const userModel = require('./UserSchema');
const session = require('express-session');
const mongodbSession = require('connect-mongodb-session')(session);

const app = express();
const PORT = 8000;
const DB_URL = `mongodb+srv://mahesh:vivek@cluster0.ezqezdh.mongodb.net/acciojob-tests`;

const store = new mongodbSession({
    uri: DB_URL,
    collection: 'session'
})


//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: "Its me Mahesh",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
)

// db Connection
mongoose.connect(DB_URL)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch(error => {
        console.log('Error connecting to MongoDB:', error);
    });


app.get("/", (req, res) => {
    return res.send("Server is running");
});

app.get("/register-form", (req, res) => {
    return res.send(
        `
        <html>
        <body>
            <h1>Register Form</h1>
            <form action='/api/register' method='POST'>
                <label for="name">Name</label>
                <input type="text" name="name"/>
                <br/>
                <label for="email">Email</label>
                <input type="text" name="email"/>
                <br/>
                <label for="password">Password</label>
                <input type="text" name="password"/>
                <br/>
                <button type="submit">Submit</button>
            </form>
        </body>
        </html>
        `
    );
});


app.get("/login-form", (req, res) => {
    return res.send(
        `
        <html>
        <body>
            <h1>Login Form</h1>
            <form action='/api/login' method='POST'>
                <label for="email">Email</label>
                <input type="text" name="email"/>
                <br/>
                <label for="password">Password</label>
                <input type="text" name="password"/>
                <br/>
                <button type="submit">Submit</button>
            </form>
        </body>
        </html>
        `
    );
});


app.post("/api/register", async (req, res) => {
    // console.log("all ok");

    const nameC = req.body.name;
    const emailC = req.body.email;
    const passwordC = req.body.password;
    // console.log(nameC, emailC, passwordC);
    // const { name, email, password } = req.body;
    const userObj = new userModel({
        name: nameC,
        email: emailC,
        password: passwordC
    })
    // console.log(userObj)


    try {
        const userDb = await userObj.save();
        // console.log(userObj)

        return res.send({
            status: 201,
            message: "User created successfully",
            data: userDb
        })

    } catch (error) {
        return res.send({
            status: 400,
            message: "User not created",
            error: error
        })

    }

    // console.log(req.body);
    return res.send("Form submitted successfully");
    //   return res.status(200).json("Form submitted successfully");
});
app.post('/api/login', async (req, res) => {
    try {
        // console.log('ok');
        // console.log(req.body)
        const email = req.body.email;
        const password = req.body.password;
        const user = await userModel.findOne({ email: email });
        // console.log(user);
        if (!user) {
            return res.send({
                status: 400,
                message: "User not found"
            })
        }
        if (password !== user.password) {
            return res.send({
                status: 400,
                message: "Incorrect password"
            })
        }

        req.session.isAuth = true;
        console.log(req.session)

        // If everything is fine, you might want to send a success message.
        return res.send({
            status: 200,
            message: "Login successful",
            data: user // You can send user data if needed
        });
    } catch (error) {
        // Handle other errors if needed
        console.error(error);
        return res.send({
            status: 500,
            message: "Internal Server Error"
        });
    }
});

app.get("/home", (req, res) => {
    console.log(req.session);
    if(req.session.isAuth){
        return res.send("Home Page")
    }else{
        return res.send("Session expire please login again")
    }
    
})


app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
});