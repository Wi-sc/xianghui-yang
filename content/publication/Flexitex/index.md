---
title: "FlexiTex: Enhancing Texture Generation via Visual Guidance"
authors:
- Dadong Jiang
- admin
- Zibo Zhao
- Sheng Zhang
- Jiaao Yu
- Zeqiang Lai
- Shaoxiong Yang
- Chunchao Guo
- Xiaobo Zhou
- Zhihui Ke
author_notes:
# - "Equal contribution"
# - "Equal contribution"
date: "2024-09-01T00:00:00Z"
doi: ""

# Schedule page publish date (NOT publication's date).
publishDate: "2025-03-01T00:00:00Z"

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["1"]

# Publication name and optional abbreviated publication name.
publication: "*The 39th Annual AAAI Conference on Artificial Intelligence*"
publication_short: ""

abstract: Recent texture generation methods achieve impressive results due to the powerful generative prior they leverage from large-scale text-to-image diffusion models. However, abstract textual prompts are limited in providing global textural or shape information, which results in the texture generation methods producing blurry or inconsistent patterns. To tackle this, we present FlexiTex, embedding rich information via visual guidance to generate a high-quality texture. The core of FlexiTex is the Visual Guidance Enhancement module, which incorporates more specific information from visual
guidance to reduce ambiguity in the text prompt and preserve high-frequency details. To further enhance the visual guidance, we introduce a Direction-Aware Adaptation module that automatically designs direction prompts based on different camera poses, avoiding the Janus problem and maintaining semantically global consistency. Benefiting from the visual guidance, FlexiTex produces quantitatively and qualitatively sound results, demonstrating its potential to advance texture generation for real-world applications.

# Summary. An optional shortened abstract.
summary: We present FlexiTex, embedding rich information via visual guidance to generate a high-quality texture. The core of FlexiTex is the Visual Guidance Enhancement module, which incorporates more specific information from visual guidance to reduce ambiguity in the text prompt and preserve high-frequency details. To further enhance the visual guidance, we introduce a Direction-Aware Adaptation module that automatically designs direction prompts based on different camera poses, avoiding the Janus problem and maintaining semantically global consistency.

tags:
- Texture Generation
featured: false

# links:
# - name: ""
#   url: ""
url_pdf: https://arxiv.org/pdf/2409.12431
url_code: ''
url_dataset: ''
url_poster: ''
url_project: 'https://patrickddj.github.io/FlexiTex/'
url_slides: ''
url_source: ''
url_video: ''

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  caption: 'Image credit: [**Unsplash**](https://unsplash.com/photos/jdD8gXaTZsc)'
  focal_point: ""
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects: []

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
slides: example
---

{{% callout note %}}
Click the *Cite* button above to demo the feature to enable visitors to import publication metadata into their reference management software.
{{% /callout %}}

{{% callout note %}}
Create your slides in Markdown - click the *Slides* button to check out the example.
{{% /callout %}}

Supplementary notes can be added here, including [code, math, and images](https://wowchemy.com/docs/writing-markdown-latex/).
