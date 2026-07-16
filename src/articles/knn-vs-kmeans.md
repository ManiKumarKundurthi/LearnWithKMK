---
title: "KNN vs. K-Means: Same Letter, Different Problem"
date: 2026-07-01
tags: [ml]
summary: "One is supervised classification, the other unsupervised clustering — the name similarity is a trap."
---

Despite the similar names, K-Nearest Neighbors and K-Means solve fundamentally different problems.

**KNN** is supervised: given labeled training points, classify a new point by majority vote among its $k$ nearest neighbors.

**K-Means** is unsupervised: given unlabeled points, partition them into $k$ clusters by minimizing within-cluster variance,

$$
\underset{S}{\arg\min} \sum_{i=1}^{k} \sum_{x \in S_i} \|x - \mu_i\|^2
$$

The only thing they share is the letter $k$ and a reliance on distance metrics. Everything else — the problem being solved, whether labels are needed, what "$k$" even means — is different.

## Choosing $k$

For KNN, small $k$ overfits (sensitive to noise), large $k$ underfits (oversmooths decision boundaries) — typically chosen via cross-validation.

For K-Means, $k$ is chosen before clustering even starts, often via the elbow method: plot within-cluster sum of squares against $k$ and look for the point of diminishing returns.

```python
from sklearn.cluster import KMeans

inertias = []
for k in range(1, 11):
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X)
    inertias.append(km.inertia_)
```

Two algorithms, two totally different notions of what "$k$" is even for.
