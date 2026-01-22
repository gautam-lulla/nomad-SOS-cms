'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';

interface EventInquiryFormProps {
  entry?: string;
  sectionLabel?: string;
  heading?: string;
  description?: string;
}

// Form data interface
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  eventType: string;
  guestCount: string;
  preferredTime: string;
  cateringNeeded: boolean;
  avEquipment: boolean;
  decorations: boolean;
  additionalInfo: string;
}

// Options for select fields
const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
  { value: 'br', label: 'Brazil' },
  { value: 'ar', label: 'Argentina' },
  { value: 'other', label: 'Other' },
];

const eventTypeOptions = [
  { value: 'corporate', label: 'Corporate Event' },
  { value: 'wedding', label: 'Wedding Reception' },
  { value: 'birthday', label: 'Birthday Party' },
  { value: 'anniversary', label: 'Anniversary Celebration' },
  { value: 'holiday', label: 'Holiday Party' },
  { value: 'cocktail', label: 'Cocktail Reception' },
  { value: 'dinner', label: 'Private Dinner' },
  { value: 'other', label: 'Other' },
];

const timeOptions = [
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '17:00', label: '5:00 PM' },
  { value: '18:00', label: '6:00 PM' },
  { value: '19:00', label: '7:00 PM' },
  { value: '20:00', label: '8:00 PM' },
  { value: '21:00', label: '9:00 PM' },
];

export function EventInquiryForm({
  entry = 'private-events-form',
  sectionLabel,
  heading = 'Tell us about your event',
  description,
}: EventInquiryFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    eventType: '',
    guestCount: '',
    preferredTime: '',
    cateringNeeded: false,
    avEquipment: false,
    decorations: false,
    additionalInfo: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/private-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit inquiry');
      }

      setSubmitStatus('success');
      // Reset form on success
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: '',
        eventType: '',
        guestCount: '',
        preferredTime: '',
        cateringNeeded: false,
        avEquipment: false,
        decorations: false,
        additionalInfo: '',
      });
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="bg-ink-900 py-[100px] px-[60px]"
      data-cms-entry={entry}
    >
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          {sectionLabel && (
            <span
              className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white block mb-4"
              data-cms-entry={entry}
              data-cms-field="sectionLabel"
            >
              {sectionLabel}
            </span>
          )}
          <h2
            className="font-sabon text-[36px] leading-[1.3] tracking-[-0.72px] text-off-white mb-4"
            data-cms-entry={entry}
            data-cms-field="heading"
          >
            {heading}
          </h2>
          {description && (
            <p
              className="font-sabon text-base leading-[1.6] text-off-white/80 max-w-[600px]"
              data-cms-entry={entry}
              data-cms-field="description"
            >
              {description}
            </p>
          )}
        </div>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mb-8 p-6 border border-pink-400 bg-pink-400/10">
            <p className="font-sabon text-lg text-pink-400">
              Thank you for your inquiry! We&apos;ll be in touch with you soon.
            </p>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mb-8 p-6 border border-red-500 bg-red-500/10">
            <p className="font-sabon text-lg text-red-500">
              {errorMessage || 'Something went wrong. Please try again.'}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Row 1: Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input
              label="First name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              placeholder="Enter your first name"
              data-cms-entry={entry}
              data-cms-field="firstNameLabel"
            />
            <Input
              label="Last name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              placeholder="Enter your last name"
              data-cms-entry={entry}
              data-cms-field="lastNameLabel"
            />
          </div>

          {/* Row 2: Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input
              label="Email address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="you@example.com"
              data-cms-entry={entry}
              data-cms-field="emailLabel"
            />
            <Input
              label="Phone number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="(555) 123-4567"
              data-cms-entry={entry}
              data-cms-field="phoneLabel"
            />
          </div>

          {/* Row 3: Location & Event Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Select
              label="Country/Region"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              options={countryOptions}
              placeholder="Select your country"
              data-cms-entry={entry}
              data-cms-field="countryLabel"
            />
            <Select
              label="Type of event"
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
              options={eventTypeOptions}
              placeholder="Select event type"
              required
              data-cms-entry={entry}
              data-cms-field="eventTypeLabel"
            />
          </div>

          {/* Row 4: Guests & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input
              label="Number of guests"
              name="guestCount"
              type="number"
              min="1"
              max="500"
              value={formData.guestCount}
              onChange={handleInputChange}
              placeholder="Estimated guest count"
              data-cms-entry={entry}
              data-cms-field="guestCountLabel"
            />
            <Select
              label="Preferred start time"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleInputChange}
              options={timeOptions}
              placeholder="Select preferred time"
              data-cms-entry={entry}
              data-cms-field="preferredTimeLabel"
            />
          </div>

          {/* Additional Options */}
          <div>
            <span className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white block mb-4">
              Additional options
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Checkbox
                label="Catering services"
                name="cateringNeeded"
                checked={formData.cateringNeeded}
                onChange={handleInputChange}
              />
              <Checkbox
                label="A/V equipment"
                name="avEquipment"
                checked={formData.avEquipment}
                onChange={handleInputChange}
              />
              <Checkbox
                label="Event decorations"
                name="decorations"
                checked={formData.decorations}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Additional Info */}
          <Textarea
            label="Additional information"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            placeholder="Tell us more about your event, special requirements, or questions..."
            rows={5}
            data-cms-entry={entry}
            data-cms-field="additionalInfoLabel"
          />

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              variant="primary"
              ariaLabel="Submit event inquiry"
              data-cms-entry={entry}
              data-cms-field="submitButtonText"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
