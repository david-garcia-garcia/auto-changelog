import { describe, it } from 'mocha'
import { expect } from 'chai'
import {
  updateLog,
  cmd,
  niceDate,
  isLink,
  getGitVersion,
  readFile,
  writeFile,
  fileExists,
  readJson,
  __Rewire__ as mock,
  __ResetDependency__ as unmock
} from '../src/utils'

describe('updateLog', () => {
  it('doesn\'t error', async () => {
    updateLog('Test', false)
    updateLog('Test')
  })
})

describe('cmd', () => {
  it('runs a command', async () => {
    const result = await cmd('node --version')
    expect(result).to.be.a('string')
  })

  it('runs onProgress', async () => {
    const result = await cmd('node --version', bytes => expect(bytes).to.be.a('number'))
    expect(result).to.be.a('string')
  })
})

describe('niceDate', () => {
  it('formats string into nice date', () => {
    expect(niceDate('2015-10-03')).to.match(/^\d October 2015$/)
    expect(niceDate('2017-11-07T19:19:02.635Z')).to.match(/^\d November 2017$/)
  })

  it('formats date into nice date', () => {
    expect(niceDate(new Date(2016, 8, 2))).to.match(/^\d September 2016$/)
    expect(niceDate(new Date('2015-10-03'))).to.match(/^\d October 2015$/)
  })
})

describe('isLink', () => {
  it('returns true for links', () => {
    expect(isLink('http://test.com')).to.equal(true)
  })

  it('returns false for non-links', () => {
    expect(isLink('not a link')).to.equal(false)
  })
})

describe('getGitVersion', () => {
  it('returns git version', async () => {
    mock('cmd', () => 'git version 2.15.2 (Apple Git-101.1)')
    expect(await getGitVersion()).to.equal('2.15.2')
    unmock('cmd')
  })

  it('returns null', async () => {
    mock('cmd', () => 'some sort of random output')
    expect(await getGitVersion()).to.equal(null)
    unmock('cmd')
  })
})

describe('readFile', () => {
  it('reads file', async () => {
    mock('fs', { readFile: (path, type, cb) => cb(null, 'abc') })
    expect(await readFile()).to.equal('abc')
    unmock('cmd')
  })
})

describe('writeFile', () => {
  it('reads file', async () => {
    mock('fs', { writeFile: (path, data, cb) => cb(null, 'abc') })
    expect(await writeFile()).to.equal('abc')
    unmock('fs')
  })
})

describe('fileExists', () => {
  it('reads file', async () => {
    mock('fs', { access: (path, cb) => cb(null) })
    expect(await fileExists()).to.equal(true)
    unmock('fs')
  })
})

describe('readJson', () => {
  it('reads file', async () => {
    mock('fs', {
      readFile: (path, type, cb) => cb(null, '{"abc":123}'),
      access: (path, cb) => cb(null)
    })
    expect(await readJson()).to.deep.equal({ abc: 123 })
    unmock('cmd')
  })
})
