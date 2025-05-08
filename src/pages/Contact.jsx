// import React, { useState } from "react";

// export default function Contact() {
//   const [form, setForm] = useState({ name: "", email: "", message: "" });
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const validateEmail = (email) => {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return regex.test(email);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newErrors = {};

//     if (!form.name.trim()) newErrors.name = "Name is required";
//     if (!form.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!validateEmail(form.email)) {
//       newErrors.email = "Email is not valid";
//     }
//     if (!form.message.trim()) newErrors.message = "Message is required";

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       console.log("Sending message:", form);
//       // TODO: POST request to backend here
//     }
//   };

//   return (
//     <div
//       className="background-default font-pixel text-black items-center p-8 text-center"
//       style={{ backgroundImage: "url('/backgrounds/contact.webp')" }}
//     >
//       <div className="max-w-full text-center lg:mx-80 mt-16 bg-white/10 p-4 rounded-lg border-4 border-white shadow-lg">
//         <h2 className="text-4xl font-bold text-center mb-2">Contact Me</h2>
//         <p className="text-center text-black text-lg mb-6">
//           Or just drop an email at <a href="mailto:hello@tibcso.dev" className="underline hover:text-green-400">szalontai.tib@gmail.com</a>
//         </p>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="name" className="block mb-2 text-lg">
//               Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border-2 border-black rounded bg-white text-black"
//             />
//             {errors.name && <p className="text-red-400 mt-1">{errors.name}</p>}
//           </div>
//           <div>
//             <label htmlFor="email" className="block mb-2 text-lg">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border-2 border-black rounded bg-white text-black"
//             />
//             {errors.email && <p className="text-red-400 mt-1">{errors.email}</p>}
//           </div>
//           <div>
//             <label htmlFor="message" className="block mb-2 text-lg">
//               Message
//             </label>
//             <textarea
//               id="message"
//               name="message"
//               rows="4"
//               value={form.message}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border-2 border-black rounded bg-white text-black"
//             ></textarea>
//             {errors.message && <p className="text-red-400 mt-1">{errors.message}</p>}
//           </div>
//           <button
//             type="submit"
//             className="bg-green-600 text-white font-bold text-sm px-6 py-2 border-4 border-black rounded-full shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black] transition-all"
//           >
//             Send Message
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Email is not valid";
    }
    if (!form.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch("https://portfolio-backend-two-lemon.vercel.app/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (response.ok) {
          setSuccess(true);
          setForm({ name: "", email: "", message: "" });
        } else {
          console.error("Server error:", await response.json());
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
  };

  return (
    <div
      className="background-default min-h-screen font-pixel text-white flex items-center justify-center p-6"
      style={{ backgroundImage: "url('/backgrounds/contact.webp')" }}
    >
      <div className="w-full max-w-2xl bg-white/10 p-8 rounded-lg border-4 border-white shadow-lg">
        <h2 className="text-4xl font-bold text-center mb-2">Contact Me</h2>
        <p className="text-center text-white text-lg mb-6">
          Or just drop an email at <a href="mailto:hello@tibcso.dev" className="underline hover:text-green-400">hello@tibcso.dev</a>
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-lg">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-black rounded bg-white text-black"
            />
            {errors.name && <p className="text-red-400 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-lg">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-black rounded bg-white text-black"
            />
            {errors.email && <p className="text-red-400 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="message" className="block mb-2 text-lg">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-black rounded bg-white text-black"
            ></textarea>
            {errors.message && <p className="text-red-400 mt-1">{errors.message}</p>}
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white font-bold text-sm px-6 py-2 border-4 border-black rounded-full shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black] transition-all"
          >
            Send Message
          </button>
        </form>
        {success && <p className="text-green-400 mt-4 text-center">Thanks! Your message has been sent.</p>}
      </div>
    </div>
  );
}
