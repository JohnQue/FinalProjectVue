import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8000/happyhouse/interested",
  headers: {
    "Content-type": "application/json",
  }
});