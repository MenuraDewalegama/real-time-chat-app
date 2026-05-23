const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).send("User exists");

    const hashed = await bcrypt.hash(password, 10);

    await User.create({ username, password: hashed });

    res.send("registered");
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).send("Invalid user");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).send("Wrong password");

    const token = jwt.sign(
        { username },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );

    res.json({ token });
});

module.exports = router;