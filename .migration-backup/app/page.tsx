import { GarageSite } from "@/app/components/GarageSite";
import { getGarageContent } from "@/lib/content";

export default async function Home() {
  const content = await getGarageContent();

  return <GarageSite content={content} />;
}
