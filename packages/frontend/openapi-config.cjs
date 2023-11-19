module.exports = {
  schemaFile: '../backend/openapi.json',
  apiFile: './src/store/api.empty.ts',
  apiImport: 'apiEmpty',
  outputFile: './src/store/api.generated.ts',
  exportName: 'apiGenerated',
  hooks: true,
};
