import Image from 'next/image';
import Link from 'next/link';

interface Award {
  name: string;
  organization?: string;
  logo?: string;
  logoAlt?: string;
  year?: string;
  url?: string;
}

interface AwardCardProps {
  entry: string;
  award: Award;
  index: number;
}

export function AwardCard({ entry, award, index }: AwardCardProps) {
  const content = (
    <div className="flex flex-col items-center text-center group">
      {/* Logo */}
      {award.logo && (
        <div
          className="relative w-[120px] h-[80px] mb-4"
          data-cms-entry={entry}
          data-cms-field={`awards[${index}].logo`}
          data-cms-type="image"
        >
          <Image
            src={award.logo}
            alt={award.logoAlt || award.name}
            fill
            className="object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
          />
        </div>
      )}

      {/* Award Name */}
      <h3
        className="font-sabon text-[20px] leading-[1.3] tracking-[-0.4px] text-off-white group-hover:text-pink-400 transition-colors"
        data-cms-entry={entry}
        data-cms-field={`awards[${index}].name`}
      >
        {award.name}
      </h3>

      {/* Organization */}
      {award.organization && (
        <p
          className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white/60 mt-1"
          data-cms-entry={entry}
          data-cms-field={`awards[${index}].organization`}
        >
          {award.organization}
        </p>
      )}

      {/* Year */}
      {award.year && (
        <span
          className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-pink-400 mt-2"
          data-cms-entry={entry}
          data-cms-field={`awards[${index}].year`}
        >
          {award.year}
        </span>
      )}
    </div>
  );

  if (award.url) {
    return (
      <Link
        href={award.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </Link>
    );
  }

  return content;
}

interface AwardsGridProps {
  entry: string;
  sectionLabel?: string;
  heading?: string;
  awards: Award[];
}

export function AwardsGrid({
  entry,
  sectionLabel,
  heading,
  awards,
}: AwardsGridProps) {
  return (
    <section className="bg-ink-900 py-[60px] px-[60px]">
      {/* Header */}
      <div className="mb-10 text-center">
        {sectionLabel && (
          <span
            className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white block mb-4"
            data-cms-entry={entry}
            data-cms-field="sectionLabel"
          >
            {sectionLabel}
          </span>
        )}
        {heading && (
          <h2
            className="font-sabon text-[36px] leading-[1.3] tracking-[-0.72px] text-off-white"
            data-cms-entry={entry}
            data-cms-field="heading"
          >
            {heading}
          </h2>
        )}
      </div>

      {/* Awards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {awards.map((award, index) => (
          <AwardCard key={index} entry={entry} award={award} index={index} />
        ))}
      </div>
    </section>
  );
}
