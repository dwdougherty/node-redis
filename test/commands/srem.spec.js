'use strict'

const assert = require('assert')
const config = require('../lib/config')
const helper = require('../helper')
const redis = config.redis

describe('The \'srem\' method', () => {
  helper.allTests((ip, args) => {
    describe(`using ${ip}`, () => {
      let client

      beforeEach((done) => {
        client = redis.createClient.apply(null, args)
        client.once('ready', () => {
          client.flushdb(done)
        })
      })

      it('removes a value', (done) => {
        client.sadd('set0', 'member0', helper.isNumber(1))
        client.srem('set0', 'member0', helper.isNumber(1))
        client.scard('set0', helper.isNumber(0, done))
      })

      it('handles attempting to remove a missing value', (done) => {
        client.srem('set0', 'member0', helper.isNumber(0, done))
      })

      it('allows multiple values to be removed', (done) => {
        client.sadd('set0', ['member0', 'member1', 'member2'], helper.isNumber(3))
        client.srem('set0', ['member1', 'member2'], helper.isNumber(2))
        client.smembers('set0', (err, res) => {
          assert.strictEqual(res.length, 1)
          assert.ok(~res.indexOf('member0'))
          return done(err)
        })
      })

      it('allows multiple values to be removed with sendCommand', (done) => {
        client.sendCommand('sadd', ['set0', 'member0', 'member1', 'member2'], helper.isNumber(3))
        client.sendCommand('srem', ['set0', 'member1', 'member2'], helper.isNumber(2))
        client.smembers('set0', (err, res) => {
          assert.strictEqual(res.length, 1)
          assert.ok(~res.indexOf('member0'))
          return done(err)
        })
      })

      it('handles a value missing from the set of values being removed', (done) => {
        client.sadd(['set0', 'member0', 'member1', 'member2'], helper.isNumber(3))
        client.srem(['set0', 'member3', 'member4'], helper.isNumber(0))
        client.smembers('set0', (err, res) => {
          assert.strictEqual(res.length, 3)
          assert.ok(~res.indexOf('member0'))
          assert.ok(~res.indexOf('member1'))
          assert.ok(~res.indexOf('member2'))
          return done(err)
        })
      })

      afterEach(() => {
        client.end(true)
      })
    })
  })
})
