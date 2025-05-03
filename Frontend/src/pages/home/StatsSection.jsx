import React from 'react';
import CountUp from 'react-countup';

const StatsSection = () => {
  return (
    <section className="xl:px-24 px-4 container shadow-md hover:shadow-2xl border border-green-500 rounded-lg mx-auto py-4">
      <div className="">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-6">
            <CountUp end={1000} duration={10} className="text-4xl font-bold text-green-500" />
            <span className="text-4xl font-bold text-green-500">+</span>
            <p className="mt-2 text-gray-900">Happy Students</p>
          </div>
          <div className="p-6">
            <CountUp end={250} duration={10} className="text-4xl font-bold text-green-500" />
            <span className="text-4xl font-bold text-green-500">+</span>
            <p className="mt-2 text-gray-900">Verified Properties</p>
          </div>
          <div className="p-6">
            <CountUp end={15} duration={10} className="text-4xl font-bold text-green-500" />
            <span className="text-4xl font-bold text-green-500">+</span>
            <p className="mt-2 text-gray-900">Property Owners</p>
          </div>
          <div className="p-6">
            <CountUp end={24} duration={10} suffix="hr" className="text-4xl font-bold text-green-500" />
            <span className="text-4xl font-bold text-green-500">+</span>
            <p className="mt-2 text-gray-900">Average Move-in Time</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;