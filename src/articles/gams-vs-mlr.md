---
title: "GAMs vs. Multiple Linear Regression"
date: 2026-06-20
tags: [math]
summary: "Trading interpretability for flexibility: how generalized additive models relax the linearity assumption without giving up structure entirely."
---

Multiple linear regression assumes each predictor contributes linearly to the outcome:

$$
y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \cdots + \beta_p x_p + \epsilon
$$

This is easy to interpret ($\beta_i$ is "the effect of $x_i$") but often wrong — real relationships curve, plateau, or have thresholds that a straight line can't capture.

## Generalized Additive Models

GAMs relax the linearity assumption on each predictor individually, while keeping the additive structure:

$$
y = \beta_0 + f_1(x_1) + f_2(x_2) + \cdots + f_p(x_p) + \epsilon
$$

Each $f_i$ is a smooth function — typically a spline — fit from the data rather than assumed linear. Critically, the model is still *additive*: no interaction terms between predictors unless explicitly added, which is what keeps GAMs interpretable compared to a full black-box model.

## Why not just use a neural network?

You could — but GAMs give you a plot of $f_i(x_i)$ for each predictor, letting you actually *see* the shape of the relationship: does risk increase linearly with age, or is there a nonlinear jump after 60? A neural network won't hand you that visualization for free.

```python
from pygam import LinearGAM, s

gam = LinearGAM(s(0) + s(1) + s(2)).fit(X, y)
gam.summary()

# Plot the learned shape function for predictor 0
XX = gam.generate_X_grid(term=0)
plt.plot(XX[:, 0], gam.partial_dependence(term=0, X=XX))
```

The tradeoff is real: GAMs are more flexible than linear regression but still far more constrained — and more interpretable — than a fully unconstrained model.
