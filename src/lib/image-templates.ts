import noise from "@/assets/image-template-one-1.jpg";
import style from "@/assets/image-template-one-2.jpg";
import vfx from "@/assets/image-template-one-3.jpg";
import elements from "@/assets/image-template-one-4.jpg";
import restyle from "@/assets/image-template-one-5.jpg";
import controls from "@/assets/image-template-two-1.jpg";
import sprites from "@/assets/image-template-two-2.jpg";
import wireframe from "@/assets/image-template-two-3.jpg";
import scene from "@/assets/image-template-two-4.jpg";
import character from "@/assets/image-template-two-5.jpg";

export const imageCategories = ["全部", "角色", "场景", "图标", "宣传图", "UI 界面", "风格转换", "绘画辅助"];
export const imageTemplates = [
  { id: "noise", title: "噪点去除器", image: noise, categories: ["角色", "绘画辅助"] },
  { id: "style", title: "风格转换器", image: style, categories: ["场景", "风格转换"] },
  { id: "vfx", title: "抠特效", image: vfx, categories: ["宣传图", "绘画辅助"] },
  { id: "elements", title: "界面元素拆分", image: elements, categories: ["UI 界面", "图标"] },
  { id: "restyle", title: "界面改造器", image: restyle, categories: ["UI 界面", "风格转换"] },
  { id: "controls", title: "UI界面控件", image: controls, categories: ["UI 界面", "图标"] },
  { id: "sprites", title: "雪碧图拆分", image: sprites, categories: ["图标", "绘画辅助"] },
  { id: "wireframe", title: "交互图转界面", image: wireframe, categories: ["UI 界面"] },
  { id: "scene", title: "场景元素拆分", image: scene, categories: ["场景", "绘画辅助"] },
  { id: "character", title: "角色拆分PSD", image: character, categories: ["角色", "绘画辅助"] },
];
export type ImageTemplate = typeof imageTemplates[number];
export function filterImageTemplates(category: string) {
  return category === "全部" ? imageTemplates : imageTemplates.filter(item => item.categories.includes(category));
}