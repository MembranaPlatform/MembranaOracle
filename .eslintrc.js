module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "parserOptions": {
        "ecmaVersion": 2017,
        "ecmaFeatures": {
          "experimentalObjectRestSpread": true
        },
    },
    "extends": "eslint:recommended",
    "rules": {
        "no-console": 0,
        "no-constant-condition": 0,
        "no-fallthrough": 0,
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
