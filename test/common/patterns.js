var patterns = module.exports = {
  pattern1: {
    repo: [
      'vjs',
      'mtv-play'
    ],
    branch: [
      'master'
    ],
    files: [ 
      {path: 'package.json'},
      {path: 'build.json'},
      {path: 'something.else'}
    ]
  },
    
  pattern2: {
    repo: [
      '*'
    ],
    branch: [
      'master'
    ],
    files: [
      {
        path: 'build.json',
        fields: [
          'vigour',
          'gaston',
          'services',
          'gaston.less.something'
        ]
      }

    ],
  },

  pattern3: {
    repo: '*',
    files: [
      {
        path: '*',
        fields: [
          'version'
        ]
      }
    ]
  }
}