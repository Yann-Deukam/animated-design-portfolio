import ContactForm from "@/components/ContactForm";
import WorldMap from "@/components/WorldMap";


export default function Contactn() {
  return (
    <section
      id="contact"
      className="bg-olive-950 px-6 py-24 text-amber-50 md:px-14 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="mb-6 text-5xl font-medium tracking-[-0.045em] md:text-6xl">
            From all around the world
          </h2>
          <p className="mb-12 max-w-md text-lg leading-relaxed text-amber-50/70">
            Clients reach us from every continent. Wherever your project starts,
            it lands with us in Cameroon.
          </p>
          <WorldMap />
        </div>

        <ContactForm />
      </div>
    </section>
  );
}