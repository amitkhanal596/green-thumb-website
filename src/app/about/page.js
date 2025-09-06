'use client';

import Header from '@/components/Header';
import CartSidebar from '@/components/CartSidebar';
import Footer from '@/components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="about" />
      
      {/* Hero Section */}
      <div className="bg-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-7xl font-light text-black">About</h1>
            <div className="w-px bg-gray-400 h-12"></div>
            <p className="text-black">Growing green spaces, nurturing plant lovers</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-black mb-4">Our Story</h2>
            <div className="w-24 h-px bg-green-600 mx-auto"></div>
          </div>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="text-xl leading-relaxed mb-6">
              Founded in 2020, Green Thumb began as a passion project between two plant enthusiasts 
              who believed everyone deserves to experience the joy and tranquility that plants bring to our lives.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              What started as a small collection of rescued plants in our garage has grown into a thriving 
              community of plant lovers. We carefully source our plants from trusted growers and nurseries, 
              ensuring each plant arrives healthy and ready to flourish in its new home.
            </p>
            <p className="text-lg leading-relaxed">
              Our mission is simple: to make plant parenthood accessible, enjoyable, and successful for 
              everyone, whether you're a seasoned green thumb or just beginning your plant journey.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-black mb-4">Our Values</h2>
            <div className="w-24 h-px bg-green-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black mb-3">Quality First</h3>
              <p className="text-gray-600">Every plant is hand-selected and carefully inspected before shipping to ensure the highest quality.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black mb-3">Community</h3>
              <p className="text-gray-600">We're building a supportive community where plant lovers can learn, grow, and share their passion.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black mb-3">Sustainability</h3>
              <p className="text-gray-600">We're committed to sustainable practices and supporting eco-friendly growing methods.</p>
            </div>
          </div>
        </div>


        {/* Call to Action */}
        <div className="text-center py-12 bg-stone-50 rounded-lg">
          <h2 className="text-3xl font-light text-black mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl text-gray-600 mb-8">Start your plant journey with expert guidance and premium quality plants.</p>
          <a 
            href="/"
            className="bg-green-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-green-700 transition-colors inline-block"
          >
            Shop Plants
          </a>
        </div>
      </div>

      <CartSidebar />
      <Footer />
    </div>
  );
}