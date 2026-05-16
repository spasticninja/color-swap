#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const parseArgs = (argv) => {
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg.startsWith('--')) {
      continue;
    }

    const key = arg.slice(2);

    if (key === 'colors') {
      options.colors = [];
      while (argv[index + 1] && !argv[index + 1].startsWith('--')) {
        options.colors.push(argv[index + 1]);
        index += 1;
      }
      continue;
    }

    const nextValue = argv[index + 1];
    if (!nextValue || nextValue.startsWith('--')) {
      options[key] = true;
      continue;
    }

    options[key] = nextValue;
    index += 1;
  }

  return options;
};

const createInterface = () => readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (rl, prompt) => new Promise(resolve => {
  rl.question(prompt, answer => resolve(answer.trim()));
});

const slugify = (value) => (
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
);

const isHexColor = (value) => /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const hexToRgb = (hex) => {
  const normalizedHex = hex.replace('#', '');
  const chunkSize = normalizedHex.length === 3 ? 1 : 2;
  const chunks = normalizedHex.match(new RegExp(`.{1,${chunkSize}}`, 'g')) || [];
  const expand = (value) => (chunkSize === 1 ? `${value}${value}` : value);

  return chunks.map(chunk => Number.parseInt(expand(chunk), 16));
};

const toLinearRgb = (channel) => {
  const normalized = channel / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
};

const rgbToLab = (hex) => {
  const [r, g, b] = hexToRgb(hex).map(toLinearRgb);

  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  const pivot = (value) => (
    value > 0.008856 ? value ** (1 / 3) : (7.787 * value) + (16 / 116)
  );

  const fx = pivot(x);
  const fy = pivot(y);
  const fz = pivot(z);

  return [
    (116 * fy) - 16,
    500 * (fx - fy),
    200 * (fy - fz)
  ];
};

const getLabDistance = (left, right) => {
  const [l1, a1, b1] = rgbToLab(left);
  const [l2, a2, b2] = rgbToLab(right);

  return Math.sqrt(((l1 - l2) ** 2) + ((a1 - a2) ** 2) + ((b1 - b2) ** 2));
};

const getDifficultyScore = (colors) => {
  const pairDistances = [];

  for (let index = 0; index < colors.length; index += 1) {
    for (let innerIndex = index + 1; innerIndex < colors.length; innerIndex += 1) {
      pairDistances.push(getLabDistance(colors[index], colors[innerIndex]));
    }
  }

  const averageDistance = pairDistances.reduce((sum, distance) => sum + distance, 0) / pairDistances.length;
  const minimumDistance = Math.min(...pairDistances);
  const colorSimilarityScore = Math.round(clamp(((55 - averageDistance) / 55) * 35, 0, 35));
  const lowContrastPenalty = Math.round(clamp(((35 - minimumDistance) / 35) * 20, 0, 20));

  return clamp(colorSimilarityScore + lowContrastPenalty, 0, 55);
};

const getDataPath = (fileOverride) => (
  fileOverride
    ? path.resolve(process.cwd(), fileOverride)
    : path.resolve(__dirname, '..', 'data', 'game-boards.json')
);

const loadBoards = (dataPath) => {
  const raw = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(raw);
};

const saveBoards = (dataPath, boards) => {
  fs.writeFileSync(dataPath, `${JSON.stringify(boards, null, 2)}\n`, 'utf8');
};

const requireValue = (value, label) => {
  if (!value) {
    throw new Error(`${label} is required.`);
  }

  return value;
};

const normalizeColors = (colors) => colors.map(color => color.trim());

const ensureUniqueSlug = (boards, slug) => {
  if (boards.some(board => board.slug === slug)) {
    throw new Error(`A game with slug "${slug}" already exists.`);
  }
};

const validateDifficultyScore = (difficultyScore) => {
  if (!Number.isInteger(difficultyScore) || difficultyScore < 0 || difficultyScore > 55) {
    throw new Error('Difficulty score must be an integer between 0 and 55.');
  }
};

const validateColors = (colors) => {
  if (colors.length !== 4) {
    throw new Error('Exactly four colors are required.');
  }

  colors.forEach(color => {
    if (!isHexColor(color)) {
      throw new Error(`Invalid hex color: ${color}`);
    }
  });
};

const promptForMissingValues = async (options) => {
  const rl = createInterface();

  try {
    const name = options.name || await ask(rl, 'Game name: ');
    const generatedSlug = slugify(name);
    const slug = options.slug
      || (!options.name ? await ask(rl, `Slug [${generatedSlug}]: `) : '')
      || generatedSlug;
    const colors = options.colors && options.colors.length > 0
      ? options.colors
      : [
          await ask(rl, 'Top-left color: '),
          await ask(rl, 'Top-right color: '),
          await ask(rl, 'Bottom-left color: '),
          await ask(rl, 'Bottom-right color: ')
        ];

    return {
      name,
      slug,
      colors
    };
  } finally {
    rl.close();
  }
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  const dataPath = getDataPath(args.file);
  const boards = loadBoards(dataPath);
  const input = await promptForMissingValues(args);
  const name = requireValue(input.name, 'Game name');
  const slug = requireValue(slugify(input.slug), 'Slug');
  const colors = normalizeColors(input.colors);

  ensureUniqueSlug(boards, slug);
  validateColors(colors);
  const difficultyScore = getDifficultyScore(colors);
  validateDifficultyScore(difficultyScore);

  const newBoard = {
    name,
    slug,
    colors,
    difficultyScore
  };

  boards.push(newBoard);
  saveBoards(dataPath, boards);

  process.stdout.write(`Added "${name}" to ${dataPath} with difficulty score ${difficultyScore}\n`);
};

main().catch(error => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
