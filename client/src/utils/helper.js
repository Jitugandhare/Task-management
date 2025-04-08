export const addThousandsSeparator = (num) => {
    if (num == null || isNaN(num)) return "0";  // Return "0" for invalid inputs

    // Convert the number to a string and split it into integer and fractional parts
    const [integerPart, fractionalPart] = num.toString().split(".");

    // Format the integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Combine the integer part with the fractional part if it exists
    return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger;
};
