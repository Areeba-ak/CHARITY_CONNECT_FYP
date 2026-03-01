require("dotenv").config();

const Donation = require("../models/Donation");
const Story = require("../models/Story");
const { ethers } = require("ethers");
const CharityConnectLedgerABI = require("../blockchain/CharityConnectLedgerABI");

/* ===============================
   ENV CHECK
================================ */
if (
  !process.env.PRIVATE_KEY ||
  !process.env.AMOY_RPC_URL ||
  !process.env.LEDGER_CONTRACT_ADDRESS
) {
  throw new Error("Missing environment variables. Check your .env file.");
}

/* ===============================
   BLOCKCHAIN SETUP
================================ */
const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(
  process.env.LEDGER_CONTRACT_ADDRESS,
  CharityConnectLedgerABI,
  wallet
);

/* ===============================
   MAKE DONATION
================================ */
exports.makeDonation = async (req, res) => {
  try {
    const { story, amount, paymentMethod, paymentRef, currency } = req.body;

    const lastDonation = await Donation.findOne().sort({ donationId: -1 });
    const donationId = lastDonation ? lastDonation.donationId + 1 : 1;

    let donation = await Donation.create({
      donor: req.user._id,
      story,
      amount,
      paymentMethod,
      paymentRef,
      currency,
      status: "pending",
      donationId,
    });

    try {
      // Ensure story is safely converted to a string (avoid calling toString on null)
      const ngoId = story ? story.toString() : "";

      const tx = await contract.logDonation(
        donationId,
        ngoId,
        "received",
        paymentRef || "offchain"
      );

      await tx.wait();

      donation.blockchainTx = tx.hash;
      donation.status = "completed";
      await donation.save();
    } catch (bcErr) {
      // If blockchain logging fails, keep the donation recorded as completed
      // (payment was already recorded). Store the blockchain error for
      // diagnostics but do not mark the user's donation as failed.
      donation.blockchainError = bcErr.message || String(bcErr);
      donation.status = "completed";
      await donation.save();
      console.error("Blockchain Error (logged to donation.blockchainError):", bcErr);
    }

    // Ensure the related story is marked completed whenever the donation record
    // ends up with status 'completed' (covers both blockchain and off-chain flows)
    try {
      if (donation.status === "completed" && story) {
        await Story.findByIdAndUpdate(story, { status: "completed" });
      }
    } catch (updateErr) {
      console.error("Failed to update story status:", updateErr.message);
    }

    // Populate donor first/last name and story title, then normalize
    const populated = await Donation.findById(donation._id)
      .populate("donor", "firstName lastName")
      .populate("story", "title")
      .lean();

    const donorName = populated.donor
      ? `${populated.donor.firstName || ""} ${populated.donor.lastName || ""}`.trim()
      : "Unknown";

    res.status(201).json({
      ...populated,
      donor: { name: donorName },
      story: { title: populated.story?.title || "" },
    });
  } catch (err) {
    console.error("Donation Error:", err.message);
    res.status(500).json({ message: "Donation failed", error: err.message });
  }
};

/* ===============================
   GET MY DONATIONS
================================ */
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate("donor", "firstName lastName")
      .populate("story", "title")
      .sort({ createdAt: -1 })
      .lean();

    const normalized = donations.map((d) => {
      const donorName = d.donor
        ? `${d.donor.firstName || ""} ${d.donor.lastName || ""}`.trim()
        : "Unknown";
      return {
        ...d,
        donor: { name: donorName },
        story: { title: d.story?.title || "" },
      };
    });

    res.json(normalized);
  } catch (err) {
    console.error("Get Donations Error:", err.message);
    res.status(500).json({
      message: "Failed to fetch donations",
      error: err.message,
    });
  }
};