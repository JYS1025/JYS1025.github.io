# Paper source

The paper is written in LaTeX and builds against the archived result CSV files
stored in `../results/`.

Generate the quality figure:

```bash
python make_figures.py
```

Compile the paper:

```bash
LC_ALL=C latexmk -pdf -interaction=nonstopmode \
  -halt-on-error -outdir=build main.tex
```

Compile the Korean review translation:

```bash
LC_ALL=C latexmk -xelatex -interaction=nonstopmode \
  -halt-on-error -outdir=build_ko main_ko.tex
```

The repository copy of the compiled paper is stored at:

```text
../output/pdf/geodesic_momentum_sampling.pdf
../output/pdf/geodesic_momentum_sampling_ko.pdf
```

`make_figures.py` redraws the existing CSV values; it does not execute model
inference or alter the result files.
