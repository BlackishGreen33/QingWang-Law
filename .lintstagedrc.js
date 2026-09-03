const path = require('path');

const buildEslintCommand = (filenames) =>
  `eslint --fix -- ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .map(JSON.stringify)
    .join(' ')}`;

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand], // ESLint 校验
  '**/*.{js,jsx,tsx,ts,less,md,json}': ['prettier --write'], // prettier 格式化
};
