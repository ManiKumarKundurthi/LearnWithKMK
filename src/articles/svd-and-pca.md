---
title: "SVD and PCA: The Same Thing, Twice"
date: 2026-06-28
tags: [math]
summary: "PCA is diagonalizing the covariance matrix. SVD gets there without ever forming it."
---

Principal Component Analysis is usually introduced via the covariance matrix, but the more numerically stable — and more revealing — route is through the Singular Value Decomposition of the data matrix directly.

## The covariance route

Given a centered data matrix $X \in \mathbb{R}^{n \times p}$ (rows are observations, columns are features, each column mean-zero), PCA diagonalizes the covariance matrix

$$
C = \frac{1}{n-1} X^\top X
$$

Since $C$ is symmetric positive semi-definite, it admits an eigendecomposition $C = V \Lambda V^\top$, where $V$'s columns are the principal directions and $\Lambda = \text{diag}(\lambda_1, \dots, \lambda_p)$ holds the variances explained by each component.

## The SVD route

Instead, decompose $X$ directly:

$$
X = U \Sigma V^\top
$$

where $U \in \mathbb{R}^{n \times n}$ and $V \in \mathbb{R}^{p \times p}$ are orthogonal, and $\Sigma$ is diagonal with singular values $\sigma_1 \geq \sigma_2 \geq \cdots \geq 0$.

Substituting into $X^\top X$:

$$
X^\top X = (U \Sigma V^\top)^\top (U \Sigma V^\top) = V \Sigma^\top U^\top U \Sigma V^\top = V \Sigma^2 V^\top
$$

using $U^\top U = I$. Comparing with $C \propto V \Lambda V^\top$, this means:

$$
\lambda_i = \frac{\sigma_i^2}{n - 1}
$$

The right singular vectors $V$ *are* the principal directions — no need to ever form $X^\top X$.

## Why this matters in practice

Forming $C = X^\top X$ explicitly squares the condition number of the underlying problem: if $X$ has condition number $\kappa$, then $C$ has condition number $\kappa^2$. For features with very different scales, this can meaningfully degrade numerical precision. Computing the SVD of $X$ directly avoids that squaring entirely, which is why `sklearn.decomposition.PCA` uses SVD under the hood rather than eigendecomposing the covariance matrix.

```python
import numpy as np

def pca_via_svd(X, n_components):
    X_centered = X - X.mean(axis=0)
    U, S, Vt = np.linalg.svd(X_centered, full_matrices=False)
    components = Vt[:n_components]
    explained_variance = (S[:n_components] ** 2) / (X.shape[0] - 1)
    scores = X_centered @ components.T
    return scores, components, explained_variance
```

## Explained variance ratio

The proportion of total variance captured by the first $k$ components is

$$
\text{EVR}(k) = \frac{\sum_{i=1}^{k} \sigma_i^2}{\sum_{i=1}^{p} \sigma_i^2}
$$

which is exactly what `explained_variance_ratio_` reports in scikit-learn — computed from singular values, never from an explicit covariance matrix.
