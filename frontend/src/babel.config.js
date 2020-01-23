module.exports = {
    presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-flow',
        "@babel/env", "@babel/react"
    ],
    plugins: [
        'babel-plugin-styled-components',
        '@babel/plugin-proposal-class-properties',
        "syntax-class-properties",
    ],
    "env": {
    "test": {
        "presets": ["env", "react", "stage-2"],
            "plugins": ["transform-export-extensions"],
            "only": [
            "./**/*.js",
            "node_modules/jest-runtime"
        ]
    }
}


}
