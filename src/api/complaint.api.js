import API from "./axios";

export const submitComplaint = (data) =>
  API.post("/complaints", data);

export const myComplaints = () =>
  API.get("/complaints/my");

export const allComplaints = () =>
  API.get("/complaints");
