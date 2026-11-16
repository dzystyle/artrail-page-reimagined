export type HomeGamePreview = { id: string; title: string; image: string };
export const homeGameRows: { title: string; icon: string; categoryId: string; games: HomeGamePreview[] }[] = [
  { title: "热门话题", icon: "\ud83d\udd25", categoryId: "hot", games: [
    {"id": "section-1-1", "title": "Roadster Hours", "image": "/__l5e/assets-v1/2e79a4a3-8264-4148-8482-c5b2cbdc76bf/section-1-1.jpg"},
    {"id": "section-1-2", "title": "开往大海的末班车", "image": "/__l5e/assets-v1/70ff65f4-1f02-4c6b-8293-4b7fae7481f2/section-1-2.jpg"},
    {"id": "section-1-3", "title": "雾缭小径", "image": "/__l5e/assets-v1/11ff8de7-9b50-446e-a7a8-cf112e6a84de/section-1-3.jpg"},
    {"id": "section-1-4", "title": "突破点：异度巡回赛", "image": "/__l5e/assets-v1/efc16ac5-379e-4e90-bd16-3aa86903b8ac/section-1-4.jpg"},
    {"id": "section-1-5", "title": "蜡笔马达", "image": "/__l5e/assets-v1/2b978559-8aff-43ad-8536-49444a9fad86/section-1-5.jpg"},
  ] },
  { title: "刚落地", icon: "\u2b50", categoryId: "fresh", games: [
    {"id": "section-2-1", "title": "狮子座 · 七界", "image": "/__l5e/assets-v1/51fec136-7306-4a29-b735-f162b2ed2425/section-2-1.jpg"},
    {"id": "section-2-2", "title": "鞭子先生", "image": "/__l5e/assets-v1/694c82a7-f558-4069-9b1f-813834fb7c1e/section-2-2.jpg"},
    {"id": "section-2-3", "title": "Kabin Masinis：Lintas 视频", "image": "/__l5e/assets-v1/7c755e94-1985-4cbb-b2ec-5df5fc29173d/section-2-3.jpg"},
    {"id": "section-2-4", "title": "毒蛇荒原", "image": "/__l5e/assets-v1/282dc7f5-273f-4389-b047-2160e00160cc/section-2-4.jpg"},
    {"id": "section-2-5", "title": "冲刺爆发区", "image": "/__l5e/assets-v1/f006e5da-81f3-445d-85b8-ebca2107a75c/section-2-5.jpg"},
  ] },
  { title: "赛车", icon: "\ud83c\udfce\ufe0f", categoryId: "racing", games: [
    {"id": "section-3-1", "title": "Roadster", "image": "/__l5e/assets-v1/3fbabe83-5982-4c8e-bce7-09bd9a65bbff/section-3-1.jpg"},
    {"id": "section-3-2", "title": "淤泥与信号", "image": "/__l5e/assets-v1/0794626b-a19e-4c16-b38e-dddc7e42b680/section-3-2.jpg"},
    {"id": "section-3-3", "title": "奇异轨道", "image": "/__l5e/assets-v1/faff2098-289d-45da-80f4-b68e73681235/section-3-3.jpg"},
    {"id": "section-3-4", "title": "散热器", "image": "/__l5e/assets-v1/46b60906-55d3-4834-9c76-70b4f2585a76/section-3-4.jpg"},
    {"id": "section-3-5", "title": "宇宙潮汐", "image": "/__l5e/assets-v1/602725d4-2786-4150-8f10-c69a33a85742/section-3-5.jpg"},
  ] },
];
export const moreHomeGames: HomeGamePreview[] = [
  {"id": "more-1-1", "title": "再来一次", "image": "/__l5e/assets-v1/8171c87d-b1e8-4d19-89a9-9b65d4f4d966/more-1-1.jpg"},
  {"id": "more-1-2", "title": "舰队周一—旧金山", "image": "/__l5e/assets-v1/801b6208-2eb4-40d4-8be4-e35ce0be6b9d/more-1-2.jpg"},
  {"id": "more-1-3", "title": "滚动共和国", "image": "/__l5e/assets-v1/9704ba3d-45ce-4c89-a968-dac987a3ad58/more-1-3.jpg"},
  {"id": "more-1-4", "title": "空中猛击", "image": "/__l5e/assets-v1/0ed35b39-1c4b-4527-9e55-b4b90c8180c5/more-1-4.jpg"},
  {"id": "more-1-5", "title": "拳击手", "image": "/__l5e/assets-v1/33867072-a23a-4510-924c-de65498cef9b/more-1-5.jpg"},
  {"id": "more-2-1", "title": "漂移抽奖", "image": "/__l5e/assets-v1/15cb6f21-975a-407c-8467-935c55dccd96/more-2-1.jpg"},
  {"id": "more-2-2", "title": "防波堤", "image": "/__l5e/assets-v1/fb3078bf-25d5-45e6-9a01-27ed83d098d8/more-2-2.jpg"},
  {"id": "more-2-3", "title": "车库到电网", "image": "/__l5e/assets-v1/dea07b80-2dd2-4b7a-8a7a-930df8b87d92/more-2-3.jpg"},
  {"id": "more-2-4", "title": "怪物酒店", "image": "/__l5e/assets-v1/04736b19-9595-4039-b528-cf09ef91908f/more-2-4.jpg"},
  {"id": "more-2-5", "title": "削减", "image": "/__l5e/assets-v1/bddbd1be-717f-4005-870f-ab871b481795/more-2-5.jpg"},
  {"id": "more-3-1", "title": "随身摄像机拍摄者", "image": "/__l5e/assets-v1/3d6b2b4a-00d3-4d54-9f10-b760a685f12d/more-3-1.jpg"},
  {"id": "more-3-2", "title": "部落突袭", "image": "/__l5e/assets-v1/086b9ac6-5adc-40ec-bfaa-7f0c2b9c3025/more-3-2.jpg"},
  {"id": "more-3-3", "title": "巨像手套", "image": "/__l5e/assets-v1/6321b903-48bb-4a61-8fcc-7a835b7db5b7/more-3-3.jpg"},
  {"id": "more-3-5", "title": "夜行者", "image": "/__l5e/assets-v1/6b152fbc-6b55-4b29-8938-43da19f2ec79/more-3-5.jpg"},
];
