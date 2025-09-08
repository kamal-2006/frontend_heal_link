"use client";
import Link from "next/link";
import TestimonialsCarousel from "./TestimonialsCarousel";
import { useState, useEffect } from "react";

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sectionIds = ["home", "doctors", "testimonials", "about"];
    const handleScroll = () => {
      let current = "home";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          current = id;
          break;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div className="font-sans min-h-screen flex flex-col scroll-smooth">
      {/* Header */}
      <header className="bg-white shadow-lg py-4 px-6 md:px-12 lg:px-20 flex justify-between items-center sticky top-0 z-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Heal Link</h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 relative">
          {[
            { id: "home", label: "Home", href: "#home" },
            { id: "doctors", label: "Doctors", href: "#doctors" },
            { id: "testimonials", label: "Reviews", href: "#testimonials" },
            { id: "about", label: "Our Story", href: "#about" },
          ].map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`relative font-medium transition-colors duration-300 group ${
                activeSection === item.id
                  ? "text-blue-700 font-semibold"
                  : "text-gray-700 hover:text-blue-700"
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-700 transition-all duration-500 ${
                  activeSection === item.id ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            className="text-blue-700 focus:outline-none" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <Link href="/login" className="hidden md:block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-xl font-semibold transform hover:scale-105">
          Get Started
        </Link>
      </header>
      {/* Mobile Menu - Slide Transition */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-700 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>
      
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-30 md:hidden transform transition-all duration-700 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 transition-all duration-500" style={{opacity: mobileMenuOpen ? '1' : '0', transitionDelay: '300ms'}}>
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Heal Link</h2>
            </div>
            <button 
              className="text-gray-600 hover:text-gray-800" 
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
              className="text-gray-700 hover:text-blue-700 py-3 border-b border-gray-200 transition-all duration-500 hover:pl-4 hover:font-semibold transform translate-x-0 font-medium"
              onClick={() => setMobileMenuOpen(false)}
              style={{opacity: mobileMenuOpen ? '1' : '0', transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(50px)', transitionDelay: '400ms'}}
            >
              Home
            </Link>
            <Link 
              href="#about" 
              className="text-gray-700 hover:text-blue-700 py-3 border-b border-gray-200 transition-all duration-500 hover:pl-4 hover:font-semibold font-medium"
              onClick={() => setMobileMenuOpen(false)}
              style={{opacity: mobileMenuOpen ? '1' : '0', transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(50px)', transitionDelay: '500ms'}}
            >
              Our Story
            </Link>
            <Link 
              href="#doctors" 
              className="text-gray-700 hover:text-blue-700 py-3 border-b border-gray-200 transition-all duration-500 hover:pl-4 hover:font-semibold font-medium"
              onClick={() => setMobileMenuOpen(false)}
              style={{opacity: mobileMenuOpen ? '1' : '0', transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(50px)', transitionDelay: '600ms'}}
            >
              Doctors
            </Link>
            <Link 
              href="#testimonials" 
              className="text-gray-700 hover:text-blue-700 py-3 border-b border-gray-200 transition-all duration-500 hover:pl-4 hover:font-semibold font-medium"
              onClick={() => setMobileMenuOpen(false)}
              style={{opacity: mobileMenuOpen ? '1' : '0', transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(50px)', transitionDelay: '700ms'}}
            >
              Reviews
            </Link>
          </nav>
          
          <Link
            href="/login"
            className="mt-8 block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-500 hover:shadow-xl font-semibold text-center transform hover:scale-105"
            style={{opacity: mobileMenuOpen ? '1' : '0', transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '800ms'}}
          >
            Get Started
          </Link>
        </div>
      </div>

      <main>
        {/* Hero Section */}
        <section id="home" className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24 px-6 md:px-12 lg:px-20 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
            <div className="md:w-1/2 space-y-8">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Smart Healthcare{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Appointment Booking
                </span>{" "}
                Made Simple
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                Book appointments with top doctors, manage your healthcare schedule, and receive timely reminders - all in one beautifully designed platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link 
                  href="/login" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-xl font-semibold text-lg transform hover:scale-105"
                >
                  Book Now
                </Link>
                <button className="border-2 border-blue-600 text-blue-700 px-10 py-4 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold text-lg transform hover:scale-105">
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative z-20">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-12 w-96 h-96 flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-48 w-48 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-400 rounded-full opacity-80 animate-pulse z-30"></div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-400 rounded-full opacity-80 animate-pulse delay-1000 z-30"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 md:px-12 lg:px-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover what makes Heal Link the perfect choice for managing your healthcare appointments</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Easy Appointment Booking</h3>
                <p className="text-gray-700 leading-relaxed">Book appointments with your preferred doctors in just a few clicks. Choose your convenient time slot and get instant confirmation.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Flexible Scheduling</h3>
                <p className="text-gray-700 leading-relaxed">Need to reschedule? Our system allows for easy last-minute appointment changes with minimal disruption to your schedule.</p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Patient Feedback</h3>
                <p className="text-gray-700 leading-relaxed">Share your experience and provide valuable feedback to help improve healthcare services and assist other patients.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Doctors Section */}
        <section id="doctors" className="py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Doctors</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Our team of experienced healthcare professionals is here to provide you with the best medical care</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Doctor 1 */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="h-64 bg-gradient-to-br from-blue-400 to-blue-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Dr. Sarah Johnson</h3>
                  <p className="text-blue-600 font-semibold mb-3">Cardiologist</p>
                  <p className="text-gray-600 leading-relaxed">Specializing in heart health with over 10 years of experience in treating cardiovascular conditions.</p>
                </div>
              </div>
              
              {/* Doctor 2 */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="h-64 bg-gradient-to-br from-purple-400 to-purple-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Dr. Michael Chen</h3>
                  <p className="text-purple-600 font-semibold mb-3">Neurologist</p>
                  <p className="text-gray-600 leading-relaxed">Expert in neurological disorders with a focus on innovative treatment approaches for complex cases.</p>
                </div>
              </div>
              
              {/* Doctor 3 */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="h-64 bg-gradient-to-br from-pink-400 to-pink-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Dr. Emily Rodriguez</h3>
                  <p className="text-pink-600 font-semibold mb-3">Pediatrician</p>
                  <p className="text-gray-600 leading-relaxed">Dedicated to children's health with a gentle approach that puts young patients at ease during visits.</p>
                </div>
              </div>
            
              {/* Doctor 4 */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="h-64 bg-gradient-to-br from-green-400 to-green-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Dr. James Wilson</h3>
                  <p className="text-green-600 font-semibold mb-3">Orthopedic Surgeon</p>
                  <p className="text-gray-600 leading-relaxed">Specializing in sports medicine and joint replacement with a focus on minimally invasive procedures.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
       <TestimonialsCarousel />
        
        {/* About Us Section */}
        <section id="about" className="py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <h2 className="text-4xl font-bold mb-8 text-gray-900">About Heal Link</h2>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  Heal Link was founded with a simple mission: to make healthcare more accessible and efficient for everyone. We believe that managing your health should be as simple as a few clicks.
                </p>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  Our platform connects patients with qualified healthcare professionals, streamlining the appointment booking process and eliminating unnecessary wait times and administrative hassles.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  With features designed for both patients and healthcare providers, Heal Link is transforming the healthcare experience one appointment at a time.
                </p>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl border border-gray-100">
                  <h3 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Our Benefits</h3>
                  <ul className="space-y-6">
                    <li className="flex items-start">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-2 mr-4 mt-1 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">Save time with quick online booking</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full p-2 mr-4 mt-1 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">Access to verified healthcare professionals</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full p-2 mr-4 mt-1 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">Receive appointment reminders</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-full p-2 mr-4 mt-1 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">Manage your medical history securely</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Join thousands of patients who have simplified their healthcare management with Heal Link. Start booking smarter today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/login" 
                className="bg-white text-blue-600 px-12 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 hover:shadow-xl font-bold text-lg transform hover:scale-105"
              >
                Get Started Now
              </Link>
              <button className="border-2 border-white text-white px-12 py-4 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 font-bold text-lg transform hover:scale-105">
                Watch Demo
              </button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6 md:px-12 lg:px-20 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Heal Link</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">Smart healthcare appointment booking system that puts patients first and transforms healthcare accessibility.</p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-white text-lg">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline">Home</Link></li>
                <li><Link href="#about" className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline">About Us</Link></li>
                <li><Link href="#doctors" className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline">Doctors</Link></li>
                <li><Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline">Testimonials</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-white text-lg">Contact Info</h4>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="bg-blue-600 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-gray-300">support@heallink.com</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-green-600 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors duration-300 transform hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="bg-blue-400 p-3 rounded-full hover:bg-blue-500 transition-colors duration-300 transform hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Heal Link. All rights reserved. Made with ❤️ for better healthcare.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
