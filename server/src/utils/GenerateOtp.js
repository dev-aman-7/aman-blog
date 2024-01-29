export const generateOtp = () => {
  const generatedOTP = Math.floor(100000 + Math.random() * 900000);
  return generatedOTP;
};
