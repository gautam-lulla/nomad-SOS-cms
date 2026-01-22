import Image from 'next/image';
import Link from 'next/link';

interface FooterProps {
  column1Title?: string;
  column1Links?: Array<{ label: string; url?: string | null }>;
  column2Title?: string;
  column2Links?: Array<{ label: string; url?: string | null }>;
  column3Title?: string;
  column3Links?: Array<{ label: string; url?: string | null }>;
  newsletterHeading?: string;
  newsletterPlaceholder?: string;
  privacyPolicyLabel?: string;
  copyrightText?: string;
  legalLinks?: Array<{ label: string; url: string }>;
  footerLogo?: string;
  footerLogoAlt?: string;
  wordmark?: string;
  wordmarkAlt?: string;
}

export function Footer({
  column1Links,
  column2Links,
  column3Links,
  newsletterHeading,
  newsletterPlaceholder,
  privacyPolicyLabel,
  copyrightText,
  legalLinks,
  footerLogo,
  footerLogoAlt,
  wordmark,
  wordmarkAlt,
}: FooterProps) {
  return (
    <footer className="bg-pink-400">
      {/* Main Footer Content */}
      <div className="flex flex-col gap-[60px] items-center pt-0 max-w-page mx-auto">
        {/* Top Row - Columns */}
        <div className="w-full flex flex-wrap justify-between p-[60px]">
          {/* Column 1 - Location */}
          {column1Links && column1Links.length > 0 && (
            <div className="w-[229px]">
              {column1Links.map((link, index) => (
                <p
                  key={index}
                  className="font-gotham font-bold text-sm uppercase tracking-[0.42px] leading-[1.6] text-ink-900"
                  data-cms-entry="global-footer"
                  data-cms-field={`column1Links[${index}].label`}
                >
                  {link.label}
                </p>
              ))}
            </div>
          )}

          {/* Column 2 - Hours */}
          {column2Links && column2Links.length > 0 && (
            <div>
              {column2Links.map((link, index) => (
                <p
                  key={index}
                  className="font-gotham font-bold text-sm uppercase tracking-[0.42px] leading-[1.6] text-ink-900"
                  data-cms-entry="global-footer"
                  data-cms-field={`column2Links[${index}].label`}
                >
                  {link.label}
                </p>
              ))}
            </div>
          )}

          {/* Column 3 - Links */}
          {column3Links && column3Links.length > 0 && (
            <div className="flex flex-col gap-[2px]">
              {column3Links.map((link, index) => (
                link.url ? (
                  <Link
                    key={index}
                    href={link.url}
                    className="font-gotham font-bold text-sm uppercase tracking-[0.42px] leading-[1.6] text-ink-900 hover:underline"
                    data-cms-entry="global-footer"
                    data-cms-field={`column3Links[${index}].label`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <span
                    key={index}
                    className="font-gotham font-bold text-sm uppercase tracking-[0.42px] leading-[1.6] text-ink-900"
                    data-cms-entry="global-footer"
                    data-cms-field={`column3Links[${index}].label`}
                  >
                    {link.label}
                  </span>
                )
              ))}
            </div>
          )}

          {/* Newsletter Form */}
          <div className="w-[433px] flex flex-col gap-3">
            {newsletterHeading && (
              <p
                className="font-gotham font-bold text-sm uppercase tracking-[0.42px] text-ink-900 mb-2"
                data-cms-entry="global-footer"
                data-cms-field="newsletterHeading"
              >
                {newsletterHeading}
              </p>
            )}
            <div className="border-b border-ink-900 pb-3 flex items-center justify-between">
              <input
                type="email"
                placeholder={newsletterPlaceholder}
                className="flex-1 bg-transparent font-gotham font-bold text-sm uppercase tracking-[0.42px] text-ink-900 placeholder-ink-900 outline-none"
                data-cms-entry="global-footer"
                data-cms-field="newsletterPlaceholder"
              />
              <button type="submit" aria-label="Subscribe to newsletter">
                <svg width="13" height="1" viewBox="0 0 13 1" className="text-ink-900">
                  <path d="M0 0.5H13" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>
            {privacyPolicyLabel && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="privacy-policy"
                  className="w-[14px] h-[14px] border border-ink-900 bg-transparent"
                />
                <label
                  htmlFor="privacy-policy"
                  className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-ink-900"
                  data-cms-entry="global-footer"
                  data-cms-field="privacyPolicyLabel"
                >
                  {privacyPolicyLabel}
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Center Logo */}
        <div
          className="w-[272px] h-[272px] relative"
          data-cms-entry="global-footer"
          data-cms-field="footerLogo"
          data-cms-type="image"
        >
          <Image
            src={footerLogo || '/images/logos/footer-mark.svg'}
            alt={footerLogoAlt || 'NoMad Wynwood Mark'}
            fill
            className="object-contain"
            unoptimized={footerLogo?.endsWith('.svg') || !footerLogo}
          />
        </div>

        {/* Wordmark */}
        <div className="w-full px-[60px] pb-0">
          <div
            className="w-full h-[96px] relative"
            data-cms-entry="global-footer"
            data-cms-field="wordmark"
            data-cms-type="image"
          >
            <Image
              src={wordmark || '/images/logos/footer-wordmark.svg'}
              alt={wordmarkAlt || 'NoMad Wynwood'}
              fill
              className="object-contain object-left"
              unoptimized={wordmark?.endsWith('.svg') || !wordmark}
            />
          </div>
        </div>

        {/* Bottom Bar - Copyright & Legal */}
        <div className="w-full bg-ink-900 py-4 px-5">
          <div className="flex items-center justify-center gap-4">
            {copyrightText && (
              <span
                className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white"
                data-cms-entry="global-footer"
                data-cms-field="copyrightText"
              >
                {copyrightText}
              </span>
            )}
            {legalLinks?.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white hover:underline"
                data-cms-entry="global-footer"
                data-cms-field={`legalLinks[${index}].label`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
