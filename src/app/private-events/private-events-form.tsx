"use client";

import { Button, Input, TextArea, RadioButton } from "@/components/ui";
import type { FormEvent } from "react";

interface FormConfig {
  title: string;
  fields: {
    firstName: { label: string; placeholder: string };
    lastName: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    phone: { label: string; placeholder: string };
    country: { label: string; placeholder: string };
    eventType: { label: string; placeholder: string };
    guests: { label: string; placeholder: string };
    startTime: { label: string; placeholder: string };
  };
  additionalOptions: {
    label: string;
    options: string[];
  };
  additionalInfo: {
    label: string;
    placeholder: string;
  };
  submitText: string;
}

interface PrivateEventsFormProps {
  form: FormConfig;
}

export function PrivateEventsForm({ form }: PrivateEventsFormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Form submission logic will be implemented
  };

  return (
    <section id="contact-form" className="pt-10 md:pt-16 lg:pt-xl px-4 md:px-6 lg:px-3m">
      <h2 className="font-sabon text-h2 text-off-white-100 text-center mb-10 lg:mb-l">
        {form.title}
      </h2>

      <form className="max-w-[877px] mx-auto" onSubmit={handleSubmit}>
        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 lg:gap-x-3m gap-y-6 lg:gap-y-m">
          {/* First Name */}
          <div>
            <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
              {form.fields.firstName.label}
            </label>
            <Input
              type="text"
              placeholder={form.fields.firstName.placeholder}
              variant="light"
              inputStyle="form"
              showArrow={false}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
              {form.fields.lastName.label}
            </label>
            <Input
              type="text"
              placeholder={form.fields.lastName.placeholder}
              variant="light"
              inputStyle="form"
              showArrow={false}
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
              {form.fields.email.label}
            </label>
            <Input
              type="email"
              placeholder={form.fields.email.placeholder}
              variant="light"
              inputStyle="form"
              showArrow={false}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
              {form.fields.phone.label}
            </label>
            <Input
              type="tel"
              placeholder={form.fields.phone.placeholder}
              variant="light"
              inputStyle="form"
              showArrow={false}
            />
          </div>

          {/* Country */}
          <div>
            <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
              {form.fields.country.label}
            </label>
            <Input
              type="text"
              placeholder={form.fields.country.placeholder}
              variant="light"
              inputStyle="form"
              showArrow={false}
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
              {form.fields.eventType.label}
            </label>
            <Input
              type="text"
              placeholder={form.fields.eventType.placeholder}
              variant="light"
              inputStyle="form"
              showArrow={false}
            />
          </div>

          {/* Number of Guests */}
          <div>
            <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
              {form.fields.guests.label}
            </label>
            <Input
              type="text"
              placeholder={form.fields.guests.placeholder}
              variant="light"
              inputStyle="form"
              showArrow={false}
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
              {form.fields.startTime.label}
            </label>
            <Input
              type="text"
              placeholder={form.fields.startTime.placeholder}
              variant="light"
              inputStyle="form"
              showArrow={false}
            />
          </div>
        </div>

        {/* Additional Options */}
        <div className="mt-6 lg:mt-m">
          <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
            {form.additionalOptions.label}
          </label>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 lg:gap-m">
            {form.additionalOptions.options.map((option, index) => (
              <RadioButton key={index} name="additionalOption" label={option} variant="light" />
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 lg:mt-m">
          <label className="font-gotham font-bold text-cta uppercase tracking-wide-cta text-off-white-100 block mb-3xs">
            {form.additionalInfo.label}
          </label>
          <TextArea
            placeholder={form.additionalInfo.placeholder}
            variant="light"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6 lg:mt-3s">
          <Button type="submit" variant="filled">
            {form.submitText}
          </Button>
        </div>
      </form>
    </section>
  );
}
