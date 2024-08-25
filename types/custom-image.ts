import { Fill } from "@/app/_components/fill";

export type Border = {
  type: string;
  stroke: Fill;
  strokeWidth: number;
  borderRadius: number;
  strokeDashArray: number[];
};
