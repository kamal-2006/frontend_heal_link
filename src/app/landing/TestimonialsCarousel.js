"use client";
import React, { useEffect, useRef, useState } from "react";

const TESTIMONIALS = [
  {
    id: 1,
    quote: "Heal Link has completely transformed how I manage my healthcare. Booking appointments is now quick and hassle-free. I love the reminder feature!",
    name: "John Doe",
    role: "Happy Patient",
    initials: "JD",
    bgColor: "from-blue-50 to-indigo-100",
    borderColor: "border-blue-100",
    avatarColor: "from-blue-500 to-blue-600",
    quoteColor: "text-blue-600"
  },
  {
    id: 2,
    quote: "As someone with a busy schedule, I appreciate how easy it is to reschedule appointments when needed. The interface is intuitive and user-friendly.",
    name: "Amanda Smith",
    role: "Regular User",
    initials: "AS",
    bgColor: "from-purple-50 to-pink-100",
    borderColor: "border-purple-100",
    avatarColor: "from-purple-500 to-pink-500",
    quoteColor: "text-purple-600"
  },
  {
    id: 3,
    quote: "Being able to see doctor profiles and specialties before booking has helped me find the right healthcare professionals for my specific needs.",
    name: "Robert Johnson",
    role: "Satisfied Patient",
    initials: "RJ",
    bgColor: "from-green-50 to-emerald-100",
    borderColor: "border-green-100",
    avatarColor: "from-green-500 to-emerald-500",
    quoteColor: "text-green-600"
  },
  {
    id: 4,
    quote: "The reminder system is fantastic! I never miss appointments anymore, and rescheduling with just a tap is a complete game-changer.",
    name: "Maria Rodriguez",
    role: "Frequent User",
    initials: "MR",
    bgColor: "from-yellow-50 to-orange-100",
    borderColor: "border-yellow-100",
    avatarColor: "from-yellow-500 to-orange-500",
    quoteColor: "text-yellow-600"
  },
  {
    id: 5,
    quote: "Excellent platform — booking, rescheduling and doctor details are all in one place. Highly recommended for busy professionals.",
    name: "Oliver Chen",
    role: "Tech Professional", 
    initials: "OC",
    bgColor: "from-indigo-50 to-violet-100",
    borderColor: "border-indigo-100",
    avatarColor: "from-indigo-500 to-violet-500",
    quoteColor: "text-indigo-600"
  },
  {
    id: 6,
    quote: "Fast, reliable and incredibly easy to use. The customer support team was exceptionally helpful when I had questions.",
    name: "Sana Patel",
    role: "Healthcare Advocate",
    initials: "SP",
    bgColor: "from-pink-50 to-rose-100",
    borderColor: "border-pink-100",
    avatarColor: "from-pink-500 to-rose-500",
    quoteColor: "text-pink-600"
  }
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3); // Default to 3 for server/client consistency
  const [isClient, setIsClient] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const autoPlayRef = useRef(null);

  // Update visible cards on window resize - only on client
  useEffect(() => {
    setIsClient(true);
    
    const getVisibleCount = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
      }
      return 1;
    };

    // Set initial client-side value
    setVisibleCards(getVisibleCount());

    const handleResize = () => setVisibleCards(getVisibleCount());
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Ensure consistent rendering between server and initial client render
  const totalSlides = Math.ceil(TESTIMONIALS.length / visibleCards);

  // Auto-play functionality - only run on client
  useEffect(() => {
    if (!isClient || isPaused) return;
    
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex >= totalSlides - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Move every 4 seconds (within 3-5 second range)

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [totalSlides, visibleCards, isClient, isPaused]);

  // Get testimonials for current slide
  const getCurrentTestimonials = () => {
    const start = currentIndex * visibleCards;
    return TESTIMONIALS.slice(start, start + visibleCards);
  };

  // Helper function to restart autoplay
  const restartAutoplay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    if (isClient && !isPaused) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex >= totalSlides - 1 ? 0 : prevIndex + 1
        );
      }, 4000);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(0); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      // Swipe left - next slide
      setCurrentIndex((prevIndex) => 
        prevIndex >= totalSlides - 1 ? 0 : prevIndex + 1
      );
      restartAutoplay();
    }
    
    if (isRightSwipe) {
      // Swipe right - previous slide
      setCurrentIndex((prevIndex) => 
        prevIndex <= 0 ? totalSlides - 1 : prevIndex - 1
      );
      restartAutoplay();
    }
  };

  // Render loading state on server or during initial client hydration
  if (!isClient) {
    return (
      <section id="testimonials" className="py-24 px-6 md:px-12 lg:px-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">What Our Patients Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Read testimonials from our satisfied patients who have experienced the convenience of Heal Link
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.slice(0, 3).map((testimonial) => (
              <div key={testimonial.id} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-2xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-24 px-6 md:px-12 lg:px-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">What Our Patients Say</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Read testimonials from our satisfied patients who have experienced the convenience of Heal Link
          </p>
        </div>
        
        {/* Carousel Container */}
        <div 
          className="relative overflow-hidden group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`
            }}
          >
            {/* Create slides */}
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div 
                key={slideIndex}
                className="w-full flex-shrink-0"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {TESTIMONIALS.slice(slideIndex * visibleCards, (slideIndex * visibleCards) + visibleCards).map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className={`bg-gradient-to-br ${testimonial.bgColor} dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg relative ${testimonial.borderColor} dark:border-gray-600 border transition-all duration-300 hover:shadow-xl hover:scale-105`}
                    >
                      <div className={`${testimonial.quoteColor} dark:text-gray-400 text-6xl absolute top-4 left-6 opacity-20 font-serif`}>
                        &#8220;
                      </div>
                      <div className="pt-8">
                        <p className="text-gray-800 dark:text-gray-200 mb-6 leading-relaxed font-medium">
                          {testimonial.quote}
                        </p>
                        <div className="flex items-center">
                          <div className={`bg-gradient-to-br ${testimonial.avatarColor} w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-lg`}>
                            <span className="text-white font-bold">{testimonial.initials}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                            <p className="text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={() => {
                  setCurrentIndex((prevIndex) => 
                    prevIndex <= 0 ? totalSlides - 1 : prevIndex - 1
                  );
                  restartAutoplay();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-blue-50 dark:hover:bg-blue-900/50 z-10"
                aria-label="Previous testimonials"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => {
                  setCurrentIndex((prevIndex) => 
                    prevIndex >= totalSlides - 1 ? 0 : prevIndex + 1
                  );
                  restartAutoplay();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-blue-50 dark:hover:bg-blue-900/50 z-10"
                aria-label="Next testimonials"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Indicators */}
        {totalSlides > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  restartAutoplay();
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                  currentIndex === index 
                    ? "bg-blue-600 shadow-lg shadow-blue-600/30" 
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Progress indicator */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentIndex + 1} of {totalSlides}
          </p>
        </div>
      </div>
    </section>
  );
}