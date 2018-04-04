module.exports = {
    "env": {
        "mocha": true,
        "es6": true,
        "node": true
    },
    "parserOptions": {
        "ecmaVersion": 2017
    },
    "ecmaFeatures": {
      "spread": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "no-console": 0,
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
