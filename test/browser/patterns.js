var patterns = module.exports = {
  "one": {
    "mtv-play": {
      "master": {
        "package.json": {
          "version": true
        },
        "build.json": true,
        "someother.file": true
      }
    },
    "vjs": {
      "*": true
    }
  },

  "two": {
    "*": true
  },

  "three": {
    "vjs": {
      "package.json": {
        "version": true
      }
    }
  }
};
