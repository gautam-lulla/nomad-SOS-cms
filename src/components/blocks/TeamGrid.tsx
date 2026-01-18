import { cn } from "@/lib/utils";
import Image from "next/image";

interface TeamMember {
  name: string;
  title: string;
  description: string;
  imageSrc: string;
}

interface TeamGridProps {
  members: TeamMember[];
  className?: string;
  cmsEntry?: string;
  cmsFieldPrefix?: string;
}

export function TeamGrid({ members, className, cmsEntry, cmsFieldPrefix }: TeamGridProps) {
  const cmsAttrs = (index: number, field: string, type: "text" | "image" = "text") => {
    if (!cmsEntry) return {};
    const prefix = cmsFieldPrefix ? `${cmsFieldPrefix}.` : "";
    return {
      "data-cms-entry": cmsEntry,
      "data-cms-field": `${prefix}members[${index}].${field}`,
      "data-cms-type": type,
      "data-cms-label": `Team Member ${index + 1} ${field.charAt(0).toUpperCase() + field.slice(1)}`,
    };
  };

  return (
    <section className={cn("flex flex-col lg:flex-row gap-0", className)}>
      {members.map((member, index) => (
        <div key={index} className="flex-1 flex flex-col pb-6 lg:pb-3s">
          {/* Image */}
          <div
            className="relative h-[400px] md:h-[500px] lg:h-[700px] overflow-hidden"
            {...cmsAttrs(index, "imageSrc", "image")}
          >
            <Image
              src={member.imageSrc}
              alt={member.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="px-4 md:px-6 lg:px-[40px] pt-6 lg:pt-m">
            <div className="mb-xs">
              <h3
                className="font-gotham font-bold text-[16px] uppercase tracking-[0.48px] text-off-white-100 leading-tight"
                {...cmsAttrs(index, "name")}
              >
                {member.name}
              </h3>
              <p
                className="font-gotham font-bold text-[16px] uppercase tracking-[0.48px] text-off-white-100 leading-tight"
                {...cmsAttrs(index, "title")}
              >
                {member.title}
              </p>
            </div>
            <p
              className="font-sabon text-body-s text-off-white-100 leading-relaxed"
              {...cmsAttrs(index, "description")}
            >
              {member.description}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
