import Link from "next/link";
import type { ServiceDTO } from "@/lib/data";

export default function ServiceCard({ service }: { service: ServiceDTO }) {
  return (
    <Link href={`/services#${service.slug}`} className="service-card reveal">
      <div className="service-icon" dangerouslySetInnerHTML={{ __html: service.icon }} />
      <h4>{service.title}</h4>
      <p>{service.shortDescription}</p>
    </Link>
  );
}
