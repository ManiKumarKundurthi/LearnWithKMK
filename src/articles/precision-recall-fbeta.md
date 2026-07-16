---
title: "Precision, Recall, and the F-beta Score"
date: 2026-07-15
tags: [ml]
summary: "Why accuracy lies on imbalanced data, and how F-beta lets you choose which error costs more."
---

On imbalanced datasets, accuracy is close to useless. If 95% of samples are negative, a classifier that always predicts "negative" scores 95% accuracy while catching zero positives.

## Precision and recall

$$
\text{Precision} = \frac{TP}{TP + FP}, \qquad \text{Recall} = \frac{TP}{TP + FN}
$$

Precision answers "of everything I flagged, how much was actually correct?" Recall answers "of everything that mattered, how much did I catch?"

## The F-beta score

$$
F_\beta = (1 + \beta^2) \cdot \frac{\text{precision} \cdot \text{recall}}{\beta^2 \cdot \text{precision} + \text{recall}}
$$

$\beta > 1$ weights recall more heavily (catching positives matters more, e.g. cancer screening); $\beta < 1$ weights precision more (false positives are costly, e.g. spam filtering). $F_1$ is the special case $\beta = 1$, the harmonic mean of precision and recall.

```python
def f_beta(precision, recall, beta=1.0):
    if precision == 0 and recall == 0:
        return 0.0
    b2 = beta ** 2
    return (1 + b2) * (precision * recall) / (b2 * precision + recall)
```

Choosing $\beta$ is a modeling decision, not a statistical one — it encodes which kind of mistake you'd rather make.
