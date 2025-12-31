const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const createAdmin = async () => {
  const passwordHash = await bcrypt.hash('amul4063', 10);

  await User.create({
    username: 'amulshandilya',
    studentRoll: 'admin001',
    role: 'admin',
    passwordHash
  });

  console.log("Admin created");
  mongoose.disconnect();
};

createAdmin();
