const axios = require('axios');

// Replace with your running backend URL
const BASE_URL = "http://localhost:5000/api/donations";

// Replace with a valid JWT token for a test user
const JWT_TOKEN = "YOUR_JWT_TOKEN_HERE";

async function testDonation() {
  try {
    const donationData = {
      story: "64f8c1b2f0e1a23d45678901", // Replace with a valid Story ID from DB
      amount: 50,
      paymentMethod: "stripe",
      paymentRef: "TEST123",
      currency: "USD"
    };

    // Make donation
    const response = await axios.post(`${BASE_URL}/make`, donationData, {
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`
      }
    });

    console.log("Donation Response:");
    console.log(response.data);

    // Optionally, get all donations for the user
    const myDonations = await axios.get(`${BASE_URL}/my`, {
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`
      }
    });

    console.log("\nMy Donations:");
    console.log(myDonations.data);

  } catch (err) {
    console.error("❌ Test Donation Error:", err.response ? err.response.data : err.message);
  }
}

testDonation();
