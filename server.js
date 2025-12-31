// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminComplaintRoutes = require("./routes/adminComplaintRoutes");
const adminRoomRoutes = require("./routes/adminRoomRoutes");
const { errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Use route correctly
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use('/api/auth', authRoutes);
app.use("/api/rooms", require("./routes/roomRoutes"));
 app.use("/api/admin/rooms", adminRoomRoutes);
app.use("/api/admin/complaints", adminComplaintRoutes);

app.get('/', (req, res) => {
  res.send('Hostel Connect API running...');
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
