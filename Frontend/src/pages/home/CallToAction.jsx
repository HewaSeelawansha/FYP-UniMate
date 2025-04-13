import React from 'react';

const CallToAction = () => {
  return (
    <section className="py-16 bg-green text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Student Home?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of students who found their perfect accommodation through our platform
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-white text-green hover:bg-gray-100 px-8 py-3 rounded-full font-bold transition-colors duration-300">
            Browse Listings
          </button>
          <button className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3 rounded-full font-bold transition-colors duration-300">
            List Your Property
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;