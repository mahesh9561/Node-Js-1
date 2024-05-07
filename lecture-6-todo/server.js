const express = require('express');
const app = express();
require('dotenv').config()
const mongoose = require('mongoose');
const { userDataValidation, validateEmail } = require('./utils/authUtils');
const User = require('./models/userModel')
const bcrypt = require('bcrypt');
const session = require('express-session');
const { isAuth } = require('./middleware/isAuth');
const { todoValidation } = require('./utils/todoutils');
const userModel = require('./models/userModel');
const todoModel = require('./models/todoModel');
const mongodbSession = require('connect-mongodb-session')(session)
const Schema = mongoose.Schema;

const PORT = process.env.PORT || 8000;

const store = mongodbSession({
    uri: process.env.MONGO_URL,
    collection: "session"
})

// Db connections
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDb connected Sucessfully")
    })
    .catch((err) => {
        console.log(err)
    }
    )

// Middleware
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
    secret: "This is nodeJs Project",
    store: store,
    resave: false,
    saveUninitialized: false
}))

// Routes
app.get('/', (req, res) => {
    return res.render("server")
})

app.get('/register', (req, res) => {
    return res.render("registerPage")
})

app.post('/register-form', async (req, res) => {
    const { name, email, uid, psw } = req.body;
    const hashedPassword = await bcrypt.hash(psw, 10);  //convert to hashmap
    try {
        await userDataValidation({ name, email, uid, psw });
        // 
        // check for email exist
        const isEmailExist = await User.findOne({ email });
        // console.log(isEmailExist)
        if (isEmailExist) {
            return res.status(400).json("Email already exist")
        }

        // check for username exist
        const isUserNameExist = await User.findOne({ uid });
        // console.log(isUserNameExist)
        if (isUserNameExist) {
            return res.status(400).json("UserName already exist")
        }
        // 
        // Validation passed, proceed to save the user object
        const userObj = new User({
            name: name,
            email: email,
            uid: uid,
            psw: hashedPassword,
        });

        try {
            const userDb = await userObj.save();
            return res.redirect('/login')
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: "Internal Server Error",
                error: error
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            status: 400,
            error: error,
        });
    }
});

app.post('/login-form', async (req, res) => {
    // console.log(req.body);
    const { email, psw } = req.body;

    if (!email || !psw) {
        return res.send({
            status: 400,
            message: "Please fill all the fields"
        })
    }
    let userDb;
    try {
        if (validateEmail({ str: email })) {
            userDb = await User.findOne({ email: email });
        } else {
            userDb = await User.findOne({ uid: email });
        }
        // console.log(userDb)

        if (!userDb) {
            return res.send({
                status: 400,
                message: "User not found, Please register First"
            })
        }
        // console.log(psw === userDb.psw)
        const isMatched = await bcrypt.compare(psw, userDb.psw)
        if (!isMatched) {
            return res.send({
                status: 400,
                message: "password is incorrect"
            })
        }

        // console.log(req.session)
        req.session.isAuth = true;
        req.session.user = {
            uid: userDb.uid,
            email: userDb.email,
            userId: userDb._id
        }

        return res.redirect('/dashboard')
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal server Error",
            error: error
        })
    }
});

app.get('/dashboard', isAuth, (req, res) => {
    return res.render("dashboard")
})

app.post('/logout', isAuth, (req, res) => {
    console.log(req.session)
    req.session.destroy((err) => {
        if (err) throw err;
        // console.log(req.session);
        return res.redirect('/login')
    })
})

// app.post('/logout_all', isAuth, async (req, res) => {
//     console.log(req.session);
//     console.log("all delete", req.session.user.uid)
//     const userName = req.session.user.uid
//     res.send("all Ok")
//     const sessionSchema = new Schema({
//         _id: String
//     }, { strict: false });
//     const sessionModel = mongoose.model('session', sessionSchema);
//     try {
//         const deleteDb = await sessionModel.deleteMany({ _id: userName });
//         console.log(deleteDb);
//         return res.send({
//             status: 200,
//             message: "Logout from all devices",
//             data: deleteDb
//         });
//     } catch (error) {
//         return res.send({
//             status: 500,
//             message: "Internal server Error",
//             error: error
//         })
//     }

// })

app.post('/logout_all', isAuth, async (req, res) => {
    console.log(req.session);
    console.log("all delete", req.session.user.uid)
    const userName = req.session.user.uid;

    const sessionSchema = Schema({ _id: String }, { strict: false });
    const sessionModel = mongoose.model('session', sessionSchema);

    try {
        const deleteDb = await sessionModel.deleteMany({ _id: userName });
        console.log(deleteDb);
        return res.send({
            status: 200,
            message: "Logout from all devices",
            data: deleteDb
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            status: 500,
            message: "Internal server Error",
            error: error.message
        });
    }
});

app.get('/login', (req, res) => {
    return res.render("loginPage")
})

// Create Todo
app.post('/create-items', isAuth, async (req, res) => {
    console.log(req.body);
    const todoText = req.body.todo;
    const username = req.session.user.uid;

    try {
        await todoValidation({ todoText })
    } catch (error) {
        return res.send({
            status: 400,
            message: "Data Error",
            error: error
        })
    }

    const todoObj = new todoModel({
        todo: todoText,
        username: username
    })

    try {
        const todoDb = await todoObj.save();
        return res.send({
            status: 201,
            message: "Todo Created Successfully",
            data: todoDb
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal Server Error",
            error: error
        })

    }
})

// Read Todo
app.get('/read-items', isAuth, async (req, res) => {
    const username = req.session.user.uid;
    try {

        const todoDb = await todoModel.find({ username: username });
        console.log(todoDb)
        if (todoDb.length === 0) {
            return res.send({
                status: 204,
                message: "No Todo Found",
                data: todoDb
            })
        }
        res.send({
            status: 200,
            message: "Todo Fetched Successfully",
            data: todoDb
        })
    } catch (error) {
        res.send({
            status: 500,
            message: "Internal Server Error",
            error: error
        })
    }
})

// edit Todo
app.post('/edit-items', isAuth, async (req, res) => {
    const username = req.session.user.uid;
    const { todoId, newData } = req.body;

    if (!todoId) {
        return res.send({
            status: 400,
            message: "Todo Id is required"
        })
    }

    try {
        await todoValidation({ todoText: newData })
    } catch (error) {
        return res.send({
            status: 400,
            error: error
        })
    }

    try {
        const todoDb = await todoModel.findOne({ _id: todoId });
        if (!todoDb) {
            return res.send({
                status: 203,
                message: `Todo Not Found, ${todoId}`,
                data: todoDb
            });
        }

        if (username !== todoDb.username) {
            return res.send({
                status: 403,
                message: "You are not authorized to edit this todo",
            });
        }

        const prevTodo = await todoModel.findOneAndUpdate(
            { _id: todoId },
            { todo: newData }
        );

        console.log("prevTodo", prevTodo);

        return res.send({
            status: 200,
            message: "Todo Updated Successfully",
            data: prevTodo
        });
    } catch (error) {
        console.log(error);
        return res.send({
            status: 500,
            message: "Internal Server Error",
            error: error
        });
    }
});

// Delete Todo
app.post('/delete-items', isAuth, async(req, res) => {
    const username = req.session.user.uid;
    const { todoId } = req.body;


})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})