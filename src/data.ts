// ============================================================================
//  Site content — Xianghui (Sean) Yang
//  All data is sourced from the author's real profile & publications.
// ============================================================================

const BASE = import.meta.env.BASE_URL // '/xianghui-yang/'

export const profile = {
  name: 'Xianghui Yang',
  alias: 'Sean',
  username: 'xhyang', // shell handle used in the terminal prompt / header
  handle: 'Wi-sc',
  title: 'Senior Research Scientist',
  affiliation: 'Tencent Hunyuan',
  tagline: 'Turning pixels and words into high-fidelity 3D worlds.',
  email: 'yangxhui6@gmail.com',
  avatar: `${BASE}matri_profile.png`,
  cv: `${BASE}CV.pdf`,
  status: 'open to collaboration',
}

export const socials: { label: string; handle: string; href: string; key: string }[] = [
  { label: 'GitHub', handle: '@Wi-sc', href: 'https://github.com/Wi-sc', key: 'github' },
  { label: 'Scholar', handle: 'Xianghui Yang', href: 'https://scholar.google.com.hk/citations?user=e9EzzWAAAAAJ&hl=zh-CN', key: 'scholar' },
  { label: 'LinkedIn', handle: 'xianghui-yang', href: 'https://www.linkedin.com/in/xianghui-yang-3b3234180/', key: 'linkedin' },
  { label: 'Email', handle: 'yangxhui6@gmail.com', href: 'mailto:yangxhui6@gmail.com', key: 'mail' },
  { label: 'CV', handle: 'pdf', href: `${BASE}CV.pdf`, key: 'cv' },
]

// Quick-stat rows for the terminal status panel
export const stats: { label: string; value: string }[] = [
  { label: 'role', value: 'Sr. Research Scientist' },
  { label: 'org', value: 'Tencent Hunyuan' },
  { label: 'papers', value: '22' },
  { label: 'citations', value: '900+' },
  { label: 'focus', value: '3D Generation' },
  { label: 'now', value: 'scaling Hunyuan3D' },
]

export const research: { title: string; desc: string; tag: string }[] = [
  {
    title: '3D Generation',
    desc: 'Foundation models that synthesize high-resolution textured 3D assets from a single image or a text prompt — the Hunyuan3D series.',
    tag: 'GEN',
  },
  {
    title: 'Mesh Generation',
    desc: 'Scalable, locality-aware autoencoders and compressive tokenization for native, art-quality mesh generation (BPT, Nautilus, FreeMesh).',
    tag: 'MESH',
  },
  {
    title: 'Neural Fields',
    desc: 'Implicit shape representation by explicit learning — neural vector fields and zero-shot single-view reconstruction.',
    tag: '3D',
  },
  {
    title: 'Texture & PBR Synthesis',
    desc: 'Production-ready, physically based texture generation guided by visual and geometric priors (FlexiTex, PBR3DGen, Hunyuan3D-Paint).',
    tag: 'TEX',
  },
  {
    title: 'Diffusion Models',
    desc: 'Flow- and diffusion-based generative transformers, multi-view consistency, and fast vecset diffusion for shapes.',
    tag: 'DIFF',
  },
  {
    title: 'Foundation & Multimodal',
    desc: 'Large-scale multimodal learning bridging language, images, and 3D geometry for controllable content creation.',
    tag: 'FND',
  },
]

export const education: {
  year: string
  degree: string
  school: string
  advisor: string
  detail: string
}[] = [
  {
    year: '2019 — 2024',
    degree: 'Ph.D. in Artificial Intelligence',
    school: 'The University of Sydney · USYD-Vision Lab',
    advisor: 'Advised by Prof. Luping Zhou, Prof. Guosheng Lin & Prof. Wanli Ouyang',
    detail: 'Research on 3D vision, neural fields, and single-view reconstruction.',
  },
  {
    year: '2015 — 2019',
    degree: 'B.Sc. in Physics',
    school: 'Nanjing University · School of Physics',
    advisor: '',
    detail: 'Fundamentals in mathematics, physics, and computation.',
  },
]

