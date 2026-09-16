import js from "@eslint/js";
import sdl from "@microsoft/eslint-plugin-sdl";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...sdl.configs.recommended,
    {
        languageOptions: {
            globals: globals.browser
        },
        rules: {
            "@typescript-eslint/explicit-function-return-type": "warn",
            "@typescript-eslint/no-explicit-any": "warn"
        }
    }
);
