import axios from "axios";

export default {
  
  // Gets the book with the given id
  getuser: function(username) {
    return axios.get("/api/user/" + username);
  },
  getUserbyId: function(id) {
    return axios.get("/api/inventory/user/" + id)
  },
  // Deletes the user with the given id
  deleteuser: function(id) {
    return axios.delete("/api/user/" + id);
  },
  // confirmuser: function(userInfo) {
  //   return axios.post("/api/user/login", userInfo)
  // },
  validateUser: function(token){
    return axios.post("/api/user/validate", {token})
  },
  // Saves a user to the database
  saveUser: function(userData) {
    return axios.post("/api/user/register", userData);
  },
  // login user
  loginUser: function(loginData) {
    return axios.post("/api/user/login", loginData);
  },
  // Save Inventory to a user
  saveinventory: function(inventoryData) {
    return axios.post("/api/inventory", inventoryData)
  },
  
  getInventory: function(id) {
    return axios.get("/api/inventory/" + id)
  },
  updateInventory: function(id, inventoryData) {
    console.log("id", id)
    console.log("body", inventoryData)
    return axios.put("/api/inventory/update/" + id , inventoryData)
  },
};
