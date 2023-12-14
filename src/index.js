const express = require("express");
const app = express();
const path = require("path");
const collection = require("./mongodb");

const publicPath = path.join(__dirname, '../public')
const templatePath = path.join(__dirname, '../templates');
app.use(express.static(publicPath))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.sendFile(path.join(templatePath, "login.html")); // Render login.html as the initial page
});
app.get("/signup", (req, res) => {
    res.sendFile(path.join(templatePath, "signup.html")); // Render signup.html
});
app.get("/forgotpass", (req, res) => {
    res.sendFile(path.join(templatePath, "forgotpass.html")); // Render the forgot password page
});
app.get('/getUsername', async (req, res) => {
    try {
      const user = await User.findOne({}, 'username').lean();
      res.json({ username: user.username });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
app.post("/signup", async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            password: req.body.password
        };

        // Check if rememberMe is checked
        if (req.body.rememberMe) {
            await collection.insertMany([data]);
        }
        
        res.sendFile(path.join(templatePath, "index.html")); // Redirect to index.html after signup
    } catch (error) {
        res.send("Error: " + error.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const user = await collection.findOne({ name: req.body.name });
        if (user && user.password === req.body.password) {
            res.sendFile(path.join(templatePath, "index.html")); // Send index.html on successful login
        } else {
            res.send("Wrong password or user does not exist");
        }
    } catch (error) {
        res.send("Error: " + error.message);
    }
});


app.post("/forgotpass", async (req, res) => {
    try {
        const { name, password } = req.body;

        // Check if the user exists in the database
        const user = await collection.findOne({ name });

        if (!user) {
            return res.send("User not found");
        }

        // Update the password for the user
        await collection.updateOne({ name }, { $set: { password } });
        
        res.sendFile(path.join(templatePath, "index.html")); // Redirect to index.html after password update
    } catch (error) {
        res.send("Error: " + error.message);
    }
});

app.listen(3000, () => {
    console.log("port connected to 3000");
});
