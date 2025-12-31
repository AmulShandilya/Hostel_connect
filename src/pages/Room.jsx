import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const Room = () => {
  const { user } = useContext(AuthContext);
  const [allocation, setAllocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/rooms/my", {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });

        // res.data = allocation document
        setAllocation(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setAllocation(null); // no room allocated yet
        } else {
          alert(err.response?.data?.message || "Failed to fetch room");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [user.accessToken]);

  if (loading) return <p>Loading room details...</p>;

  if (!allocation)
    return <p>No room allocated yet. Please allocate a room.</p>;

  const { room } = allocation;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Room Details</h2>

      <p>
        <strong>Hostel:</strong> {room.hostelName}
      </p>

      <p>
        <strong>Room Number:</strong> {room.roomNumber}
      </p>

      <p>
        <strong>Occupants:</strong>{" "}
        {room.occupants.length
          ? room.occupants.map((o) => o.username).join(", ")
          : "No occupants yet"}
      </p>
    </div>
  );
};

export default Room;
