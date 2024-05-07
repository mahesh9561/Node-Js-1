const validateEmail = ({ str }) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(str);
};


const userDataValidation = ({ name, email, uid, psw }) => {
  return new Promise((resolve, reject) => {
    // Check if any required field is missing
    if (!name || !email || !uid || !psw) {
      reject("Missing user credentials");
    }

    // Check if fields are of type string
    if (typeof name !== "string") reject("Name is not text");
    if (typeof email !== "string") reject("Email is not text");
    if (typeof uid !== "string") reject("UserId is not text");
    if (typeof psw !== "string") reject("Password is not text");

    // Check the length of the uid
    if (uid.length < 3 || uid.length > 50) {
      reject("Username length should be between 3 and 50 characters");
    }

    console.log(validateEmail({ str: email }));
    if (!validateEmail({ str: email })) reject("Email format is incorrect")

    // If all validation passes, resolve the promise
    resolve();
  });
};

module.exports = { userDataValidation, validateEmail };
