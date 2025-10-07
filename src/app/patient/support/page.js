'use client';

import { useState } from 'react';

export default function SupportPage() {
  const [activeSection, setActiveSection] = useState('contact');
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: 'general',
    message: '',
    urgency: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'appointment', label: 'Appointment Issue' },
    { value: 'medical-records', label: 'Medical Records' },
    { value: 'medications', label: 'Medications' },
    { value: 'billing', label: 'Billing/Insurance' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'complaint', label: 'Complaint' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low - Response within 5 days' },
    { value: 'normal', label: 'Normal - Response within 2 days' },
    { value: 'high', label: 'High - Response within 24 hours' },
    { value: 'urgent', label: 'Urgent - Response within 4 hours' }
  ];

  const faqData = [
    {
      category: 'Appointments',
      questions: [
        {
          q: 'How do I book an appointment?',
          a: 'Go to the "Book Appointment" section in your dashboard, select your preferred doctor, date, and time slot. You can filter doctors by specialization to find the right care for your needs.'
        },
        {
          q: 'Can I cancel or reschedule my appointment?',
          a: 'Yes, you can cancel pending appointments from your appointments page. For confirmed appointments, please contact support at least 24 hours in advance to reschedule.'
        },
        {
          q: 'What if no doctors are available for my preferred time?',
          a: 'Try selecting different dates, times, or consider other doctors with the same specialization. You can also contact support to be notified of cancellations.'
        }
      ]
    },
    {
      category: 'Medical Records',
      questions: [
        {
          q: 'How do I access my medical records?',
          a: 'Visit the "Reports" section in your dashboard to view and download your medical records, test results, and prescription history.'
        },
        {
          q: 'Can I upload my own medical documents?',
          a: 'Yes, you can upload medical reports and documents in the "Reports" section. Accepted formats include PDF, JPG, and PNG files.'
        },
        {
          q: 'How do I share my records with another doctor?',
          a: 'You can download your records and share them directly, or contact support to have them sent securely to another healthcare provider.'
        }
      ]
    },
    {
      category: 'Medications',
      questions: [
        {
          q: 'Where can I view my current medications?',
          a: 'Check the "Medications" section in your dashboard to see all current prescriptions, dosages, and refill information.'
        },
        {
          q: 'How do I request a prescription refill?',
          a: 'Contact your prescribing doctor through the appointments system or call our pharmacy directly. Emergency refills can be requested through this support system.'
        }
      ]
    },
    {
      category: 'Account & Profile',
      questions: [
        {
          q: 'How do I update my profile information?',
          a: 'Go to "Profile" in your dashboard menu. You can update your personal information, contact details, and emergency contacts. Make sure to save changes after editing.'
        },
        {
          q: 'I forgot my password. How do I reset it?',
          a: 'Use the "Forgot Password" link on the login page. You\'ll receive a reset link via email to create a new password.'
        }
      ]
    }
  ];

  const emergencyContacts = [
    { service: 'Emergency Services', number: '911', description: 'Life-threatening emergencies' },
    { service: 'Hospital Emergency', number: '(555) 123-4567', description: '24/7 emergency care' },
    { service: 'Poison Control', number: '1-800-222-1222', description: 'Poisoning emergencies' },
    { service: 'Mental Health Crisis', number: '988', description: 'Suicide & crisis lifeline' }
  ];

  const quickActions = [
    { title: 'Book Emergency Appointment', description: 'Quick access to urgent care booking', link: '/patient/dashboard/book?urgent=true' },
    { title: 'View Recent Appointments', description: 'Check your appointment history', link: '/patient/appointments' },
    { title: 'Download Medical Records', description: 'Access your health documents', link: '/patient/reports' },
    { title: 'Update Profile', description: 'Modify your personal information', link: '/patient/profile' }
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Here you would typically send to your backend
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitMessage('Support request submitted successfully! We\'ll respond within the timeframe specified for your urgency level.');
      setContactForm({
        subject: '',
        category: 'general',
        message: '',
        urgency: 'normal'
      });
    } catch (error) {
      setSubmitMessage('Error submitting request. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Support</h1>
          <p className="text-gray-600">We're here to help! Choose how you'd like to get assistance.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
          {[
            { id: 'contact', label: 'Contact Us', icon: '📧' },
            { id: 'faq', label: 'FAQ', icon: '❓' },
            { id: 'emergency', label: 'Emergency', icon: '🚨' },
            { id: 'quick-actions', label: 'Quick Actions', icon: '⚡' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2 rounded-t-lg font-medium flex items-center gap-2 transition-colors ${
                activeSection === tab.id
                  ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contact Form Section */}
        {activeSection === 'contact' && (
          <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">Contact Support</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={contactForm.category}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgency Level
                    </label>
                    <select
                      name="urgency"
                      value={contactForm.urgency}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {urgencyLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={contactForm.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Please provide detailed information about your issue or question..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Support Request'}
                  </button>

                  {submitMessage && (
                    <div className={`p-4 rounded-md ${
                      submitMessage.includes('Error') 
                        ? 'bg-red-50 text-red-800 border border-red-200' 
                        : 'bg-green-50 text-green-800 border border-green-200'
                    }`}>
                      {submitMessage}
                    </div>
                  )}
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Other Ways to Reach Us</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📞</span>
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-gray-600">(555) 123-4567</p>
                        <p className="text-sm text-gray-500">Mon-Fri 8AM-6PM</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📧</span>
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-gray-600">support@heallink.com</p>
                        <p className="text-sm text-gray-500">Response within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💬</span>
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-gray-600">Available on website</p>
                        <p className="text-sm text-gray-500">Mon-Fri 9AM-5PM</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="font-medium">Office Address</p>
                        <p className="text-gray-600">123 Healthcare Ave</p>
                        <p className="text-gray-600">Medical District, NY 10001</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Tip</h3>
                  <p className="text-blue-800 text-sm">
                    For faster assistance, check our FAQ section first. Many common questions are answered there instantly!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {activeSection === 'faq' && (
          <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in"
          >
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {faqData.map((category, categoryIndex) => (
                <div key={categoryIndex} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-blue-600">📋</span>
                    {category.category}
                  </h3>
                  
                  <div className="space-y-3">
                    {category.questions.map((faq, faqIndex) => {
                      const faqId = `${categoryIndex}-${faqIndex}`;
                      return (
                        <div key={faqIndex} className="border border-gray-200 rounded-lg">
                          <button
                            onClick={() => setExpandedFaq(expandedFaq === faqId ? null : faqId)}
                            className="w-full text-left p-4 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-900">{faq.q}</span>
                              <span className="text-gray-500 ml-2 flex-shrink-0">
                                {expandedFaq === faqId ? '−' : '+'}
                              </span>
                            </div>
                          </button>
                          {expandedFaq === faqId && (
                            <div className="px-4 pb-4">
                              <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Can't find what you're looking for?</h3>
              <p className="text-gray-600 mb-4">
                If your question isn't answered here, don't hesitate to contact our support team directly.
              </p>
              <button
                onClick={() => setActiveSection('contact')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        )}

        {/* Emergency Section */}
        {activeSection === 'emergency' && (
          <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
          
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-red-600 mb-2">🚨 Emergency Contacts</h2>
              <p className="text-gray-600">
                If you're experiencing a medical emergency, please contact emergency services immediately.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">{contact.service}</h3>
                  <div className="text-2xl font-bold text-red-600 mb-2">{contact.number}</div>
                  <p className="text-red-700 text-sm">{contact.description}</p>
                  {contact.number !== '911' && (
                    <a
                      href={`tel:${contact.number}`}
                      className="inline-block mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      Call Now
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">⚠️ When to Seek Emergency Care</h3>
              <ul className="text-yellow-800 space-y-1 text-sm">
                <li>• Chest pain or difficulty breathing</li>
                <li>• Severe allergic reactions</li>
                <li>• Loss of consciousness</li>
                <li>• Severe bleeding or trauma</li>
                <li>• Signs of stroke (facial drooping, arm weakness, speech difficulties)</li>
                <li>• Severe abdominal pain</li>
                <li>• High fever with confusion</li>
              </ul>
            </div>
          </div>
        )}

        {/* Quick Actions Section */}
        {activeSection === 'quick-actions' && (
          <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in"
          >
            <h2 className="text-2xl font-semibold mb-6">⚡ Quick Actions</h2>
            <p className="text-gray-600 mb-8">
              Fast access to common tasks and important areas of your patient portal.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.link}
                  className="block p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                  <div className="mt-4 text-blue-600 text-sm font-medium flex items-center gap-1">
                    Go to {action.title} →
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help Navigating?</h3>
              <p className="text-blue-800 text-sm mb-4">
                Our patient portal is designed to be intuitive, but if you need guidance on using any features, 
                we're here to help with step-by-step instructions.
              </p>
              <button
                onClick={() => setActiveSection('contact')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                Get Navigation Help
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}