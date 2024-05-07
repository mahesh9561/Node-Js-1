const todoValidation = ({ todoText }) => {
    return new Promise((resolve, reject) => {
        if (!todoText) reject("Missing todo string");
        if (typeof todoText !== "string") reject("Todo is not a text")
        if (todoText.length < 3 || todoText.length > 100) reject("Todo length should be 3-100")
        resolve();
    });
}

module.exports = {
    todoValidation
}