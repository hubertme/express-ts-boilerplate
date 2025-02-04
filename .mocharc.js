module.exports = {
  require: ['ts-node/register'],
  extension: ['.ts'],
  spec: ['test/**/*.ts'],
  recursive: true,
  timeout: 60000,
  exit: true,
  loader: 'ts-node/esm'
};
