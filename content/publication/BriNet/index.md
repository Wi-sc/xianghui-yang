---
title: 'BriNet: Towards Bridging the Intra-class and Inter-class Gaps in One-Shot Segmentation'

# Authors
# If you created a profile for a user (e.g. the default `admin` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - admin
  - Bairun Wang
  - Kaige Chen
  - Xinchi Zhou
  - Shuai Yi
  - Wanli Ouyang
  - Luping Zhou

# Author notes (optional)
author_notes:
  # - 'Equal contribution'
  # - 'Equal contribution'

date: '2020-02-01T00:00:00Z'
doi: ''

# Schedule page publish date (NOT publication's date).
publishDate: '2020-06-01T00:00:00Z'

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ['1']

# Publication name and optional abbreviated publication name.
publication: In *The British Machine Vision Conference 2020*
publication_short: In *BMVC2020*

abstract: Few-shot segmentation focuses on the generalization of models to segment unseen object instances with limited training samples. Although tremendous improvements have been achieved, existing methods are still constrained by two factors. (1) The information interaction between query and support images is not adequate, leaving intra-class gap. (2) The object categories at the training and inference stages have no overlap, leaving the inter-class gap. Thus, we propose a framework, BriNet, to bridge these gaps. First, more information interactions are encouraged between the extracted features of the query and support images, i.e., using an Information Exchange Module to emphasize the common objects. Furthermore, to precisely localize the query objects, we design a multi-path finegrained strategy which is able to make better use of the support feature representations. Second, a new online refinement strategy is proposed to help the trained model adapt to unseen classes, achieved by switching the roles of the query and the support images at the inference stage. The effectiveness of our framework is demonstrated by experimental results, which outperforms other competitive methods and leads to a new state-of-the-art on both PASCAL VOC and MSCOCO dataset.

# Summary. An optional shortened abstract.
summary: We propose a framework, BriNet, to bridge these gaps. First, more information interactions are encouraged between the extracted features of the query and support images, i.e., using an Information Exchange Module to emphasize the common objects. Furthermore, to precisely localize the query objects, we design a multi-path finegrained strategy which is able to make better use of the support feature representations. Second, a new online refinement strategy is proposed to help the trained model adapt to unseen classes, achieved by switching the roles of the query and the support images at the inference stage.

tags: []

# Display this page in the Featured widget?
featured: false

# Custom links (uncomment lines below)
# links:
# - name: Custom Link
#   url: http://example.org

url_pdf: 'https://arxiv.org/abs/2008.06226'
url_code: 'https://github.com/Wi-sc/BriNet.git'
url_dataset: 'http://home.bharathh.info/pubs/codes/SBD/download.html'
url_poster: ''
url_project: ''
url_slides: ''
url_source: ''
url_video: 'https://www.youtube.com/watch?v=9EaT6ZCtcqk&t=6s'

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
image:
  caption: 'Image credit: [**Unsplash**](https://unsplash.com/photos/pLCdAaMFLTE)'
  focal_point: ''
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects:
  - example

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
slides: example
---

{{% callout note %}}
Click the _Cite_ button above to demo the feature to enable visitors to import publication metadata into their reference management software.
{{% /callout %}}

{{% callout note %}}
Create your slides in Markdown - click the _Slides_ button to check out the example.
{{% /callout %}}

Supplementary notes can be added here, including [code, math, and images](https://wowchemy.com/docs/writing-markdown-latex/).
