import React from 'react'
import { assets } from '../assets/assets';

export default function About() {
  return (
    
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 md:p-12">
      
        {/* Company Intro */}
        <section className="max-w-5xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 dark:text-pink-400">
            Over 4 Decades of Quality Service
          </h1>
          <p className="text-lg leading-relaxed">
            Sachdeva Roadlines was established in the early 1980s under 
            the leadership of our Founder & CMD Mr. Deepak Sachdeva. 
            With a vision to provide seamless and efficient 
            transportation solutions, we have grown into a trusted 
            logistics partner with a vast network across India.
          </p>
        </section>

        {/* Vision & Mission */}
        <section className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-3 text-blue-600">Vision</h2>
            <p>
              To provide industry-driven customer-focused innovative 
              transportation solutions and services, ensuring 
              cost-effectiveness and operational excellence.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-3 text-blue-600">Mission</h2>
            <p>
              To provide integrated transport services through a 
              network of branches across India, ensuring reliability 
              and timely deliveries for our customers.
            </p>
          </div>
        </section>

        {/* Door Delivery */}
        <section className="max-w-5xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-4 dark:text-cyan-600">Door Delivery Available To</h2>
          <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 grid md:grid-cols-3 gap-3 text-sm">
            <p>Anuppkattai, Attur, Bhavani, Bodi, Chinnamanur, Cochin...</p>
            <p>Madurai, Perundurai, Pallachi, Rasipuram, Rajapalayam...</p>
            <p>Thiruvallur, Thiruvananthapuram, Tiruchengode...</p>
          </div>
        </section>

        {/* Regional Offices */}
        <section className="max-w-5xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 dark:text-cyan-600">Regional Offices</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-blue-600">Mumbai</h3>
              <p>Room No. 384, Central Facility Building No. 2, Sector-19, Vashi</p>
              <p>📞 9326623927, 9322167184, 9820935095</p>
              <p>📧 mumbai@sachdevaroadlines.com</p>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-blue-600">Bangalore</h3>
              <p>24/2, J.C. Road, 1st Cross, Bangalore - 560027</p>
              <p>📞 080-41412718, 4141235, 41204044</p>
              <p>📧 bangalore@sachdevaroadlines.com</p>
            </div>
          </div>
        </section>

        {/* Award Section */}
        <section className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 dark:text-cyan-600">Achievements</h2>
          <div className="flex flex-col items-center gap-5 bg-white dark:bg-gray-800 shadow rounded-2xl p-5">
            <img
              src={assets.award} 
              alt="CMD receiving award"
              className="w-full h-full object-cover rounded-lg shadow"
            />
            <p className="text-md">
              Our CMD, Mr. Deepak Sachdeva, receiving the{" "}
              <strong>AITWA Award</strong> from Hon. Minister 
              Nitin Gadkari on <em>8th May, 2015</em> for outstanding 
              contributions in the field of Road Transport & Highways.
            </p>
          </div>
        </section>

      </div>
  );
};
