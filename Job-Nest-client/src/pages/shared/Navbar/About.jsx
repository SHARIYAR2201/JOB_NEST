import React from "react";
import { motion } from "framer-motion";

const images = [
  {
    src: "https://ibb.co.com/qLPPngP5",
    caption: "Innovating for a better tomorrow",
  },
  {
    src: "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=800&q=80",
    caption: "Turning ideas into reality",
  },
  {
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    caption: "Where talent meets opportunity",
  },
  {
    src: "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=800&q=80",
    caption: "Breaking barriers together",
  },
  {
    src: "https://images.unsplash.com/photo-1581091012184-5c64a4a43f4c?auto=format&fit=crop&w=800&q=80",
    caption: "Crafting the future of work",
  },
  {
    src: "https://images.unsplash.com/photo-1581093588401-3b88364c0172?auto=format&fit=crop&w=800&q=80",
    caption: "Driven by passion, powered by skill",
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    caption: "Collaboration at its finest",
  },
  {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    caption: "Engineering dreams into reality",
  },
  {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    caption: "Empowering professionals globally",
  },
  {
    src: "https://images.unsplash.com/photo-1580894908361-967195033ad8?auto=format&fit=crop&w=800&q=80",
    caption: "Shaping careers, changing lives",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 font-sans text-center">
      {/* Title */}
      <motion.h1
        className="text-4xl font-bold mb-6 text-gray-200"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        About JOB-NEST
      </motion.h1>

      {/* Intro Text */}
      <motion.p
        className="text-gray-300 mb-10 leading-relaxed"
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3, duration: 1 }}
        variants={fadeInUp}
      >
        JOB-NEST was founded with a mission to bridge the gap between talent and
        opportunity. Since our inception, we have connected thousands of job
        seekers with leading companies across the globe. Our platform is
        designed to simplify recruitment, foster professional growth, and
        empower individuals to achieve their career goals.
        <br />
        <br />
        From humble beginnings, we’ve grown into a trusted platform for
        employers and candidates alike, offering tools for job posting,
        candidate tracking, and career advice. With our commitment to
        innovation, we continue to evolve, integrating the latest technology to
        make recruitment smarter and more efficient.
      </motion.p>

      {/* Images Section */}
      <motion.h2
        className="text-2xl font-semibold mb-4 text-gray-200"
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
        variants={fadeInUp}
      >
        Our Journey in Pictures
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16"
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6, duration: 1 }}
        variants={fadeInUp}
      >
        {images.map((item, index) => (
          <motion.div
            key={index}
            className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={item.src}
              alt={`Company milestone ${index + 1}`}
              className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center px-4 text-center transition-opacity duration-300">
              <p className="text-white text-sm font-medium">{item.caption}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Achievements */}
      <motion.h2
        className="text-2xl font-semibold mb-4 text-gray-200"
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.8 }}
        variants={fadeInUp}
      >
        Our Achievements
      </motion.h2>
      <motion.ul
        className="list-disc list-inside text-gray-300 mb-12 space-y-2 text-left mx-auto max-w-xl"
        initial="hidden"
        animate="visible"
        transition={{ delay: 1 }}
        variants={fadeInUp}
      >
        <li>
          Over <span className="font-semibold text-white">1 Million+</span>{" "}
          successful job placements worldwide.
        </li>
        <li>
          Trusted by{" "}
          <span className="font-semibold text-white">5000+ global companies</span>{" "}
          for hiring top talent.
        </li>
        <li>
          Awarded as one of the{" "}
          <span className="font-semibold text-white">
            Top Emerging Job Portals of 2024
          </span>
          .
        </li>
        <li>
          Recognized for our commitment to{" "}
          <span className="font-semibold text-white">
            innovation in recruitment technology
          </span>
          .
        </li>
      </motion.ul>

      {/* Location */}
      <motion.h2
        className="text-2xl font-semibold mb-4 text-gray-200"
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.2 }}
        variants={fadeInUp}
      >
        Our Headquarters
      </motion.h2>
      <motion.div
        className="flex flex-col md:flex-row items-center mb-12 gap-6"
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.4, duration: 1 }}
        variants={fadeInUp}
      >
        <img
          src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80"
          alt="JobNest Office"
          className="rounded-lg shadow-lg w-full md:w-1/2 h-72 object-cover"
        />
        <div className="text-gray-300 md:w-1/2 text-left">
          <p className="leading-relaxed">
            Our main office is located in the heart of Dhaka, Bangladesh – a hub
            of innovation and business growth. This modern workspace reflects
            our values of transparency, creativity, and collaboration.
          </p>
          <p className="mt-4">
            <span className="font-semibold text-white">Address:</span> 12th
            Floor, Tech Valley Tower, Gulshan-1, Dhaka, Bangladesh
          </p>
        </div>
      </motion.div>

      {/* Contact */}
      <motion.h2
        className="text-2xl font-semibold mb-4 text-gray-200"
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.6 }}
        variants={fadeInUp}
      >
        Contact Us
      </motion.h2>
      <motion.div
        className="text-gray-300 space-y-2 mb-12"
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.8 }}
        variants={fadeInUp}
      >
        <p>
          <span className="font-semibold text-white">Email:</span>{" "}
          support@jobnest.com
        </p>
        <p>
          <span className="font-semibold text-white">Phone:</span> +880 1234 567
          890
        </p>
        <p>
          <span className="font-semibold text-white">Office Hours:</span> Sunday
          – Thursday, 9:00 AM – 6:00 PM
        </p>
      </motion.div>

      {/* Closing Note */}
      <motion.div
        className="bg-gray-800 rounded-xl shadow-lg p-6 mt-8"
        initial="hidden"
        animate="visible"
        transition={{ delay: 2, duration: 1 }}
        variants={fadeInUp}
      >
        <p className="text-gray-300 leading-relaxed">
          At <span className="font-semibold text-white">JOB-NEST</span>, we
          believe in more than just finding jobs – we believe in building
          futures. With a vision to empower professionals globally, we continue
          to transform the way people connect, grow, and succeed. Together, we
          are shaping a better tomorrow where opportunities know no boundaries.
        </p>
      </motion.div>
    </div>
  );
};

export default About;
