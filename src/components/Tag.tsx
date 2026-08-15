import { Badge } from "./ui/badge";

type TagProps = {
  children: string;
};

export function Tag({ children }: TagProps) {
  return <Badge>{children}</Badge>;
}
