import api from "../utils/api";

export const getMyDonations = () => api.get("/donations/my");

export const makeDonation = (data) => api.post("/donations/make", data);

export default { getMyDonations, makeDonation };