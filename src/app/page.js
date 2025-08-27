"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="font-sans min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 md:px-12 lg:px-20 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-blue-600">Heal Link</h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-blue-600 font-medium relative group overflow-hidden">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>
          
          <Link href="#doctors" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 relative group overflow-hidden">
            Doctors
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>
          <Link href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 relative group overflow-hidden">
            Reviews
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>
          <Link href="#about" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 relative group overflow-hidden">
            Our Story
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-500 group-hover:w-full"></span>
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            className="text-blue-600 focus:outline-none" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <button className="hidden md:block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 hover:shadow-lg font-medium">
          Get Started
        </button>
      </header>

      {/* Mobile Menu - Slide Transition */}
      <div 
        className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-20 md:hidden transition-opacity duration-700 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>
      
      <div 
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-30 md:hidden transform transition-all duration-700 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 transition-all duration-500" style={{opacity: mobileMenuOpen ? '1' : '0', transitionDelay: '300ms'}}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-blue-600">Heal Link</h2>
            <button 
              className="text-gray-500 hover:text-gray-700" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-blue-600 py-2 border-b border-gray-100 transition-all duration-500 hover:pl-2 hover:font-medium transform translate-x-0"
              onClick={() => setMobileMenuOpen(false)}
              style={{opacity: mobileMenuOpen ? '1' : '0', transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(50px)', transitionDelay: '400ms'}}
            >
              Dashboard
            </Link>
            <Link 
              href="#about" 
              className="text-gray-600 hover:text-blue-600 py-2 border-b border-gray-100 transition-all duration-500 hover:pl-2 hover:font-medium"
              onClick={() => setMobileMenuOpen(false)}
              style={{opacity: mobileMenuOpen ? '1' : '0', transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(50px)', transitionDelay: '500ms'}}
            >
              Our Story
            </Link>
            <Link 
              href="#doctors" 
              className="text-gray-600 hover:text-blue-600 py-2 border-b border-gray-100 transition-all duration-500 hover:pl-2 hover:font-medium"
              onClick={() => setMobileMenuOpen(false)}
              style={{opacity: mobileMenuOpen ? '1' : '0', transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(50px)', transitionDelay: '600ms'}}
            >
              Specialists
            </Link>
            <Link 
              href="#testimonials" 
              className="text-gray-600 hover:text-blue-600 py-2 border-b border-gray-100 transition-all duration-500 hover:pl-2 hover:font-medium"
              onClick={() => setMobileMenuOpen(false)}
              style={{opacity: mobileMenuOpen ? '1' : '0', transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(50px)', transitionDelay: '700ms'}}
            >
              Reviews
            </Link>
          </nav>
          
          <button 
            className="mt-8 w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all duration-500 hover:shadow-lg font-medium"
            style={{opacity: mobileMenuOpen ? '1' : '0', transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '800ms'}}
          >
            Get Started
          </button>
        </div>
      </div>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-20 px-6 md:px-12 lg:px-20">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                Smart Healthcare <span className="text-blue-600">Appointment Booking</span> Made Simple
              </h2>
              <p className="text-lg text-gray-600">
                Book appointments with top doctors, manage your healthcare schedule, and receive timely reminders - all in one place.
              </p>
              <div className="flex gap-4 pt-4">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors font-medium">
                  Book Now
                </button>
                <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition-colors font-medium">
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-blue-200 rounded-full p-8 w-80 h-80 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 md:px-12 lg:px-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-blue-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Appointment Booking</h3>
                <p className="text-gray-600">Book appointments with your preferred doctors in just a few clicks. Choose your convenient time slot and get instant confirmation.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-blue-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Last-Minute Shift Swaps</h3>
                <p className="text-gray-600">Need to reschedule? Our system allows for easy last-minute appointment changes with minimal disruption to your schedule.</p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-blue-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Patient Feedback</h3>
                <p className="text-gray-600">Share your experience and provide valuable feedback to help improve healthcare services and assist other patients.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Doctors Section */}
        <section id="doctors" className="py-20 px-6 md:px-12 lg:px-20 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Doctors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Doctor 1 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-blue-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">Dr. Sarah Johnson</h3>
                  <p className="text-blue-600 mb-2">Cardiologist</p>
                  <p className="text-gray-600 text-sm">Specializing in heart health with over 10 years of experience in treating cardiovascular conditions.</p>
                </div>
              </div>
              
              {/* Doctor 2 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-blue-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">Dr. Michael Chen</h3>
                  <p className="text-blue-600 mb-2">Neurologist</p>
                  <p className="text-gray-600 text-sm">Expert in neurological disorders with a focus on innovative treatment approaches for complex cases.</p>
                </div>
              </div>
              
              {/* Doctor 3 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-blue-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">Dr. Emily Rodriguez</h3>
                  <p className="text-blue-600 mb-2">Pediatrician</p>
                  <p className="text-gray-600 text-sm">Dedicated to children's health with a gentle approach that puts young patients at ease during visits.</p>
                </div>
              </div>
              
              {/* Doctor 4 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-blue-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">Dr. James Wilson</h3>
                  <p className="text-blue-600 mb-2">Orthopedic Surgeon</p>
                  <p className="text-gray-600 text-sm">Specializing in sports medicine and joint replacement with a focus on minimally invasive procedures.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 px-6 md:px-12 lg:px-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Patients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-blue-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow relative">
                <div className="text-blue-600 text-4xl absolute top-4 left-4 opacity-20">
                  &#8220;
                </div>
                <div className="pt-6">
                  <p className="text-gray-600 mb-4">Heal Link has completely transformed how I manage my healthcare. Booking appointments is now quick and hassle-free. I love the reminder feature!</p>
                  <div className="flex items-center">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold">JD</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">John Doe</h4>
                      <p className="text-sm text-gray-500">Patient</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-blue-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow relative">
                <div className="text-blue-600 text-4xl absolute top-4 left-4 opacity-20">
                  &#8220;
                </div>
                <div className="pt-6">
                  <p className="text-gray-600 mb-4">As someone with a busy schedule, I appreciate how easy it is to reschedule appointments when needed. The interface is intuitive and user-friendly.</p>
                  <div className="flex items-center">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold">AS</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Amanda Smith</h4>
                      <p className="text-sm text-gray-500">Patient</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-blue-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow relative">
                <div className="text-blue-600 text-4xl absolute top-4 left-4 opacity-20">
                  &#8220;
                </div>
                <div className="pt-6">
                  <p className="text-gray-600 mb-4">Being able to see doctor profiles and specialties before booking has helped me find the right healthcare professionals for my specific needs.</p>
                  <div className="flex items-center">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold">RJ</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Robert Johnson</h4>
                      <p className="text-sm text-gray-500">Patient</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* About Us Section */}
        <section id="about" className="py-20 px-6 md:px-12 lg:px-20 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6">About Heal Link</h2>
                <p className="text-gray-600 mb-4">
                  Heal Link was founded with a simple mission: to make healthcare more accessible and efficient for everyone. We believe that managing your health should be as simple as a few clicks.
                </p>
                <p className="text-gray-600 mb-4">
                  Our platform connects patients with qualified healthcare professionals, streamlining the appointment booking process and eliminating unnecessary wait times and administrative hassles.
                </p>
                <p className="text-gray-600">
                  With features designed for both patients and healthcare providers, Heal Link is transforming the healthcare experience one appointment at a time.
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="bg-blue-100 rounded-lg p-8 w-full max-w-md">
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">Our Benefits</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Save time with quick online booking</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Access to verified healthcare professionals</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Receive appointment reminders</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Manage your medical history securely</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-blue-600 text-white py-12 px-6 md:px-12 lg:px-20 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Heal Link</h3>
              <p className="text-blue-100">Smart healthcare appointment booking system that puts patients first.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-blue-100 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="#about" className="text-blue-100 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#doctors" className="text-blue-100 hover:text-white transition-colors">Doctors</Link></li>
                <li><Link href="#testimonials" className="text-blue-100 hover:text-white transition-colors">Testimonials</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@heallink.com</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-100 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="text-blue-100 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="text-blue-100 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-500 mt-8 pt-8 text-center text-blue-100">
            <p>&copy; {new Date().getFullYear()} Heal Link. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
