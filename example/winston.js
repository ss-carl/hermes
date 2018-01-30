const winston = require('winston')

describe('winston', function() {
  describe('supports custom loggers', function() {
    it('to use in discrete parts of the app', function() {
      // https://www.npmjs.com/package/winston
      // https://github.com/winstonjs/winston

      winston.loggers.add('exampleOne', {
        console: {
          colorize: true,
          label: 'exampleOne',
        },
      })

      winston.loggers.add('exampleTwo', {
        console: {
          colorize: false,
          label: 'exampleTwo',
        },
      })

      const exampleOneLogger = winston.loggers.get('exampleOne')
      const exampleTwoLogger = winston.loggers.get('exampleTwo')

      exampleOneLogger.info('info')
      exampleOneLogger.warn('warn')
      exampleOneLogger.error('error')

      exampleTwoLogger.info('info')
      exampleTwoLogger.warn('warn')
      exampleTwoLogger.error('error')
    })
  })

  describe('can be used for profiling', function() {
    it('by starting a timer from any logger, including custom loggers', function(done) {
      const timerOne = winston.startTimer()
      setTimeout(() => {
        timerOne.done('around 50ms have passed, also heres some metadata', { whatisthis: 'youhavenoidea', })
        done()
      }, 50)
    })
  })
})
