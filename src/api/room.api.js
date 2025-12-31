import API from "./axios";

export const allocateRoom = () => API.post("/rooms/allocate");
export const getMyRoom = () => API.get("/rooms/my");
