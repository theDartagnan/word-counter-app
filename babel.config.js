module.exports = {
  presets: [
    // present-env : transformation du code pour ES2015+,
    ['@babel/preset-env', { targets: '> 0.25%, last 2 versions, Firefox ESR, not dead' }],
    // present-react : transformation du JSX
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [
    // utilisation du compilateur react 19 pour l'application d'optimisations automatique (ex.: memoization)
    'babel-plugin-react-compiler',
    // re-utilisation des helpers injectés pour éviter de les injecter dans chaque chunk (gain de place)
    '@babel/plugin-transform-runtime',
  ],
};
