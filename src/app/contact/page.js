'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import CartSidebar from '@/components/CartSidebar';
import Footer from '@/components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="contact" />
      
      {/* Hero Section */}
      <div className="bg-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-7xl font-light text-black">Contact</h1>
            <div className="w-px bg-gray-400 h-12"></div>
            <p className="text-black">We're here to help with all your plant needs</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <div className="mb-8">
              <h2 className="text-4xl font-light text-black mb-4">Get In Touch</h2>
              <div className="w-24 h-px bg-green-600"></div>
              <p className="text-gray-600 mt-6">
                Have a question about plant care? Need help choosing the right plant? 
                We'd love to hear from you! Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-black mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="plant-care">Plant Care Question</option>
                  <option value="order-inquiry">Order Inquiry</option>
                  <option value="plant-recommendation">Plant Recommendation</option>
                  <option value="shipping">Shipping Question</option>
                  <option value="return-exchange">Return/Exchange</option>
                  <option value="general">General Question</option>
                  <option value="partnership">Partnership Inquiry</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div className="mb-8">
              <h2 className="text-4xl font-light text-black mb-4">Contact Information</h2>
              <div className="w-24 h-px bg-green-600"></div>
            </div>

            <div className="space-y-8">
              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-black mb-2">Email</h3>
                  <p className="text-gray-600">hello@greenthumb.com</p>
                  <p className="text-gray-600">support@greenthumb.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-black mb-2">Phone</h3>
                  <p className="text-gray-600">(555) 123-PLANT</p>
                  <p className="text-sm text-gray-500">Monday - Friday: 9AM - 6PM EST</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-black mb-2">Address</h3>
                  <p className="text-gray-600">
                    123 Garden Lane<br />
                    Plant City, CA 94102<br />
                    United States
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="mt-12 p-6 bg-stone-50 rounded-lg">
              <h3 className="text-xl font-medium text-black mb-3">Quick Answers</h3>
              <p className="text-gray-600 mb-4">
                Looking for immediate answers? Check out our frequently asked questions.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">• Shipping & Delivery Information</p>
                <p className="text-sm text-gray-600">• Plant Care Instructions</p>
                <p className="text-sm text-gray-600">• Return & Exchange Policy</p>
                <p className="text-sm text-gray-600">• Plant Guarantee Terms</p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-xl font-medium text-black mb-3">Business Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="text-black font-medium">9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="text-black font-medium">10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="text-black font-medium">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CartSidebar />
      <Footer />
    </div>
  );
}