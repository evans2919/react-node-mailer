import { useState } from "react";

const EmailForm = () => {
  const [emailData, setEmailData] = useState({
    to: "evans@evans.com",
    subject: "test",
    html: "hola",
    attachments: "",
  });

  const handleChange = (e) => {
    if (e.target.name === "attachments") {
      const files = e.target.files;
      setEmailData({
        ...emailData,
        attachments: files,
      });
    } else {
      setEmailData({
        ...emailData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("to", emailData.to);
      formData.append("subject", emailData.subject);
      formData.append("html", emailData.html);
      formData.append("attachment", emailData.attachments[0]); // Cambiado a "attachment"

      const response = await fetch("http://localhost:3001/send-email", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Correo enviado exitosamente");
      } else {
        console.error("Error al enviar el correo", response);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };
  return (
    <div>
      <h2>Formulario de Correo Electrónico con Archivos Adjuntos</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Para:
          <br />
          <input
            type="email"
            name="to"
            value={emailData.to}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <br />

        <label>
          Asunto:
          <br />
          <input
            type="text"
            name="subject"
            value={emailData.subject}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <br />
        <label>
          Contenido HTML:
          <br />
          <textarea
            name="html"
            value={emailData.html}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <br />
        <label>
          Adjuntar Archivos:
          <br />
          <input
            type="file"
            name="attachments"
            onChange={handleChange}
            multiple
          />
        </label>
        <br />
        <br />
        <button type="submit">Enviar Correo</button>
      </form>
    </div>
  );
};

export default EmailForm;
