# bip39-versioned

> Proof of concept adding versioning to BIP39 compatible seeds

[![Build Status](https://travis-ci.com/lukechilds/bip39-versioned.svg?branch=master)](https://travis-ci.com/lukechilds/bip39-versioned)
[![Coverage Status](https://coveralls.io/repos/github/lukechilds/bip39-versioned/badge.svg?branch=master)](https://coveralls.io/github/lukechilds/bip39-versioned?branch=master)
[![npm](https://img.shields.io/npm/v/bip39-versioned.svg)](https://www.npmjs.com/package/bip39-versioned)

## Install

```shell
npm install bip39-versioned
```

## Example

```js
const bip39v = require('bip39-versioned');

// Generate P2PKH versioned BIP39 mnemonic
const mnemonic = bip39v.generateMnemonic(128, bip39v.versions.P2PKH);
// 'above rack wait angle thank ribbon strategy gallery silk leave brave swarm'
assert(bip39v.mnemonicToVersionByte(mnemonic) === 0x00);
assert(bip39v.mnemonicToVersion(mnemonic) === 'P2PKH');

// Generate P2WPKHP2SH versioned BIP39 mnemonic
const mnemonic = bip39v.generateMnemonic(128, bip39v.versions.P2WPKHP2SH);
// 'abuse lottery polar torch prison option common common mix moon wonder length'
assert(bip39v.mnemonicToVersionByte(mnemonic) === 0x01);
assert(bip39v.mnemonicToVersion(mnemonic) === 'P2WPKHP2SH');

// Generate P2WPKH versioned BIP39 mnemonic
const mnemonic = bip39v.generateMnemonic(128, bip39v.versions.P2WPKH);
// 'across sword flip inspire allow joke skate drip icon lady emerge toss'
assert(bip39v.mnemonicToVersionByte(mnemonic) === 0x02);
assert(bip39v.mnemonicToVersion(mnemonic) === 'P2WPKH');

// Attempt to get version from a standard non-versioned BIP39 mnemonic
const mnemonic = 'such galaxy much glimpse music turkey toward exhaust filter key pilot hello';
assert(bip39v.mnemonicToVersionByte(mnemonic) === 0xD8);
assert(bip39v.mnemonicToVersion(mnemonic) === 'UNKNOWN');
```

## License

MIT © Luke Childs
