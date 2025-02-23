const axios = require("axios");

const BASE_URL = "http://localhost:3000/api";

const testAPI = async () => {
    try {
        console.log("\n Adding new menu items...");
        await axios.post(`${BASE_URL}/menu`, {
            name: "Loaded Fries",
            description: "Fries with bacon, cheese, and ranch",
            price: 7.99,
            category: "Fries",
            image_url: "loaded_fries.jpg"
        });

        console.log("\n Fetching all menu items...");
        let response = await axios.get(`${BASE_URL}/menu`);
        console.log("Menu:", response.data);

        console.log("\n Adding a review...");
        await axios.post(`${BASE_URL}/reviews`, {
            menu_item_id: 1,
            customer_name: "Alice",
            rating: 5,
            review_text: "Amazing fries!"
        });

        console.log("\n Fetching all reviews...");
        response = await axios.get(`${BASE_URL}/reviews`);
        console.log("Reviews:", response.data);

        console.log("\n Tests completed!");
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
};

testAPI();
