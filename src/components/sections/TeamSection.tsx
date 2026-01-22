import Image from 'next/image';

interface TeamMember {
  name: string;
  title: string;
  bio?: string;
  image?: string;
  imageAlt?: string;
}

interface TeamSectionProps {
  entry: string;
  sectionLabel?: string;
  heading?: string;
  subheading?: string;
  members: TeamMember[];
}

export function TeamSection({
  entry,
  sectionLabel,
  heading,
  subheading,
  members,
}: TeamSectionProps) {
  return (
    <section className="bg-ink-900 py-[80px] px-[60px]">
      {/* Header */}
      <div className="mb-16 text-center max-w-[800px] mx-auto">
        {sectionLabel && (
          <span
            className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white/60 block mb-4"
            data-cms-entry={entry}
            data-cms-field="sectionLabel"
          >
            {sectionLabel}
          </span>
        )}
        {heading && (
          <h2
            className="font-sabon text-[48px] leading-[1.2] tracking-[-0.96px] text-off-white mb-6"
            data-cms-entry={entry}
            data-cms-field="heading"
          >
            {heading}
          </h2>
        )}
        {subheading && (
          <p
            className="font-sabon text-[18px] leading-[1.6] tracking-[-0.36px] text-off-white/80"
            data-cms-entry={entry}
            data-cms-field="subheading"
          >
            {subheading}
          </p>
        )}
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-[1200px] mx-auto">
        {members.map((member, index) => (
          <div key={index} className="text-center">
            {/* Member Photo */}
            {member.image && (
              <div
                className="relative aspect-[3/4] w-full mb-6 overflow-hidden"
                data-cms-entry={entry}
                data-cms-field={`team[${index}].image`}
                data-cms-type="image"
              >
                <Image
                  src={member.image}
                  alt={member.imageAlt || member.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Member Info */}
            <div className="space-y-2">
              <h3
                className="font-gotham font-bold text-sm uppercase tracking-[0.42px] text-pink-400"
                data-cms-entry={entry}
                data-cms-field={`team[${index}].name`}
              >
                {member.name}
              </h3>
              <p
                className="font-sabon text-base uppercase tracking-[0.32px] text-off-white/60"
                data-cms-entry={entry}
                data-cms-field={`team[${index}].title`}
              >
                {member.title}
              </p>
              {member.bio && (
                <p
                  className="font-sabon text-base leading-[1.6] tracking-[-0.32px] text-off-white/80 mt-4"
                  data-cms-entry={entry}
                  data-cms-field={`team[${index}].bio`}
                >
                  {member.bio}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
