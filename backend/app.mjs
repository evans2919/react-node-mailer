import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import removeAccents from "remove-accents";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
const storage = multer.memoryStorage(); // Almacena el archivo en memoria
const upload = multer({ storage: storage });

app.post("/send-email", upload.single("attachment"), async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    let mailAttachment = [];
    const attachment = req.file;

    if (attachment) {
      const sanitizedFileName = removeAccents(attachment.originalname);
      const fileContent = attachment.buffer;
      mailAttachment = {
        filename: sanitizedFileName,
        content: fileContent,
      };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      attachments: mailAttachment,
    };

    await transporter.sendMail(mailOptions);

    if (attachment) {
      attachment.buffer = null;
    }

    res.status(200).send("Correo enviado exitosamente");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).send("Error al enviar el correo");
  }
});

const PORT = process.env.BACKEND_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
