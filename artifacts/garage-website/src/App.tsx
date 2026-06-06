import { useEffect, useState } from "react";
import { GarageSite } from "./components/GarageSite";
import { getGarageContent } from "./lib/content";
import type { GarageContent } from "./lib/types";
import { fallbackContent } from "./lib/fallback-data";

export default function App() {
  const [content, setContent] = useState<GarageContent>(fallbackContent);

  useEffect(() => {
    getGarageContent().then(setContent).catch(() => setContent(fallbackContent));
  }, []);

  return <GarageSite content={content} />;
}
