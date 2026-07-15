"""Generate paper figures from the immutable archived benchmark CSV files."""

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
FIGURE_DIR = Path(__file__).resolve().parent / 'figures'
FIGURE_DIR.mkdir(parents=True, exist_ok=True)

COLORS = {'baseline': '#3B5BA9', 'geodesic': '#C43C39'}
MARKERS = {'baseline': 'o', 'geodesic': 's'}
IMPROVEMENT_COLOR = '#2F7D4A'
DEGRADATION_COLOR = '#9A4A46'


def load(name: str) -> pd.DataFrame:
  path = ROOT / 'results' / name / 'sampler_benchmark_results.csv'
  return pd.read_csv(path).sort_values(['steps', 'sampler'])


def draw_ppl_panel(axis, data, title, y_limits, y_ticks):
  for sampler in ['baseline', 'geodesic']:
    subset = data[data['sampler'] == sampler]
    axis.plot(
      range(len(subset)),
      subset['lm_ppl'],
      label=sampler.capitalize(),
      color=COLORS[sampler],
      marker=MARKERS[sampler],
      linewidth=2.1,
      markersize=5.5,
    )
  axis.set_xticks(range(6))
  axis.set_xticklabels(['10', '20', '50', '100', '256', '512'])
  axis.set_ylim(*y_limits)
  axis.set_yticks(y_ticks)
  axis.set_title(title, fontweight='bold')
  axis.set_xlabel('Reverse steps')
  axis.set_ylabel('GPT-2 perplexity (lower is better)')
  axis.grid(True, which='major', alpha=0.25, linewidth=0.6)


def draw_improvement_panel(axis, data, title):
  pivot = data.pivot(index='steps', columns='sampler', values='lm_ppl')
  pivot = pivot.loc[[10, 20, 50, 100, 256, 512]]
  improvement = 100.0 * (pivot['baseline'] - pivot['geodesic']) / pivot['baseline']
  colors = [
    IMPROVEMENT_COLOR if value >= 0 else DEGRADATION_COLOR
    for value in improvement
  ]
  bars = axis.bar(range(len(improvement)), improvement, color=colors, width=0.68)
  axis.axhline(0.0, color='#333333', linewidth=0.8)
  axis.set_xticks(range(6))
  axis.set_xticklabels(['10', '20', '50', '100', '256', '512'])
  axis.set_ylim(-8, 30)
  axis.set_title(title, fontweight='bold')
  axis.set_xlabel('Reverse steps')
  axis.set_ylabel('PPL reduction vs. baseline (%)')
  axis.grid(True, axis='y', alpha=0.25, linewidth=0.6)
  for bar, value in zip(bars, improvement):
    offset = 0.7 if value >= 0 else -0.9
    vertical_alignment = 'bottom' if value >= 0 else 'top'
    axis.text(
      bar.get_x() + bar.get_width() / 2,
      value + offset,
      f'{value:+.1f}%',
      ha='center',
      va=vertical_alignment,
      fontsize=7.5,
      fontweight='bold',
    )


def main() -> None:
  plt.rcParams.update({
    'font.family': 'serif',
    'font.size': 9,
    'axes.spines.top': False,
    'axes.spines.right': False,
    'pdf.fonttype': 42,
    'ps.fonttype': 42,
  })

  mdlm = load('mdlm')
  sedd = load('sedd')
  figure, axes = plt.subplots(2, 2, figsize=(7.0, 5.7), constrained_layout=True)

  draw_ppl_panel(
    axes[0, 0],
    mdlm,
    '(a) MDLM perplexity',
    y_limits=(40, 590),
    y_ticks=[50, 150, 250, 350, 450, 550],
  )
  draw_improvement_panel(
    axes[0, 1],
    mdlm,
    '(b) MDLM relative improvement',
  )
  draw_ppl_panel(
    axes[1, 0],
    sedd,
    '(c) SEDD perplexity',
    y_limits=(40, 500),
    y_ticks=[50, 150, 250, 350, 450],
  )
  draw_improvement_panel(
    axes[1, 1],
    sedd,
    '(d) SEDD relative improvement',
  )

  axes[0, 0].legend(
    loc='upper right',
    ncol=2,
    frameon=False,
    columnspacing=0.9,
    handlelength=1.6,
  )
  figure.savefig(FIGURE_DIR / 'quality_curves.pdf', bbox_inches='tight')
  figure.savefig(FIGURE_DIR / 'quality_curves.png', dpi=240, bbox_inches='tight')
  plt.close(figure)


if __name__ == '__main__':
  main()
