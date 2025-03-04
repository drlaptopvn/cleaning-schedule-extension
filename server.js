const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises; // Using promises for cleaner async code
const cors = require("cors");

// Constants
const PORT = 3000;
const MEMBERS_FILE = "members.json";

// App setup
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Authentication middleware
const authenticate = (req, res, next) => {
  try {
    const credentials = JSON.parse(req.headers.credentials);
    const { user, password } = credentials;

    if (user === process.env.USER && password === process.env.PASSWORD) {
      return next();
    }

    res.status(401).send("Unauthorized");
  } catch (error) {
    res.status(400).send("Invalid credentials format");
  }
};

// Route handlers
const saveMembers = async (req, res) => {
  try {
    const { members } = req.body;
    await fs.writeFile(MEMBERS_FILE, JSON.stringify(members, null, 2));
    res.send("Members saved successfully");
  } catch (error) {
    res.status(500).send("Error saving members");
  }
};

const getMembers = async (req, res) => {
  try {
    const data = await fs.readFile(MEMBERS_FILE, "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).send("Error reading members");
  }
};

// Routes
app.post("/saveMembers", authenticate, saveMembers);
app.get("/getMembers", getMembers);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Tạo file app.js
const axios = require("axios"); // Cần cài đặt package axios

async function getIP() {
  try {
    const response = await fetch("https://api.ipify.org/?format=json");
    const data = await response.json();

    // Lấy thời gian hiện tại
    const now = new Date().toLocaleString();

    // Hiển thị kết quả
    console.log(`[${now}] IP Response:`, data);
  } catch (error) {
    console.error("Error fetching IP:", error);
  }
}

// Chạy lần đầu tiên ngay lập tức
getIP();

// Thiết lập interval để chạy mỗi 5 phút (300,000 milliseconds)
setInterval(getIP, 300000);

// Thông báo khởi động
console.log("IP Fetcher started. Will check every 5 minutes...");
