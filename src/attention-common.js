import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8000/happyhouse/attention",
  headers: {
    "Content-type": "application/json",
  }
});