---
title: "Ensemble Methods: Bagging vs. Boosting"
date: 2026-07-10
tags: [ml]
summary: "Why bagging reduces variance while boosting reduces bias, worked through with the underlying math."
---

Ensemble methods combine multiple weak learners into a stronger one. The two dominant families — bagging and boosting — attack the bias-variance tradeoff from opposite directions.

## Bagging: variance reduction

Bagging (bootstrap aggregating) trains $B$ models independently on bootstrap resamples of the training data, then averages their predictions:

$$
\hat{f}_{\text{bag}}(x) = \frac{1}{B} \sum_{b=1}^{B} \hat{f}_b(x)
$$

If each $\hat{f}_b$ has variance $\sigma^2$ and pairwise correlation $\rho$, the variance of the average is:

$$
\text{Var}(\hat{f}_{\text{bag}}) = \rho \sigma^2 + \frac{1 - \rho}{B} \sigma^2
$$

As $B \to \infty$, the second term vanishes, leaving $\rho \sigma^2$ as a floor. This is why bagging works best with high-variance, low-bias base learners (deep decision trees) and why decorrelating trees — as random forests do by subsampling features at each split — helps drive $\rho$ down further.

## Boosting: bias reduction

Boosting builds learners sequentially, each one correcting the errors of the ensemble so far. Gradient boosting frames this as functional gradient descent: at each stage $m$, fit a new learner $h_m$ to the negative gradient of the loss with respect to the current prediction,

$$
h_m \approx \arg\min_h \sum_{i=1}^{n} \left( -\frac{\partial L(y_i, F_{m-1}(x_i))}{\partial F_{m-1}(x_i)} - h(x_i) \right)^2
$$

then update $F_m = F_{m-1} + \nu \, h_m$, where $\nu$ is the learning rate. Because each stage explicitly targets residual error, boosting drives bias down — at the cost of being more prone to overfitting than bagging, which is why shrinkage ($\nu$) and early stopping matter so much in practice.

## A minimal gradient boosting loop

```python
import numpy as np
from sklearn.tree import DecisionTreeRegressor

def gradient_boost(X, y, n_estimators=100, lr=0.1, max_depth=3):
    F = np.full(y.shape, y.mean())
    trees = []
    for _ in range(n_estimators):
        residual = y - F           # negative gradient for squared error loss
        tree = DecisionTreeRegressor(max_depth=max_depth)
        tree.fit(X, residual)
        F += lr * tree.predict(X)
        trees.append(tree)
    return trees, y.mean()
```

## Takeaway

| | Bagging | Boosting |
|---|---|---|
| Trains | in parallel | sequentially |
| Targets | variance | bias |
| Base learner | high-variance (deep trees) | high-bias (shallow trees / stumps) |
| Overfitting risk | low | higher, needs regularization |

Both are instances of the same idea — combine weak learners — but the *direction* of the bias-variance tradeoff each one attacks explains most of their practical differences.
