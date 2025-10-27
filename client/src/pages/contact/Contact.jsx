/**
 * Contact.jsx
 * -----------------------------------------------------
 * Sierra Catalogue Contact Page
 *
 * Description:
 * - Displays a contact form with a contact info component.
 * - Contains links to our WhatsApp, instagram, and TikTok pages as well as our phone number and location.
 * - Also has a banner ("PageFlyer") introducing the contact section.
 *
 * Features:
 * - Sends contact form data to the database
 *
 * Dependencies:
 * - React (for component logic) & React Icons
 * - Custom components (PageFlyer, FormInput, Button, ContactStrip, and ContactStripElement)
 */

import React, { useState } from "react";
import PageFlyer from "../../component/PageFlyer.jsx";
import FormInput from "../../component/Form/FormComponents/FormInput.jsx";
import Button from "../../component/Button.jsx";
import ContactStrip from "./ContactStrip.jsx";
import ContactStripElement from "./ContactStripElemet.jsx";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { BiPhone } from "react-icons/bi";
import { MdLocationPin } from "react-icons/md";
import { toast } from "react-toastify";

const Contact = () => {
  // =========================================================
  // STATE MANAGEMENT
  // =========================================================
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    tel: "",
    message: "",
  }); // Stores the contact form data
  const [loading, setLoading] = useState(false); // Loading state

  // =========================================================
  // HANDLE CHANGE IN THE CONTACT FORM
  // =========================================================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // =========================================================
  // HANDLE SUBMIT OF THE CONTACT FORM
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.email ||
      !formData.tel ||
      !formData.message
    ) {
      return toast.error("Please fill in required fields.");
    }

    if (!/^0\d{8}$/.test(formData.tel) && !/^\+232\d{8}$/.test(formData.tel)) {
      return toast.error("Invalid phone number.");
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://sierra-catalogue.onrender.com/api/messages/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (res.ok) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          tel: "",
          message: "",
        });
        toast.success(data?.message);
      } else {
        toast.error(data?.error || "Failed to send message.");
      }
    } catch (err) {
      toast.error("Network error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RENDER CONTACT PAGE
  // =========================================================
  return (
    <div className="pb-10">
      {/* ======================== PAGE FLYER ======================== */}
      <PageFlyer
        heading="Contact Page"
        subheading="Got any questions on how the catalogue works or how to make your business stand out on our platform? We're here to help."
        size="50"
      />

      <h2 className="heading text-center my-4 md:my-6">Leave us a message</h2>

      {/* ======================== CONTACT FORM + CONTACT INFO ======================== */}
      <div className="container-fluid min-h-[80vh] grid items-center md:grid-cols-2 gap-8">
        {/* ======================== CONTACT FORM ======================== */}
        <form className="flex flex-col gap-4 md:ml-12" onSubmit={handleSubmit}>
          <div className="flex max-sm:flex-col items-center gap-6">
            <FormInput
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              autocomplete="given-name"
              onChange={handleChange}
              hasError={false}
            />
            <FormInput
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              autocomplete="family-name"
              onChange={handleChange}
              hasError={false}
            />
          </div>

          <FormInput
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            autocomplete="email"
            onChange={handleChange}
            hasError={false}
          />
          <FormInput
            type="phone"
            name="tel"
            placeholder="Phone"
            value={formData.tel}
            autocomplete="tel"
            onChange={handleChange}
            hasError={false}
          />

          <div className="flex flex-col gap-1">
            <label>Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder="Leave us a message..."
              className="p-3 rounded bg-black border border-gray-700 text-white focus:outline-none focus:border-amber-400 w-full"
            ></textarea>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send message"}
          </Button>
        </form>

        {/* ======================== CONTACT INFO ======================== */}
        <div className="flex flex-col justify-center gap-10 py-6 ml-3">
          <div className="flex flex-col gap-4">
            <ContactStrip
              heading={"Chat with us"}
              content={"Speak to our friendly team via live chat."}
            />
            <div className="flex flex-col gap-4">
              <ContactStripElement
                icon={<FaWhatsapp />}
                to={"https://wa.me/23276325542"}
                content={"Message us on WhatsApp"}
              />
              <ContactStripElement
                icon={<FaInstagram />}
                to={
                  "https://www.instagram.com/sierracatalogue?igsh=NTZ0eWdlc2luOHJ4"
                }
                content={"Get a hold us on instagram"}
              />
              <ContactStripElement
                icon={<FaTiktok />}
                to={"https://tiktok.com/@sierracatalogue"}
                content={"View our tiktok page"}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <ContactStrip
              heading={"Call us"}
              content={"Call our team Mon-Fri from 8am to 5pm."}
            />
            <ContactStripElement
              icon={<BiPhone />}
              to={"tel:+23276325542"}
              content={"+232 76 325 542"}
            />
          </div>

          <div className="flex flex-col gap-4">
            <ContactStrip
              heading={"Visit us"}
              content={"Chat to us in person at our HQ."}
            />
            <ContactStripElement
              icon={<MdLocationPin />}
              content={"7 Cole Street, Hamilton"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
