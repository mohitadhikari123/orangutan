import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  first_name: { type: String, default: "" },
  middle_name: { type: String, default: "" },
  last_name: { type: String, default: "" },
  phone_number: { type: String, required: true, unique: true, default: "" },
  address_line_1: { type: String, default: "" },
  address_line_2: { type: String, default: "" },
  state: { type: String, default: "" },
  pin_code: { type: String, default: "" },
  country: { type: String, default: "" },
});

const User = mongoose.models.users || mongoose.model("users", UserSchema);

export default User;
