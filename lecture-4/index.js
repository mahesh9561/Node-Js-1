const express = require("express");
const mongoose = require("mongoose");
const userModel = require('./userSchema');

const app = express();
const PORT = 8000;
const DB_URL = `mongodb+srv://mahesh:vivek@cluster0.ezqezdh.mongodb.net/acciojob-tests`

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// db Connection
mongoose.connect(DB_URL).then(() => { console.log("MongoDB connected successfully") }).catch(console.log('error'))


app.get("/", (req, res) => {
    return res.send("Server is running");
});

app.get("/get-form", (req, res) => {
    return res.send(
        `
        <html>
        <body>
            <h1>User Form</h1>
            <form action='/api/form_submit' method='POST'>
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

app.post("/api/form_submit", async (req, res) => {
    console.log("all ok");

    const nameC = req.body.name;
    const emailC = req.body.email;
    const passwordC = req.body.password;
    console.log(nameC, emailC, passwordC);
    // const { name, email, password } = req.body;
    const userObj = new userModel({
        name: nameC,
        email: emailC,                  
        password: passwordC
    })
    console.log(userObj)


    try {
        const userDb = await userObj.save();
        console.log(userObj)

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

app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
});