export const experience: { year: string; role: string; org: string; detail: string }[] = [
  {
    year: '2024 — now',
    role: 'Senior Research Scientist',
    org: 'Tencent Hunyuan',
    detail: 'Leading research on 3D content generation. First author & core contributor of the Hunyuan3D series.',
  },
  {
    year: '2023',
    role: 'Applied Science Intern',
    org: 'Amazon',
    detail: '3D content generation for Amazon Advertisement.',
  },
]

export interface Paper {
  title: string
  authors: string // comma-separated; "Xianghui Yang" is highlighted automatically
  venue: string
  year: number
  type: 'conference' | 'journal' | 'preprint'
  tags: string[]
  links: { label: string; href: string }[]
  highlight?: boolean
}

const ME = 'Xianghui Yang'

export const papers: Paper[] = [
  {
    title: 'HY3D-Bench: A Benchmark for Generation of 3D Assets',
    authors: 'HY3D Team, ' + ME,
    venue: 'Preprint',
    year: 2026,
    type: 'preprint',
    tags: ['benchmark'],
    links: [{ label: 'pdf', href: 'https://arxiv.org/abs/2602.03907' }, { label: 'data', href: 'https://huggingface.co/datasets/tencent/HY3D-Bench' }],
    highlight: true,
  },
  {
    title: 'Hunyuan3D 2.5: Towards High-Fidelity 3D Assets Generation with Ultimate Details',
    authors: 'HY3D Team, ' + ME,
    venue: 'Preprint',
    year: 2025,
    type: 'preprint',
    tags: [],
    links: [{ label: 'pdf', href: 'https://arxiv.org/abs/2506.16504' }, { label: 'code', href: 'https://github.com/Tencent/Hunyuan3D-2' }, { label: 'project', href: 'http://3d-models.hunyuan.tencent.com/' }],
    highlight: true,
  },
  {
    title: 'Hunyuan3D 2.1: From Images to High-Fidelity 3D Assets with Production-Ready PBR Material',
    authors: 'HY3D Team',
    venue: 'Preprint',
    year: 2025,
    type: 'preprint',
    tags: [],
    links: [{ label: 'pdf', href: 'https://arxiv.org/abs/2506.15442' }, { label: 'code', href: 'https://github.com/Tencent/Hunyuan3D-2' }, { label: 'project', href: 'http://3d-models.hunyuan.tencent.com/' }],
    highlight: true,
  },
  {
    title: 'HunyuanWorld 1.0: Generating Immersive, Explorable, Interactive 3D Worlds from Words or Pixels',
    authors: 'HY3D Team, ' + ME,
    venue: 'Preprint',
    year: 2025,
    type: 'preprint',
    tags: [],
    links: [{ label: 'pdf', href: 'https://arxiv.org/abs/2507.21809' }],
    highlight: true,
  },
  {
    title: 'Hunyuan3D Studio: End-to-End AI Pipeline for Game-Ready 3D Asset Generation',
    authors: 'HY3D Team, ' + ME,
    venue: 'Preprint',
    year: 2025,
    type: 'preprint',
    tags: [],
    links: [{ label: 'pdf', href: 'https://arxiv.org/abs/2509.12815' }, { label: 'project', href: 'http://3d-models.hunyuan.tencent.com/' }],
    highlight: true,
  },
  {
    title: 'Hunyuan3D-Omni: A Unified Framework for Controllable Generation of 3D Assets',
    authors: 'HY3D Team, ' + ME,
    venue: 'Preprint',
    year: 2025,
    type: 'preprint',
    tags: [],
    links: [{ label: 'pdf', href: 'https://arxiv.org/pdf/2509.21245' }, { label: 'project', href: 'http://3d-models.hunyuan.tencent.com/' }],
    highlight: true,
  },
  {
    title: 'ArtLLM: Generating Articulated Assets via 3D LLM',
    authors: 'Penghao Wang, Siyuan Xie, Hongyu Yan, ' + ME + ', Jingwei Huang, Chunchao Guo, Jiayuan Gu',
    venue: 'CVPR 2025',
    year: 2025,
    type: 'conference',
    tags: [],
    links: [{ label: 'pdf', href: 'https://arxiv.org/abs/2603.01142' }],
  },
  {
    title: 'PBR3DGen: A VLM-Guided Mesh Generation with High-Quality PBR Texture',
    authors: 'Xiaokang Wei*, Bowen Zhang*, ' + ME + ', Yuxuan Wang, Chunchao Guo, Xi Zhao, Yan Luximon',
    venue: 'AAAI 2026',
    year: 2026,
    type: 'conference',
    tags: [],
    links: [{ label: 'pdf', href: 'https://ojs.aaai.org/index.php/AAAI/article/view/38030' }],
  },
  {
    title: 'Mesh-RFT: Enhancing Mesh Generation via Fine-Grained Reinforcement Fine-Tuning',
    authors: 'Jian Liu*, Jing Xu*, Song Guo, Jing Li, Jingfeng Guo, Jiaao Yu, Haohan Weng, Biwen Lei, ' + ME + ', Zhuo Chen, Fangqi Zhu, Tao Han, Chunchao Guo',
    venue: 'NeurIPS 2025',
    year: 2025,
    type: 'conference',
    tags: [],
    links: [{ label: 'pdf', href: 'https://proceedings.neurips.cc/paper_files/paper/2025/file/e4ca3675c3569a7c222c8351e4db8b9e-Paper-Conference.pdf' }],
  },
  {
    title: 'Nautilus: Locality-Aware Autoencoder for Scalable Mesh Generation',
    authors: 'Yuxuan Wang*, Xuanyu Yi*, Haohan Weng*, Qingshan Xu, Xiaokang Wei, ' + ME + ', Chunchao Guo, Long Chen, Hanwang Zhang',
    venue: 'ICCV 2025',
    year: 2025,
    type: 'conference',
    tags: [],
    links: [{ label: 'pdf', href: 'https://openaccess.thecvf.com/content/ICCV2025/papers/Wang_Nautilus_Locality-aware_Autoencoder_for_Scalable_Mesh_Generation_ICCV_2025_paper.pdf' }],
  },
  {
    title: 'FreeMesh: Boosting Mesh Generation with Coordinates Merging',
    authors: 'Jian Liu, Haohan Weng, Biwen Lei, ' + ME + ', Zibo Zhao, Zhuo Chen, Song Guo, Tao Han, Chunchao Guo',
    venue: 'ICML 2025',
    year: 2025,
    type: 'conference',
    tags: [],
    links: [{ label: 'pdf', href: 'https://arxiv.org/abs/2505.13573' }],
  },
  {
    title: 'Unleashing Vecset Diffusion Model for Fast Shape Generation',
    authors: 'Zeqiang Lai*, Yunfei Zhao*, Zibo Zhao, Haolin Liu, Fuyun Wang, Huiwen Shi, ' + ME + ', Qingxiang Lin, Jingwei Huang, Yuhong Liu, Jie Jiang, Chunchao Guo, Xiangyu Yue',
    venue: 'ICCV 2025',
    year: 2025,
    type: 'conference',
    tags: ['Hunyuan3D-DiT'],
    links: [{ label: 'pdf', href: 'https://openaccess.thecvf.com/content/ICCV2025/papers/Lai_Unleashing_Vecset_Diffusion_Model_for_Fast_Shape_Generation_ICCV_2025_paper.pdf' }, { label: 'code', href: 'https://github.com/Tencent-Hunyuan/FlashVDM' }, { label: 'project', href: 'http://3d-models.hunyuan.tencent.com/' }],
  },
  {
    title: 'Hunyuan3D 2.0: Scaling Diffusion Models for High Resolution Textured 3D Assets Generation',
    authors: 'HY3D Team, ' + ME,
    venue: 'Preprint',
    year: 2025,
    type: 'preprint',
    tags: ['flagship'],
    links: [{ label: 'pdf', href: 'https://arxiv.org/pdf/2501.12202' }, { label: 'code', href: 'https://github.com/Tencent/Hunyuan3D-2' }, { label: 'project', href: 'http://3d-models.hunyuan.tencent.com/' }],
    highlight: true,
  },
  {
    title: 'Scaling Mesh Generation via Compressive Tokenization (BPT)',
    authors: 'Haohan Weng, Zibo Zhao, Biwen Lei, ' + ME + ', Jian Liu, Zeqiang Lai, Zhuo Chen, Yuhong Liu, Jie Jiang, Chunchao Guo, Tong Zhang, Shenghua Gao, C. L. Philip Chen',
    venue: 'CVPR 2025',
    year: 2025,
    type: 'conference',
    tags: [],
    links: [{ label: 'pdf', href: 'https://arxiv.org/pdf/2411.07025' }, { label: 'code', href: 'https://github.com/whaohan/bpt' }, { label: 'project', href: 'https://whaohan.github.io/bpt/' }],
    highlight: true,
  },
  {
    title: 'FlexiTex: Enhancing Texture Generation via Visual Guidance',
    authors: 'Dadong Jiang, ' + ME + ', Zibo Zhao, Sheng Zhang, Jiaao Yu, Zeqiang Lai, Shaoxiong Yang, Chunchao Guo, Xiaobo Zhou, Zhihui Ke',
    venue: 'AAAI 2025',
    year: 2025,
    type: 'conference',
    tags: [],
    links: [{ label: 'pdf', href: 'https://arxiv.org/pdf/2409.12431' }, { label: 'project', href: 'https://patrickddj.github.io/FlexiTex/' }],
  },
  {
    title: 'TimeFormer: Capturing Temporal Relationships of Deformable 3D Gaussians for Robust Reconstruction',
    authors: 'Dadong Jiang, Zhihui Ke, Xiaobo Zhou, Zhi Hou, ' + ME + ', Wenbo Hu, Tie Qiu, Chunchao Guo',
    venue: 'ICCV 2025',
    year: 2025,
    type: 'conference',
    tags: [],
    links: [{ label: 'pdf', href: 'https://arxiv.org/pdf/2411.11941' }, { label: 'code', href: 'https://github.com/PatrickDDj/TimeFormer-Code' }, { label: 'project', href: 'https://patrickddj.github.io/TimeFormer/' }],
  },
  {
    title: 'Hunyuan3D-1.0: A Unified Framework for Text-to-3D and Image-to-3D Generation',
    authors: 'HY3D Team, ' + ME,
    venue: 'Preprint',
    year: 2024,
    type: 'preprint',
    tags: ['co-first', 'first 3D GenAI system'],
    links: [{ label: 'pdf', href: 'https://arxiv.org/pdf/2411.02293' }, { label: 'code', href: 'https://github.com/Tencent/Hunyuan3D-1' }, { label: 'project', href: 'http://3d-models.hunyuan.tencent.com/' }],
    highlight: true,
  },
  {
    title: 'ViewFusion: Towards Multi-View Consistency via Interpolated Denoising',
    authors: ME + ', Yan Zuo, Sameera Ramasinghe, Loris Bazzani, Gil Avraham, Anton van den Hengel',
    venue: 'CVPR 2024',
    year: 2024,
    type: 'conference',
    tags: ['first-author'],
    links: [{ label: 'pdf', href: 'https://arxiv.org/pdf/2402.18842.pdf' }, { label: 'code', href: 'https://github.com/Wi-sc/ViewFusion' }, { label: 'project', href: 'https://wi-sc.github.io/ViewFusion.github.io/' }],
    highlight: true,
  },
  {
    title: 'Neural Vector Fields: Implicit Representation by Explicit Learning',
    authors: ME + ', Guosheng Lin, Zhenghao Chen, Luping Zhou',
    venue: 'CVPR 2023',
    year: 2023,
    type: 'conference',
    tags: ['first-author'],
    links: [{ label: 'pdf', href: 'https://openaccess.thecvf.com/content/CVPR2023/papers/Yang_Neural_Vector_Fields_Implicit_Representation_by_Explicit_Learning_CVPR_2023_paper.pdf' }, { label: 'code', href: 'https://github.com/Wi-sc/NVF' }, { label: 'video', href: 'https://www.youtube.com/watch?v=GMXKoJfmHrU' }],
    highlight: true,
  },
  {
    title: 'Neural Vector Fields: Generalizing Distance Vector Fields by Codebooks and Zero-Curl Regularization',
    authors: ME + ', Guosheng Lin, Zhenghao Chen, Luping Zhou',
    venue: 'IEEE TPAMI',
    year: 2025,
    type: 'journal',
    tags: ['first-author'],
    links: [{ label: 'pdf', href: 'https://openaccess.thecvf.com/content/CVPR2023/papers/Yang_Neural_Vector_Fields_Implicit_Representation_by_Explicit_Learning_CVPR_2023_paper.pdf' }],
    highlight: true,
  },
  {
    title: 'ZeroMesh: Zero-shot Single-view 3D Mesh Reconstruction',
    authors: ME + ', Guosheng Lin, Luping Zhou',
    venue: 'IEEE TIP',
    year: 2023,
    type: 'journal',
    tags: ['first-author'],
    links: [{ label: 'pdf', href: 'https://arxiv.org/abs/2208.02676' }],
  },
  {
    title: 'BriNet: Towards Bridging the Intra-class and Inter-class Gaps in One-Shot Segmentation',
    authors: ME + ', Bairun Wang, Kaige Chen, Xinchi Zhou, Shuai Yi, Wanli Ouyang, Luping Zhou',
    venue: 'BMVC 2020',
    year: 2020,
    type: 'conference',
    tags: ['first-author'],
    links: [{ label: 'pdf', href: 'https://arxiv.org/abs/2008.06226' }, { label: 'code', href: 'https://github.com/Wi-sc/BriNet.git' }, { label: 'video', href: 'https://www.youtube.com/watch?v=9EaT6ZCtcqk&t=6s' }],
  },
]

export const news: { date: string; text: string }[] = [
  { date: '2026.02', text: 'HY3D-Bench released — a benchmark for 3D asset generation.' },
  { date: '2025.05', text: 'Hunyuan3D 2.5 released — towards ultimate 3D details.' },
  { date: '2025.05', text: 'Hunyuan3D 2.1 ships with production-ready PBR materials.' },
  { date: '2025.04', text: 'HunyuanWorld 1.0 — generating immersive, explorable 3D worlds.' },
  { date: '2025.01', text: 'Hunyuan3D 2.0 released — scaling 3D generation to new heights.' },
  { date: '2024.11', text: 'Hunyuan3D 1.0 — the first open text & image-to-3D generation system.' },
]

export const techStack: string[] = [
  'PyTorch', 'CUDA', 'Diffusers', 'PyTorch3D', 'Trimesh', 'Blender',
  'NumPy', 'Transformers', 'NeRF', '3DGS', 'LaTeX', 'Linux',
]

export const navItems: { id: string; label: string }[] = [
  { id: 'about', label: 'about' },
  { id: 'cv', label: 'cv' },
  { id: 'research', label: 'research' },
  { id: 'publications', label: 'papers' },
  { id: 'contact', label: 'contact' },
]
