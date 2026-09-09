import imageData from './images.json';

export type ImagePart = { src: string; width: number; height: number };
export type ActivityImage = {
  id: string;
  originalName: string;
  kind: string;
  thumb: string;
  parts: ImagePart[];
  label: string;
};
export type Activity = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  tags: string[];
  points: { title: string; text: string }[];
  cover: string;
  images: ActivityImage[];
  accent: string;
};
const content = [
  {
    slug: 'dragon-boat',
    title: '端午 · 把心意装进节日',
    subtitle: '节日福利 / 主题陈列 / 活动回顾',
    category: '节日活动',
    accent: '#dbe9cd',
    description:
      '以端午节日氛围为主线，将福利礼品、下午茶与现场陈列结合。从礼盒介绍、活动宣传到现场照片与回顾，记录一份节日心意如何来到同事身边。',
    tags: ['节日福利', '现场布置', '活动宣传'],
    points: [
      {
        title: '一份节日心意',
        text: '礼盒介绍与福利陈列，让节日关怀有具体的呈现。',
      },
      {
        title: '一个相聚现场',
        text: '饮品、餐食与端午主题布置，共同营造轻松的交流氛围。',
      },
      {
        title: '一套活动记录',
        text: '宣传物料、现场照片与回顾长图，保留活动的不同侧面。',
      },
    ],
    labels: [
      '端午福利礼盒介绍',
      '端午活动回顾',
      '端午主题活动长图',
      '下午茶与主题陈列',
      '端午现场细节',
      '端午活动现场全景',
      '端午福利陈列',
    ],
  },
  {
    slug: 'new-office',
    title: '新空间 · 向上生长',
    subtitle: '23 楼办公空间 / 入驻活动',
    category: '办公空间',
    accent: '#d6e3f4',
    description:
      '新空间启用，也是一次团队共同的出发。记录 23 楼办公环境、入驻仪式区与主题活动，用完整的现场资料呈现空间和人的连接。',
    tags: ['办公空间', '入驻活动', '环境布置'],
    points: [
      {
        title: '办公空间',
        text: '工位、公共区域与现场环境，展示新办公空间的面貌。',
      },
      {
        title: '入驻氛围',
        text: '蓝白气球与主题背景，将办公场地转化为有仪式感的相聚现场。',
      },
      {
        title: '共同的记录',
        text: '活动回顾串联空间展示、现场环节与员工互动。',
      },
    ],
    labels: ['23 楼新空间入驻回顾', '入驻活动仪式区', '新办公区工位与布置'],
  },
  {
    slug: 'mid-autumn',
    title: '中秋 · 把团圆带到身边',
    subtitle: '中秋福利 / 双节活动 / 现场布置',
    category: '节日活动',
    accent: '#f7e6ba',
    description:
      '用福利礼盒、节日餐食和主题布置，传递中秋的团圆心意。收录中秋福利介绍、双节活动回顾与现场照片，留下属于办公室的节日记忆。',
    tags: ['福利礼盒', '节日氛围', '活动回顾'],
    points: [
      {
        title: '福利介绍',
        text: '以图文介绍节日礼盒及发放安排，清楚传递福利信息。',
      },
      {
        title: '双节氛围',
        text: '围绕中秋与国庆主题，通过背景、陈列和餐食呈现节日感。',
      },
      {
        title: '现场细节',
        text: '从全景到餐食特写，记录布置与员工关怀的具体细节。',
      },
    ],
    labels: [
      '中秋主题宣传海报',
      '中秋福利礼盒介绍',
      '中秋国庆双节活动回顾',
      '中秋活动餐食特写',
      '中秋活动主题布置',
    ],
  },
  {
    slug: 'qixi',
    title: '七夕 · 把浪漫带进日常',
    subtitle: '主题陈列 / 节日关怀',
    category: '节日活动',
    accent: '#f4d8e4',
    description:
      '用统一的粉色主题、礼袋陈列与节日装饰，把七夕的轻松和仪式感带进办公室。现场全景与细节照片，记录这份日常里的小惊喜。',
    tags: ['节日关怀', '主题陈列', '氛围营造'],
    points: [
      {
        title: '主题一致',
        text: '粉色礼袋与节日装饰呼应，让现场形成鲜明的视觉记忆。',
      },
      {
        title: '细节陈列',
        text: '通过整齐的物资摆放与主题元素，让福利领取也有仪式感。',
      },
      { title: '现场留存', text: '全景、近景与拼图，多角度记录节日现场。' },
    ],
    labels: ['七夕主题陈列细节', '七夕活动现场全景', '七夕活动照片拼图'],
  },
  {
    slug: 'programmer-day',
    title: '1024 · 为热爱补充能量',
    subtitle: '程序员节 / 下午茶 / 员工互动',
    category: '节日活动',
    accent: '#dfd9fa',
    description:
      '围绕程序员节的职业认同与员工关怀，活动物料呈现了书单征集、肩颈放松、下午茶及互动游戏等环节。用贴近日常工作场景的内容，让节日更有参与感。',
    tags: ['员工互动', '下午茶', '节日关怀'],
    points: [
      {
        title: '贴近同事需求',
        text: '活动预告中包含书单征集与肩颈放松等关怀安排。',
      },
      {
        title: '轻松参与',
        text: '下午茶与互动游戏，为紧张工作之余留出交流空间。',
      },
      {
        title: '活动前后呼应',
        text: '预告海报、现场影像与回顾，共同呈现活动内容。',
      },
    ],
    labels: [
      '1024 程序员节活动回顾',
      '程序员节下午茶特写',
      '程序员节现场照片拼图',
      '1024 程序员节活动预告',
    ],
  },
  {
    slug: 'christmas',
    title: '圣诞 · 让快乐有迹可循',
    subtitle: '节日布置 / 集章互动 / 活动回顾',
    category: '节日活动',
    accent: '#e1e8d7',
    description:
      '将圣诞装饰、下午茶与集章互动融入办公日常。通过主题物料、餐饮陈列和活动回顾，记录一场充满节日气氛的团队相聚。',
    tags: ['节日布置', '互动玩法', '下午茶'],
    points: [
      {
        title: '营造节日氛围',
        text: '圣诞元素与餐饮陈列结合，形成完整的现场主题。',
      },
      {
        title: '集章互动',
        text: '地图集章物料提供明确的参与线索，丰富活动体验。',
      },
      { title: '回顾留存', text: '用现场照片与长图回顾，保存这场节日相聚。' },
    ],
    labels: ['圣诞活动回顾', '圣诞下午茶现场', '圣诞地图集章活动物料'],
  },
  {
    slug: 'kickoff',
    title: '开工大吉 · 从好心情出发',
    subtitle: '开工仪式 / 员工关怀 / 现场布置',
    category: '员工关怀',
    accent: '#f3d8c8',
    description:
      '以红色主题陈列、餐食和开工装饰迎接新的工作节奏。三张现场照片记录不同视角的布置，让假期后的第一份问候落在细节里。',
    tags: ['开工仪式', '现场陈列', '员工关怀'],
    points: [
      { title: '开工主题', text: '红色装饰与吉祥祝福构成鲜明的开工氛围。' },
      {
        title: '餐饮准备',
        text: '餐食、饮品与主题台面结合，让同事在轻松的相聚中开启工作。',
      },
      { title: '多角度记录', text: '通过不同视角呈现完整布置及现场细节。' },
    ],
    labels: ['开工活动餐食与主题陈列', '开工大吉现场布置', '开工活动主题摊位'],
  },
  {
    slug: 'new-year-tea',
    title: '春节前 · 一起喝杯下午茶',
    subtitle: '节前相聚 / 下午茶 / 员工关怀',
    category: '员工关怀',
    accent: '#f1d8bc',
    description:
      '在春节假期前，用一场下午茶为日常工作留一个轻松的停顿。主题背景、饮品与餐食陈列，共同组成这份节前问候。',
    tags: ['节前相聚', '下午茶', '氛围布置'],
    points: [
      { title: '节前问候', text: '通过春节主题背景与陈列，传递假期前的祝福。' },
      { title: '轻松相聚', text: '餐食与饮品提供自然的交流契机。' },
      {
        title: '记录细节',
        text: '现场全景与物资特写，留下节前活动的完整印象。',
      },
    ],
    labels: ['春节前下午茶饮品特写', '春节前下午茶活动全景'],
  },
  {
    slug: 'summer',
    title: '夏日雪糕 · 一份清凉心意',
    subtitle: '季节关怀 / 福利宣传',
    category: '员工关怀',
    accent: '#d7ebf6',
    description:
      '以夏日雪糕为主题，将季节性的员工关怀转化为清晰、轻松的福利宣传。蓝白色海报与雪糕元素，直接传递活动主题。',
    tags: ['季节关怀', '福利宣传'],
    points: [
      { title: '季节主题', text: '以夏日清凉为主题，回应日常工作中的小需求。' },
      { title: '信息传达', text: '通过主题海报呈现雪糕福利与相关安排。' },
      { title: '物料记录', text: '保留完整宣传海报，展示福利沟通的方式。' },
    ],
    labels: ['夏日雪糕福利宣传海报'],
  },
  {
    slug: 'qingming',
    title: '清明 · 尝一口春天滋味',
    subtitle: '节气关怀 / 青团主题宣传',
    category: '节日活动',
    accent: '#e0ecd8',
    description:
      '围绕清明与青团主题，用清新的绿色和明确的活动文案，把节气文化融入员工关怀。收录完整主题宣传海报。',
    tags: ['节气关怀', '主题宣传'],
    points: [
      {
        title: '节气元素',
        text: '青团与绿色视觉呼应春日主题，传递熟悉的节日记忆。',
      },
      { title: '福利沟通', text: '用简洁的主题海报呈现活动信息。' },
      { title: '物料展示', text: '完整保留海报画面，便于查看文字与视觉细节。' },
    ],
    labels: ['清明青团主题宣传海报'],
  },
];
const images = imageData as Record<
  string,
  { cover: string; images: Omit<ActivityImage, 'label'>[] }
>;
export const activities: Activity[] = content.map(({ labels, ...item }) => ({
  ...item,
  cover: images[item.slug].cover,
  images: images[item.slug].images.map((image, index) => ({
    ...image,
    label: labels[index],
  })),
}));
export const categories = ['全部活动', '节日活动', '员工关怀', '办公空间'];
