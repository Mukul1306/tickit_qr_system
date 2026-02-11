const bcrypt = require("bcrypt");

async function hashPassword() {
  const password = "23cs062";
  const hashed = await bcrypt.hash(password, 10);
  console.log(hashed);
}

hashPassword();
