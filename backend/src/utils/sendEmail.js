//fake log, connect Nodemailer latter
const sendEmail = async (to, message) => {
    console.log(`Sending email to ${to}: ${message}`);
  };
  
  export default sendEmail;
  