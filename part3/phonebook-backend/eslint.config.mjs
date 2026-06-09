import js from "@eslint/js"
import globals from "globals"

export default [
  {
    ignores: ["dist", "build", "node_modules"]
  },

  js.configs.recommended,

  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  }
]