import { useEffect } from "react";
import { applySeo } from "../lib/seo";

type SeoProps = {
  title: string;
  description: string;
  path?: string;
};

export function Seo(props: SeoProps) {
  useEffect(() => {
    applySeo(props);
  }, [props]);

  return null;
}
