import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/data";
import CustomPageView from "@/components/CustomPageView";

export const dynamic = "force-dynamic";

export default async function CustomPage({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);
  if (!page || page.builtIn) return notFound();

  return <CustomPageView page={page} />;
}
