const axios = require("axios");



// test("Test to see if the registration works weell", async () => {
//     const response = await axios.post("https://shoppingitemapi.onrender.com/v1/auth/register", {
//         fullName: "Oladele Mike",
//         username: "oladyken",
//         password: "ladelcodez",
//         role: "admin"
//     });

//     expect(response.statusCode).toBe(201);
//     expect(response.data).toBe("User Successfully Created");
// });

test("Test to check if login works", async () => {
    const response = await axios.post("https://shoppingitemapi.onrender.com/v1/auth/login", {
        username: "admin-user",
        password: "admin1234"
    });
    global.token = response.data.token
    
    expect(typeof(response.data)).toBe("object");
})


test("Add a new task", async () => {
    
    const response = await axios.post("https://shoppingitemapi.onrender.com/v1/shop/add", {
        name: "Infinix Phone",
        description: "32GB ROM, 4G Phone",
        price: 65000,
        isInStock: true
    }, {
        headers: {
            Authorization: "Bearer " + global.token,
            "Content-Type": "application/json"
        
        }
    });
    expect(response.data.isRequestSuccessful).toBe(true);
});

test("Get list of tasks", async () => {
    const response = await axios.get("https://shoppingitemapi.onrender.com/v1/shop", {
        headers: {
            Authorization: "Bearer " + global.token
        }
    });
    
    expect(typeof(response.data)).toBe("object");
});

test("Delete task with given id", async () => {
    const response = await axios.delete("https://shoppingitemapi.onrender.com/v1/shop/653a16ab1f48d01d16a89d4f", {
        headers: {
            Authorization: `Bearer ${global.token}`
        }
    });
    expect(response.data.message).toBe("Item has successfully been deleted deleted");
});
