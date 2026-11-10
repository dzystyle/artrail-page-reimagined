import explore1 from "@/assets/build-explore-1.jpg";
import explore2 from "@/assets/build-explore-2.jpg";
import explore3 from "@/assets/build-explore-3.jpg";
import explore4 from "@/assets/build-explore-4.jpg";
import explore5 from "@/assets/build-explore-5.jpg";

export type BuildWork = {
  name: string;
  image: string;
  type: string;
  /** Optional external app link opened when the card is clicked. */
  url?: string;
};

export const buildWorks: BuildWork[] = [
  { name: "电路工匠", image: explore1, type: "网页游戏" },
  { name: "潮汐研讨会", image: explore2, type: "网页游戏" },
  { name: "余烬之路", image: explore3, type: "网页游戏" },
  { name: "湿地观鸟", image: explore4, type: "网页游戏" },
  {
    name: "末班车",
    image: explore5,
    type: "互动故事",
    url: "http://10.1.165.88:43120/#/projects/a7f124cd-49d6-4aa7-98e4-659f301d8cf6/conversations/01a1c47c-fabd-773b-9fa3-2c3d4d9b6397",
  },
];
