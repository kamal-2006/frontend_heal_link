'use client';

import { useState } from 'react';

export default function NurseSupportPage() {
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
    { value: 'patient-care', label: 'Patient Care Issue' },
    { value: 'system-technical', label: 'System/Technical Support' },
    { value: 'equipment', label: 'Medical Equipment' },
    { value: 'scheduling', label: 'Scheduling/Shift Issues' },
    { value: 'documentation', label: 'Documentation Support' },
    { value: 'emergency', label: 'Emergency Protocol' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low - Response within 24 hours' },
    { value: 'normal', label: 'Normal - Response within 4 hours' },
    { value: 'high', label: 'High - Response within 1 hour' },
    { value: 'urgent', label: 'Urgent - Immediate response required' }
  ];

  const faqData = [
    {
      category: 'Patient Management',
      questions: [
        {
          q: 'How do I access patient medical records?',
          a: 'Navigate to the "Patients" section from your dashboard. Click on any patient card to view their detailed medical information, including history, current medications, and vital signs.'
        },
        {
          q: 'How do I update patient vital signs?',
          a: 'From the patient details page, look for the "Record Vitals" button. Enter the current readings for blood pressure, heart rate, temperature, and other vital signs as required.'
        },
        {
          q: 'What should I do if I notice a critical patient condition?',
          a: 'Immediately contact the attending physician and follow emergency protocols. Document all observations and actions taken in the patient\'s record.'
        }
      ]
    },
    {
      category: 'Appointments & Scheduling',
      questions: [
        {
          q: 'How do I view daily appointment schedules?',
          a: 'Go to the "Appointments" section to see all scheduled appointments. You can filter by date, doctor, or status to manage your daily workflow efficiently.'
        },
        {
          q: 'Can I add notes to appointments?',
          a: 'Yes, click on any appointment to add nursing notes, observations, or preparation notes that will be visible to the attending physician.'
        }
      ]
    },
    {
      category: 'Reports & Documentation',
      questions: [
        {
          q: 'How do I upload medical reports?',
          a: 'Use the "Reports" section to upload lab results, imaging reports, or other medical documents. Ensure all files are properly labeled and assigned to the correct patient.'
        },
        {
          q: 'What file formats are supported for reports?',
          a: 'The system supports PDF, JPG, PNG, and DICOM formats. Maximum file size is 50MB per upload.'
        }
      ]
    }
  ];

  const emergencyContacts = [
    { service: 'Emergency Services', number: '911', description: 'Life-threatening emergencies' },
    { service: 'Hospital Security', number: 'Ext. 2222', description: 'Security incidents' },
    { service: 'IT Helpdesk', number: 'Ext. 3333', description: 'Technical system issues' },
    { service: 'Nursing Supervisor', number: 'Ext. 1111', description: 'Nursing escalations' },
    { service: 'Administration', number: 'Ext. 4444', description: 'Administrative issues' }
  ];

  const quickActions = [
    { title: 'Report System Issue', description: 'Technical problems with the platform', category: 'system-technical' },
    { title: 'Equipment Malfunction', description: 'Medical equipment not working', category: 'equipment' },
    { title: 'Patient Care Escalation', description: 'Patient care concerns requiring immediate attention', category: 'patient-care' },
    { title: 'Documentation Help', description: 'Assistance with patient documentation', category: 'documentation' }
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitMessage('Support request submitted successfully! Our nursing support team will respond according to your urgency level.');
      setContactForm({
        subject: '',
        category: 'general',
        message: '',
        urgency: 'normal'
      });
    } catch (error) {
      setSubmitMessage('Error submitting request. Please try again or contact support directly.');
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

  const handleQuickAction = (category) => {
    setContactForm({
      ...contactForm,
      category: category
    });
    setActiveSection('contact');
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nursing Support Center</h1>
          <p className="text-gray-600">Get assistance with patient care, system issues, and nursing protocols.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 mb-6 bg-white p-1 rounded-lg shadow-sm">
          {[
            { key: 'contact', label: 'Contact Support', icon: '📞' },
            { key: 'faq', label: 'FAQ', icon: '❓' },
            { key: 'emergency', label: 'Emergency Contacts', icon: '🚨' },
            { key: 'quick', label: 'Quick Actions', icon: '⚡' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contact Support Section */}
        {activeSection === 'contact' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit Support Request</h2>
            
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={contactForm.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={contactForm.urgency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {urgencyLevels.map((level) => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={contactForm.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please provide detailed information about your issue, including any error messages, patient ID (if applicable), and steps you've already taken..."
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>

              {submitMessage && (
                <div className={`p-4 rounded-md ${submitMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>
        )}

        {/* FAQ Section */}
        {activeSection === 'faq' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {faqData.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {category.questions.map((faq, faqIndex) => {
                      const faqId = `${categoryIndex}-${faqIndex}`;
                      return (
                        <div key={faqId} className="border border-gray-200 rounded-lg">
                          <button
                            onClick={() => setExpandedFaq(expandedFaq === faqId ? null : faqId)}
                            className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-900">{faq.q}</span>
                              <svg
                                className={`w-5 h-5 text-gray-500 transition-transform ${
                                  expandedFaq === faqId ? 'transform rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </button>
                          {expandedFaq === faqId && (
                            <div className="px-4 pb-4">
                              <p className="text-gray-600">{faq.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Contacts Section */}
        {activeSection === 'emergency' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Emergency Contacts</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-red-100 rounded-md p-2">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{contact.service}</h3>
                      <p className="text-lg font-bold text-red-900">{contact.number}</p>
                      <p className="text-xs text-red-600">{contact.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions Section */}
        {activeSection === 'quick' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Support Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  onClick={() => handleQuickAction(action.category)}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4 cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">{action.title}</h3>
                      <p className="text-xs text-blue-600">{action.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}