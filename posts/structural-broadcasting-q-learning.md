---
title: "Structural Broadcasting Q-learning: Annealed Kernel Generalization for Tabular Reinforcement Learning"
date: "2026-06-21"
description: "We propose Structural Broadcasting Q-learning, a tabular reinforcement learning method that improves sample efficiency by propagating temporal-difference errors across structurally similar states."
topics: ["Reinforcement Learning", "Q-learning", "Machine Learning", "Tabular RL"]
---

**[📄 Read the Full Paper (PDF)](https://drive.google.com/file/d/115syK7iBL1K-FxDcqv8YOLjIsH2Houkn/preview)**

## Abstract

We propose Structural Broadcasting Q-learning, a tabular reinforcement learning method that improves sample efficiency by propagating temporal-difference errors across structurally similar states. Standard Q-learning updates only the visited state-action pairs, which is inefficient in large factored state spaces. Our method maintains a global Q-table and an auxiliary kernel estimator that broadcasts TD errors to nearby states according to a similarity kernel. The auxiliary contribution is annealed by visitation count, allowing early generalization while recovering standard Q-learning in the limit. Experiments on structured discrete benchmarks show that Structural Broadcasting Q-learning improves early learning speed in several sparse and combinatorial environments while preserving a simple tabular update structure.

## Introduction

In reinforcement learning (RL), agents learn optimal policies through interaction with environments whose state spaces often exhibit geometric or compositional structure. Consequently, the optimal value function tends to satisfy a smoothness property, where geometrically adjacent states often share similar learning signals and Q-values. Despite this structural prior, traditional tabular Q-learning treats every state as a mutually independent entity, disregarding spatial correlations. While this independence assumption facilitates straightforward convergence, it leads to sample inefficiency and limits the algorithm's scalability in large state spaces.

To address this inefficiency, Deep Reinforcement Learning (DRL) methods, such as Deep Q-Networks (DQN), leverage the parameter-sharing properties of neural networks to achieve broad generalization. However, this neural generalization introduces theoretical trade-offs. The combination of function approximation, bootstrapping, and off-policy learning---often referred to as the "deadly triad"---can induce learning instability and compromise asymptotic convergence guarantees. Kernel-based RL provides another route to generalization by using distance metrics, such as Gaussian kernels, to propagate learning signals to structurally similar states without neural function approximation.

Motivated by this insight, we ask: *Can kernel-style geometric generalization be integrated into discrete tabular RL to accelerate early learning while preserving asymptotic convergence?* To explore this, we introduce **Structural Broadcasting Q-learning** (**SBQ**). The core idea is to introduce an auxiliary kernel estimator that propagates temporal difference (TD) errors to unvisited, similar states using an exponential kernel based on a distance metric in a finite metric space, and combine it with a global tabular Q-table. By annealing the kernel influence over time, SBQ exploits spatial broadcasting during early exploration while recovering standard tabular Q-learning convergence properties in the limit.

## Method

### Spatial Similarity Kernel

We model the environment as a finite Markov Decision Process (MDP) defined by the tuple $\mathcal{M}=(\mathcal{S},\mathcal{A},P,R,\gamma)$. To incorporate geometric structure into tabular reinforcement learning, we assume that the finite state space $\mathcal{S}$ is equipped with a distance metric $d(x,y)$.

Based on this metric space, we define the spatial similarity between two states using an exponential kernel:

$$
k(x,y)=\exp(-\lambda d(x,y)),
$$

where $\lambda>0$ controls the decay rate of similarity. For computational efficiency, the kernel update is restricted to a local neighborhood of the current state, $\mathcal{N}(s_t)=\{x\in\mathcal{S}:d(s_t,x)\le R\}$.

For factored MDPs with states $s=(s^{(1)},\dots,s^{(m)})$, we define the metric $d(x,y)$ as the Hamming distance:

$$
d_H(x,y)=\sum_{i=1}^{m}\mathbb{I}(x^{(i)}\neq y^{(i)}).
$$

The Hamming distance evaluates the number of differing coordinates between two states. Unlike metrics that assume ordinal relationships between feature values, it treats all categorical mismatches uniformly. This property makes it a generally applicable measure of structural proximity for combinatorial state spaces.

### Dual-Estimator Architecture and Annealing Schedule

To simultaneously achieve rapid generalization and asymptotic convergence, we propose a dual-table architecture. We maintain a global tabular Q-table, $Q^{G}$, and an auxiliary kernel estimator, $Q^{K}$, both of size $|\mathcal{S}|\times|\mathcal{A}|$. The actual action selection and the computation of Temporal Difference (TD) targets are governed by a combined Q-function:

$$
\tilde{Q}_{t}(s,a) = Q_{t}^{G}(s,a) + \beta_{t}(s,a)Q_{t}^{K}(s,a)
$$

Here, $\beta_{t}(s,a)$ is a visitation count-based annealing coefficient defined as $\beta_{t}(s,a)=\frac{\beta_{0}}{(1+N_{t}(s,a))^{p}}$. During the initial stages of learning, $\beta_t$ is sufficiently large, allowing the kernel estimator to provide a strong generalization bias. As the state-action pair $(s,a)$ is visited infinitely often, the coefficient decays ($\beta_{t}(s,a)\rightarrow 0$), gradually neutralizing the kernel's influence and recovering the properties of the pure global tabular learning.

### Global Evaluation and Spatial Broadcasting

Upon observing a transition, the agent computes a single TD error signal. This error drives two distinct update mechanisms: a point-update for the global table and a spatial broadcasting update for the kernel table. The complete procedure is detailed in Algorithm 1.

**Algorithm 1: Structural Broadcasting Q-learning (SBQ)**
```markdown
1. Initialize $Q^G, Q^K, N$ to zero
2. **For** each episode **do**
3.     Observe initial state $s$
4.     **While** $s$ is not terminal **do**
5.         Select $a$ using an exploration policy w.r.t. $\tilde Q(s,a) = Q^G(s,a) + \beta(s,a)Q^K(s,a)$
6.         Execute $a$, observe $r, s'$, and set $N(s,a) \leftarrow N(s,a) + 1$
7.         $\delta \leftarrow r + \gamma \max_{a'} \tilde Q(s',a') - \tilde Q(s,a)$
8.         $Q^G(s,a) \leftarrow Q^G(s,a) + \alpha(s,a)\delta$
9.         **For** $x \in \mathcal{N}(s)$ **do**
10.            $Q^K(x,a) \leftarrow Q^K(x,a) + \alpha^K k(s,x)\delta$
11.        **EndFor**
12.        $s \leftarrow s'$
13.    **EndWhile**
14. **EndFor**
```

### Derivation of Spatial Broadcasting via Functional Gradients in RKHS

The spatial broadcasting rule of $Q^{K}$ can be derived from a functional-gradient perspective in a Reproducing Kernel Hilbert Space (RKHS), providing a principled interpretation of the kernel-based propagation rule. Assume the kernel estimator $Q^{K}(\cdot,a)$ belongs to an RKHS $\mathcal{H}$ defined by the positive definite kernel $k(x,y)$. By the reproducing property, the value at state $s_t$ is expressed as the inner product $\langle Q^{K}(\cdot,a),k(s_{t},\cdot)\rangle_{\mathcal{H}}$.

To demonstrate this mathematically, we formulate the squared TD error loss function as follows:

$$
L(Q^{K}) = \frac{1}{2}\delta_{t}^{2} = \frac{1}{2}\left(r_{t} + \gamma \max_{a'}\tilde{Q}(s_{t+1},a') - \tilde{Q}(s_{t},a_{t})\right)^{2}
$$

Applying a semi-gradient approach and the chain rule, the functional derivative with respect to $Q^{K}(\cdot,a_{t})$ is derived as:

$$
\nabla_{Q^{K}}L = \frac{\partial L}{\partial Q^{K}(s_{t},a_{t})}\nabla_{Q^{K}}Q^{K}(s_{t},a_{t}) \propto -\delta_{t}k(s_{t},\cdot)
$$

Updating the function in the direction that minimizes this loss yields $Q_{t+1}^{K}(\cdot,a_{t}) = Q_{t}^{K}(\cdot,a_{t}) + \alpha_{t}^{K}\delta_{t}k(s_{t},\cdot)$. Evaluating this updated function pointwise at an arbitrary state $x$ recovers the broadcasting update rule in Algorithm 1. This provides a functional-gradient interpretation of the kernel-based propagation rule.

## Convergence Analysis

To theoretically guarantee the asymptotic properties of Structural Broadcasting Q-learning, we assume the standard conditions for tabular Q-learning: (1) the state and action spaces are finite, (2) rewards are bounded, (3) all state-action pairs are visited infinitely often, and (4) the learning rate $\alpha_t$ satisfies the Robbins-Monro conditions ($\sum \alpha_t = \infty, \sum \alpha_t^2 < \infty$). Furthermore, we naturally assume that the auxiliary kernel estimator is bounded ($||Q_{t}^{K}||_{\infty} \le B_{K} < \infty$) and the annealing coefficient vanishes in the limit ($\lim_{t \to \infty} \beta_{t}(s,a) = 0$).

### Error Decomposition and Perturbation Bounding

The core of our proof lies in reformulating the combined Q-function update into a standard asynchronous stochastic approximation framework with a vanishing perturbation. We first define a hypothetical, pure tabular TD error $\delta_{t}^{G}$ that would occur if only the global table $Q^{G}$ were used:

$$
\delta_{t}^{G} = r_{t} + \gamma \max_{a'}Q_{t}^{G}(s_{t+1},a') - Q_{t}^{G}(s_{t},a_{t})
$$

The actual TD error $\delta_{t}$ used in our algorithm can be algebraically decomposed into this pure error $\delta_{t}^{G}$ and a perturbation term $e_{t}$:

$$
\delta_{t} = \delta_{t}^{G} + e_{t}
$$

where the perturbation $e_{t}$ induced by the kernel estimator is given by:

$$
e_{t} = \gamma \left( \max_{a'}\tilde{Q}_{t}(s_{t+1},a') - \max_{a'}Q_{t}^{G}(s_{t+1},a') \right) - \beta_{t}(s_{t},a_{t})Q_{t}^{K}(s_{t},a_{t})
$$

To ensure this perturbation does not destabilize learning, we bound its magnitude. Applying the triangle inequality and the non-expansive property of the supremum norm ($|\max f - \max g| \le \max |f - g|$), we establish the absolute upper bound:

$$
\begin{align}
|e_{t}| &\le \gamma \max_{a'}|\tilde{Q}_{t}(s_{t+1},a') - Q_{t}^{G}(s_{t+1},a')| + |\beta_{t}(s_{t},a_{t})Q_{t}^{K}(s_{t},a_{t})| \nonumber \\
&\le \gamma ||\beta_{t}Q_{t}^{K}||_{\infty} + ||\beta_{t}Q_{t}^{K}||_{\infty} = (1+\gamma)||\beta_{t}Q_{t}^{K}||_{\infty}
\end{align}
$$

Since $Q^{K}$ is bounded by assumption and $\beta_{t} \to 0$, we guarantee that the perturbation vanishes almost surely: $\lim_{t \to \infty} e_{t} = 0 \text{ (a.s.)}$.

### Main Convergence Theorem

Using the decomposition, the update rule for the global table $Q^{G}$ can be rewritten using the standard Bellman optimality operator $T$:

$$
Q_{t+1}^{G}(s_{t},a_{t}) = Q_{t}^{G}(s_{t},a_{t}) + \alpha_{t}(s_{t},a_{t}) \left[ (TQ_{t}^{G})(s_{t},a_{t}) - Q_{t}^{G}(s_{t},a_{t}) + w_{t} + e_{t} \right]
$$

where $w_{t}$ is a martingale difference noise satisfying $\mathbb{E}[w_{t} \mid \mathcal{F}_{t}] = 0$.

**Theorem 1.**
*Under the stated assumptions, the global tabular value function $Q_{t}^{G}$ generated by Algorithm 1 converges to the optimal value function $Q^{*}$ almost surely. Furthermore, the combined value function $\tilde{Q}_{t}$ also converges to $Q^{*}$ almost surely.*

*Proof Sketch.* The Bellman operator $T$ is a known contraction mapping under the supremum norm. According to the asynchronous stochastic approximation theorem, the presence of the perturbation term $e_{t}$ does not alter the asymptotic dynamics of the system provided that $\lim_{t \to \infty} e_{t} = 0$ a.s. Therefore, $\lim_{t \to \infty} Q_{t}^{G} = Q^{*}$ a.s. Consequently, since the kernel influence decays to zero, the actual Q-function used by the agent also converges: $\lim_{t \to \infty} \tilde{Q}_{t} = \lim_{t \to \infty} (Q_{t}^{G} + \beta_{t}Q_{t}^{K}) = Q^{*} + 0 = Q^{*}$.

## Experiments

We evaluated SBQ on structured reinforcement learning environments with varying state representations, reward sparsity, and transition dynamics. These benchmarks test whether explicit TD-error broadcasting improves early sample efficiency when structurally similar states share useful learning signals. Detailed environment descriptions are provided in Table 1. For the SO-101 Reach task, we use Euclidean distance between discretized 3D target-error bin centers because Hamming distance ignores the magnitude of bin differences and would treat near and far errors along the same axis as equally similar.

| Environment | State (State Space) / Actions | Reward |
| :--- | :--- | :--- |
| DNA Promoter | 6-mer DNA sequence ($4^6=4096$ states); mutate one position to another base (18 actions) | Sparse, $+1$ only when the sequence exactly matches targets, 0 otherwise |
| Lights Out | 16 binary cells ($2^{16}=65{,}536$ states); toggling one cell and its neighbors | Sparse, $+1$ only when all lights are off, 0 otherwise; 5% action slip |
| Network Routing | Destination ID and neighboring queue status (about 1M valid states); choose one of 8 neighboring nodes | $+100$ at destination, with penalties for congestion or invalid links |
| SO-101 Reach | Discretized 3D target error ($11^3=1331$ states); small Cartesian movement: noop, $\pm x$, $\pm y$, $\pm z$ | Dense shaped reward: progress reward, distance penalty, and success bonus |
| Danger Maze | `[row, col, goal_id, layout_id]` ($8 \times 8 \times 4 \times 3=768$ states); up, down, left, right | Step: $-1$; invalid move: $-1$; danger cell: $-10$; goal: $+20$ |
| Four-Room Grid | `[row, col, goal_id, layout_id]` ($10 \times 10 \times 4=400$ states); up, down, left, right | Normal step: $-0.1$; invalid move: $-1$; goal: $+10$; 10% action slip |
| OpenAI Gym (MiniGrid/Taxi) | MiniGrid-DoorKey-5x5-v0, MiniGrid-LavaGapS7-v0, and Taxi-v4; standard discrete environment actions | Standard task rewards |

*Table 1: Summary of experimental environments.*

We compare SBQ with standard tabular Q-learning and Deep Q-Networks (DQN). Standard Q-learning updates only the visited state-action pair, while DQN generalizes through neural function approximation. All methods are trained under the same environment dynamics. Performance is measured by mean evaluation return over environment steps, with exponential moving average smoothing for visualization. Our main metric is early sample efficiency, measured by how quickly each method improves during the initial training phase, while final return is used to check whether broadcasting harms asymptotic performance.

### Results

Across the structured discrete benchmarks, SBQ generally improves early sample efficiency over standard Q-learning, especially when the chosen distance metric matches the task structure. The strongest gains appear in DNA Promoter, Dynamic Network Routing, and MiniGrid-LavaGap. In these tasks, neighboring states share useful information: point mutations produce related DNA sequences, routing states differ by queue configurations, and LavaGap states share local navigation geometry. As a result, broadcasting the same TD error to structurally similar states helps SBQ reuse sparse reward signals more effectively than independent tabular updates.

The results also show that broadcasting is not uniformly beneficial. In Danger Maze and Lights Out, SBQ learns faster during the early or middle phase while converging to similar final performance as Q-learning. In Four-Room Grid, the advantage is smaller because the state space is relatively small and standard Q-learning already explores it efficiently. MiniGrid-DoorKey and SO-101 Reach reveal the main limitations: when the distance metric does not align well with the task phase, or when a continuous control problem is coarsely discretized, broadcasting can introduce bias or noise. These results suggest that SBQ is most effective in discrete structured domains with meaningful state similarity and sparse or delayed rewards.

<table style="border: none; width: 100%;">
  <tr>
    <td style="border: none;"><img src="/images/posts/structural-broadcasting-q-learning/1.png" alt="DNA Promoter" /></td>
    <td style="border: none;"><img src="/images/posts/structural-broadcasting-q-learning/2.png" alt="Lights Out" /></td>
    <td style="border: none;"><img src="/images/posts/structural-broadcasting-q-learning/3.png" alt="Network Routing" /></td>
  </tr>
  <tr>
    <td style="border: none;"><img src="/images/posts/structural-broadcasting-q-learning/4.png" alt="SO-101 Reach" /></td>
    <td style="border: none;"><img src="/images/posts/structural-broadcasting-q-learning/5.png" alt="Danger Maze" /></td>
    <td style="border: none;"><img src="/images/posts/structural-broadcasting-q-learning/6.png" alt="Four-Room Grid" /></td>
  </tr>
  <tr>
    <td style="border: none;"><img src="/images/posts/structural-broadcasting-q-learning/7.png" alt="MiniGrid-DoorKey" /></td>
    <td style="border: none;"><img src="/images/posts/structural-broadcasting-q-learning/8.png" alt="MiniGrid-LavaGap" /></td>
    <td style="border: none;"><img src="/images/posts/structural-broadcasting-q-learning/9.png" alt="Taxi" /></td>
  </tr>
</table>

*Figure 1: Evaluation results across all environments.*

## Conclusion

In this paper, we proposed Structural Broadcasting Q-learning, a tabular RL method that combines a global Q-table with an annealed auxiliary kernel estimator. By broadcasting TD errors to structurally similar states, SBQ improves early sample efficiency while the decay of $\beta_t$ recovers standard tabular Q-learning in the limit. Experiments across structured discrete benchmarks show that SBQ is particularly effective when the state distance captures meaningful task similarity, such as Hamming-neighbor sequences, local grid states, and factored routing states.

The main limitation is that broadcasting can be harmful when the distance metric is poorly aligned with the task structure or when dense rewards cause repeated over-propagation. SBQ also remains tabular, so applying it to high-dimensional continuous control requires discretization and suffers from the curse of dimensionality. Future work should study adaptive broadcasting radii and learned representations that map continuous states into structurally meaningful discrete latent spaces.

## Contribution

- **Jinwoong Park** - Implemented environments (DNA Promoter, Lights Out, Discretized SO-101 IK-Reach task in IsaacLab), reviewed baseline papers, and contributed to algorithm ideation.
- **Seungjun Kim** - Implemented baseline, and 5 experimental environments (Maze, Keydoor, LavaGap, 4Room, and Taxi) out of 9.
- **Yoonseong Jeong** - Designed the kernel estimator and derived update rule via functional gradient. Analyzed its convergence, and implemented the SBQ and network routing environments.
