import React, { useState } from 'react';

interface ContactFormProps {
  cultivarName?: string;
  prefilledMessage?: string;
}

export default function ContactForm({ cultivarName, prefilledMessage }: ContactFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    region: '',
    message: prefilledMessage || 'I am interested in learning more about your strawberry cultivars. Please provide information about licensing, availability, and growing recommendations for my operation.'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          cultivar: cultivarName,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setIsExpanded(false);
          setFormData({
            name: '',
            email: '',
            company: '',
            phone: '',
            region: '',
            message: prefilledMessage || 'I am interested in learning more about your strawberry cultivars. Please provide information about licensing, availability, and growing recommendations for my operation.'
          });
        }, 3000);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common input style object
  const inputStyle = {
    fontFamily: 'var(--font-body)',
    background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8) 0%, rgba(31, 41, 55, 0.9) 100%)',
    backdropFilter: 'blur(10px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    color: '#ffffff',
    marginBottom: '14px',
    marginTop: '8px'
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'rgba(0, 255, 136, 0.5)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
  };

  if (isSubmitted) {
    return (
      <div 
        className="modern-card transition-all duration-300"
        style={{ 
          padding: '24px',
          marginBottom: '12px',
          textAlign: 'center'
        }}
      >
        <div style={{ 
          fontFamily: 'var(--font-body)', 
          fontSize: '16px', 
          color: '#00ff88', 
          marginBottom: '8px', 
          fontWeight: 'bold' 
        }}>
          ✓ Message Sent Successfully!
        </div>
        <div style={{ 
          fontFamily: 'var(--font-body)', 
          fontSize: '14px', 
          color: '#d1d5db' 
        }}>
          We will get back to you within 24 hours.
        </div>
      </div>
    );
  }

  return (
    <div 
      className="modern-card transition-all duration-300"
      style={{ 
        padding: '16px',
        marginBottom: '12px'
      }}
    >
      {/* Header - Always Visible */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer"
      >
        <div>
          <div style={{ 
            fontFamily: 'var(--font-body)', 
            fontSize: '20px', 
            color: '#d1d5db', 
            marginBottom: '8px', 
            fontWeight: 'bold' 
          }}>
            💬 Interested in {cultivarName || 'CBC Cultivars'}?
          </div>
          <div className="text-sm text-gray-300" style={{ fontFamily: 'var(--font-body)' }}>
            {isExpanded ? '' : 'Click to contact CBC'}
          </div>
        </div>
        <div 
          style={{ 
            fontSize: '18px', 
            color: '#00ff88',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        >
          ▼
        </div>
      </div>

      {/* Expandable Form */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-2" style={{ gap: '24px' }}>
              <div>
                <label className="block text-xs text-gray-400 mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 text-white text-sm focus:outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 text-white text-sm focus:outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Company and Phone Row */}
            <div className="grid grid-cols-2" style={{ gap: '24px' }}>
              <div>
                <label className="block text-xs text-gray-400 mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-white text-sm focus:outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-white text-sm focus:outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Region */}
            <div>
              <label className="block text-xs text-gray-400 mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                Growing Region
              </label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                placeholder="e.g., Central Valley, CA"
                className="w-full px-4 py-3 text-white text-sm focus:outline-none transition-all duration-300"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs text-gray-400 mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 text-white text-sm focus:outline-none transition-all duration-300 resize-none"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              style={{ 
                fontFamily: 'var(--font-body)',
                background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
                backdropFilter: 'blur(10px) saturate(180%)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0, 255, 136, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
              }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                'Send Inquiry'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 