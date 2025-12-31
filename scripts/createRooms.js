const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Room = require("../models/Room");

dotenv.config();

const roomsData = [
  { hostelName: "Kautilya", totalRooms: 400 },
  { hostelName: "Aryabhatt", totalRooms: 400 },
  { hostelName: "Kadambari", totalRooms: 400 },
];

const createRooms = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (let hostel of roomsData) {
      for (let i = 1; i <= hostel.totalRooms; i++) {
        const roomNumber = i + 100;
        await Room.create({
          hostelName: hostel.hostelName,
          roomNumber: roomNumber,
          capacity: 2,
          occupants: [],
        });
      }
    }

    console.log("Rooms created successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
};

createRooms();
