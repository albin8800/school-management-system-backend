import bcrypt from "bcrypt";

const password = "Admin@123"; // change if you want
const hash = await bcrypt.hash(password, 10);
console.log(hash);
