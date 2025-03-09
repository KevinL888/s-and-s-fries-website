const axios = require("axios");

const BASE_URL = "http://localhost:3000/api";

const testAPI = async () => {
    try {
        await axios.post(`${BASE_URL}/menu`, {
            name: "Loaded Fries",
            description: "Fries with bacon, cheese, and ranch",
            price: 7.99,
            category: "Fries",
            image_url: "loaded_fries.jpg"
        });

        let response = await axios.get(`${BASE_URL}/menu`);

        await axios.post(`${BASE_URL}/reviews`, {
            menu_item_id: 1,
            customer_name: "Alice",
            rating: 5,
            review_text: "Amazing fries!"
        });

        response = await axios.get(`${BASE_URL}/reviews`);

    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
};

testAPI();
