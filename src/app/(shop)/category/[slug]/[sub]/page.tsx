import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string; sub: string }>;
}

export default async function SubcategoryRedirect({ params }: Props) {
  const { slug, sub } = await params;
  redirect(`/category/${slug}?subcategory=${sub}`);
}
