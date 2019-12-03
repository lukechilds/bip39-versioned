# bip39-versioned

> Proof of concept adding versioning to BIP39 compatible seeds

[![Build Status](https://travis-ci.com/lukechilds/bip39-versioned.svg?branch=master)](https://travis-ci.com/lukechilds/bip39-versioned)
[![Coverage Status](https://coveralls.io/repos/github/lukechilds/bip39-versioned/badge.svg?branch=master)](https://coveralls.io/github/lukechilds/bip39-versioned?branch=master)
[![npm](https://img.shields.io/npm/v/bip39-versioned.svg)](https://www.npmjs.com/package/bip39-versioned)

BIP39 has come under heavy criticism for not having versioning built in:

>The lack of versioning is a serious design flaw in this proposal. On this basis alone I would recommend against use of this proposal.

\- [Greg Maxwell](https://github.com/bitcoin/bips/wiki/Comments:BIP-0039/fd2ddb6d840c6a91c98a29146b9a62d6a65d03bf) 2017-03-14

>BIP39 seed phrases do not include a version number. This means that software should always know how to generate keys and addresses. BIP43 suggests that wallet software will try various existing derivation schemes within the BIP32 framework. This is extremely inefficient and rests on the assumption that future wallets will support all previously accepted derivation methods. If, in the future, a wallet developer decides not to implement a particular derivation method because it is deprecated, then the software will not be able to detect that the corresponding seed phrases are not supported, and it will return an empty wallet instead. This threatens users funds.
>
>For these reasons, Electrum does not generate BIP39 seeds.

\- [Electrum Documentation](http://docs.electrum.org/en/latest/seedphrase.html) 2017-01-27

Despite these criticisms, BIP39 is by far the most popular seed format, migrating the ecosystem to a new incompatible format with versioning would probably cause more harm than good.

This repo is a proof of concept for how versioning information could be added to BIP39 seeds in a backwards compatible way.

### Implementation

This proof of concept uses a very simple implementation adjustment of interpreting the first byte of the entropy as a version byte. So where a 12 word mnemonic is normally interpreted as `128 bit entropy + 4 bit checksum` it's now interpreted as `8 bit version data + 120 bit entropy + 4 bit checksum`. When deriving the seed from the input entropy the version byte is prepended to the entropy to ensure compatibility between versioned and non-versioned mnemonics.

This means newer versioned mnemonics are entirely BIP39 spec compliant so will still work correctly with older wallets. Older wallets and newer "version aware" wallets will always derive the same seed from a versioned or non-versioned mnemonic, older wallets just won't be aware of the version information.

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

#### Caveats

##### Entropy Reduction

Replacing the first 8 bits of entropy with a version byte means a versioned mnemonic will always have 8 bits less entropy than a non-versioned mnemonic of equivalent word length.

###### Solution

Due to this, it would probably be wise to recommend wallets generating versioned mnemonics always use a minimum of 15 words. This would provide 152 bits of entropy which exceeds the 128 bit entropy minimum provided by existing non-versioned 12 words mnemonics.

##### False Positives

When a "version aware" wallet decodes a non-versioned BIP39 mnemonic, there is a small false positive rate where it may mistakenly interpret a version number. This proof of concept uses one byte for versioning information where there are currently three accepted values, this means there's just under a 1.2% chance that a non-versioned BIP39 mnemonic could be interpreted as a versioned mnemonic.

I don't see this as a huge issue considering that the current situation is that there is no version information at all. A 1.2% false positive rate of interpreting the version is better than a 100% rate of not knowing the version. Wallets can always fall back to searching other known derivation schemes if no funds are found which is no worse than the current situation.

It should be noted that the false positive rate will increase as more version numbers are added.

###### Solution

If there is concern that this false positive rate is too high and more certainty is needed that a seed is intentionally versioned, this can be improved. The false positive rate could be reduced massively by increasing the amount of bits interpreted as version data.

I would suggest using a three byte constant of `0xC2FE58` plus a one byte version number.

This has the following benefits:

- All versioned seeds will start with the two words `seed version` so they are humanly recognisable.
- The false positive rate is reduced to 0.00000596%.
- Adding new version numbers doesn't increase false positive rate.
- BIP39 entropy increases in intervals of 32 bits and the version constant + data take up exactly 32 bits. This allows us to just shift the word length for a given amount of entropy.

For example the [current BIP39 structure](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki#generating-the-mnemonic):

```
|  ENT  | CS | TOTAL |  MS  |
+-------+----+-------+------+
|  128  |  4 |  132  |  12  |
|  160  |  5 |  165  |  15  |
|  192  |  6 |  198  |  18  |
|  224  |  7 |  231  |  21  |
|  256  |  8 |  264  |  24  |
```

Would become:

```
| VCONST | VB |  ENT  | CS | TOTAL |  MS  |
+--------+----+-------+----+-------+------+
|   24   |  8 |  128  |  5 |  165  |  15  |
|   24   |  8 |  160  |  6 |  198  |  18  |
|   24   |  8 |  192  |  7 |  231  |  21  |
|   24   |  8 |  224  |  8 |  264  |  24  |
```

An example of a 128 bit versioned mnemonic under this scheme would be:

```
seed version ability decline way brick marine unfold always armor gate flower wedding cannon urge
```

## License

MIT © Luke Childs
