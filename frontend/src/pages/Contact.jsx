import Navbar from "../components/Navbar";
import "../styles/Contact.css";

function Contact() {
  return (
    <>
      <Navbar />

      <div className="contact-page">

        <h1>📞 Contact Us</h1>

        <p>
          We'd love to hear your feedback and answer your questions.
        </p>

        <div className="contact-card">

          <div className="contact-item">
            <h2>📧 Email</h2>
            <p>support@agrivision.com</p>
          </div>

          <div className="contact-item">
            <h2>📱 Phone</h2>
            <p>+91 98765 43210</p>
          </div>

          <div className="contact-item">
            <h2>📍 Address</h2>
            <p>Chennai, Tamil Nadu, India</p>
          </div>

          <div className="contact-item">
            <h2>🌐 Website</h2>
            <p>www.agrivision.com</p>
          </div>

        </div>

      </div>
    </>
  );
}

export default Contact;