import { useEffect, useState } from "react";
import { Route, Router, Switch } from "wouter";
import { Toaster } from "sonner";

import { GarageSite } from "./components/GarageSite";
import { WorkIndex } from "./pages/WorkIndex";
import { CaseStudy } from "./pages/CaseStudy";
import { getGarageContent } from "./lib/content";
import type { GarageContent } from "./lib/types";
import { fallbackContent } from "./lib/fallback-data";

const routerBase = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  const [content, setContent] = useState<GarageContent>(fallbackContent);

  useEffect(() => {
    getGarageContent().then(setContent).catch(() => setContent(fallbackContent));
  }, []);

  return (
    <Router base={routerBase}>
      <Switch>
        <Route path="/">
          <GarageSite content={content} />
        </Route>
        <Route path="/work">
          <WorkIndex content={content} />
        </Route>
        <Route path="/work/:id">
          <CaseStudy content={content} />
        </Route>
        <Route>
          <GarageSite content={content} />
        </Route>
      </Switch>
      <Toaster position="bottom-right" theme="dark" richColors />
    </Router>
  );
}
