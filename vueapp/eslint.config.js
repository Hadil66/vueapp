// eslint.config.js

import vuetifyConfig from 'eslint-config-vuetify';

// Custom configuration object to override rules specifically for Vue files
const vueRuleOverrides = {
  files: ['**/*.vue'], // Apply these rules only to files ending in .vue
  rules: {
    // --- Rules to Disable ---

    // 1. Disable the vue/attributes-order rule
    'vue/attributes-order': 'off',

    // 2. Disable the rule that enforces self-closing tag style
    'vue/html-self-closing': 'off',
    'vue/html-indent': 'off',

    // 3. Disable the rule enforcing newline before/after closing bracket
    // This means ESLint won't complain about where the '>' is placed
    // relative to the last attribute or content.
    'vue/html-closing-bracket-newline': 'off',
    'vue/script-indent' : 'off',
    'vue/arrow-parrens' : 'off',


    // --- Other Potential Overrides (Examples) ---
    // If you want to turn another rule into a warning instead of an error:
    // 'vue/multi-word-component-names': 'warn',
    //
    // If you want to disable another rule completely:
    // 'some-other-rule-from-vuetify-config': 'off',
  },
};

// Export an array containing the base Vuetify configuration
// followed by our custom overrides.
// ESLint processes configurations in order, so our overrides take precedence
// for the files they target (in this case, *.vue files).
export default [
  // Include the base Vuetify config(s)
  // This handles if vuetifyConfig is a single object or an array
  ...(Array.isArray(vuetifyConfig) ? vuetifyConfig : [vuetifyConfig]),

  // Add our custom overrides object
  vueRuleOverrides,
]