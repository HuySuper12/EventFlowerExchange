import Header from "../../../component/header";
import Footer from "../../../component/footer";

const About = () => {
  return (
    <>
      <Header />

      <div className="container mx-auto p-6 ml-[280px] w-[1200px]">
        <h1 className="text-3xl font-bold mb-4 text-center">About Us</h1>
        <p className="mb-4">
          Welcome to [Store Name], your premier online destination for beautiful
          flowers and arrangements. Our mission is to bring joy and elegance to
          every occasion through our carefully curated selection of fresh
          blooms.
        </p>
        <h2 className="text-2xl font-semibold mb-2">Our Story</h2>
        <p className="mb-4">
          Established in [Year], we started as a small local flower shop with a
          passion for floral design. Over the years, we have grown into a
          trusted name in the industry, known for our commitment to quality and
          customer satisfaction. Our team of skilled florists works tirelessly
          to create stunning arrangements for weddings, events, and everyday
          celebrations.
        </p>
        <h2 className="text-2xl font-semibold mb-2">Our Values</h2>
        <ul className="ml-6 mb-4">
          <li className="none">
            Quality: We source the freshest flowers from local growers.
          </li>
          <li>
            Customer Satisfaction: We strive to exceed our customers
            expectations.
          </li>
          <li>
            Sustainability: We are committed to eco-friendly practices in our
            sourcing and packaging.
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mb-2">Why Choose Us?</h2>
        <p className="mb-4">
          At [Store Name], we believe that flowers can brighten any day. Whether
          you are looking for a simple bouquet or an elaborate floral
          arrangement, we have something for everyone. Our easy-to-use online
          platform allows you to browse our collection and place your orders
          with ease. Plus, we offer same-day delivery in select areas to ensure
          your flowers arrive fresh and on time.
        </p>
        <h2 className="text-2xl font-semibold mb-2">Get in Touch</h2>
        <p>
          We would love to hear from you! If you have any questions or feedback,
          please feel free to contact us through our{" "}
          <a href="/contact" className="text-blue-500">
            Contact Us
          </a>{" "}
          page.
        </p>
      </div>

      <Footer />
    </>
  );
};

export default About;
