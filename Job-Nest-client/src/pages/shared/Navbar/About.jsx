import React from "react";

const images = [
  {
    src: "https://ibb.co.com/qLPPngP5",
    caption: "Innovating for a better tomorrow"
  },
  {
    src: "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=800&q=80",
    caption: "Turning ideas into reality"
  },
  {
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    caption: "Where talent meets opportunity"
  },
  {
    src: "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=800&q=80",
    caption: "Breaking barriers together"
  },
  {
    src: "https://images.unsplash.com/photo-1581091012184-5c64a4a43f4c?auto=format&fit=crop&w=800&q=80",
    caption: "Crafting the future of work"
  },
  {
    src: "https://images.unsplash.com/photo-1581093588401-3b88364c0172?auto=format&fit=crop&w=800&q=80",
    caption: "Driven by passion, powered by skill"
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    caption: "Collaboration at its finest"
  },
  {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    caption: "Engineering dreams into reality"
  },
  {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    caption: "Empowering professionals globally"
  },
  {
    src: "https://images.unsplash.com/photo-1580894908361-967195033ad8?auto=format&fit=crop&w=800&q=80",
    caption: "Shaping careers, changing lives"
  }
];

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans">
      <h1 className="text-4xl font-bold mb-6 text-gray-200">About JOB-NEST</h1>
      <p className="text-gray-300 mb-10 leading-relaxed">
        JOB-NEST was founded with a mission to bridge the gap between talent and opportunity. 
        Since our inception, we have connected thousands of job seekers with leading companies 
        across the globe. Our platform is designed to simplify recruitment, foster professional 
        growth, and empower individuals to achieve their career goals. 
        <br /><br />
        From humble beginnings, we’ve grown into a trusted platform for employers and 
        candidates alike, offering tools for job posting, candidate tracking, and career advice. 
        With our commitment to innovation, we continue to evolve, integrating the latest 
        technology to make recruitment smarter and more efficient.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-200">Our Journey in Pictures</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((item, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group"
          >
            <img
              src={item.src}
              alt={`Company milestone ${index + 1}`}
              className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center px-4 text-center transition-opacity duration-300">
              <p className="text-white text-sm font-medium">{item.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
