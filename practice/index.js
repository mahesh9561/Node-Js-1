const express = require('express');
const app = express();
const User = require('./model/user');
const PORT = process.env.PORT || 3000

// Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World mahesh')
})

app.get('/register-form', (req, res) => {
    res.send(
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
    )
})

app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const data = res.send(req.body);
        console.log(req.body);
        const newUser = new User({name, email, password});
        const response = await newUser.save();
        console.log("Data Store");
        res.status(200).json({
            message: "Data Store",
            data: response
        })
    } catch (error) {
        console.log("error");
        res.status(500).json({
            message: "Error",
            data: error
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
