const crypto = require('crypto');
const bip39 = require('bip39');

const PREFIX = Buffer.from('C2FE58', 'hex');

const P2PKH = 0x00;
const P2WPKHP2SH = 0x01;
const P2WPKH = 0x02;

const getMnemonicBuffer = mnemonic => Buffer.from(
	bip39.mnemonicToEntropy(mnemonic),
	'hex'
);

const bip39v = {
	versions: {P2PKH, P2WPKHP2SH, P2WPKH}
};

bip39v.generateMnemonic = (length = 224, versionByte = P2PKH) => {
	const buffer = Buffer.concat([
		PREFIX,
		Buffer.from([versionByte]),
		crypto.randomBytes(length / 8)
	]);

	return bip39.entropyToMnemonic(buffer);
};

bip39v.isVersionedMnemonic = mnemonic => {
	const buffer = getMnemonicBuffer(mnemonic);

	return buffer.slice(0, PREFIX.length).equals(PREFIX);
};

bip39v.mnemonicToVersionByte = mnemonic => {
	if (!bip39v.isVersionedMnemonic(mnemonic)) {
		throw new Error('Cannot get version byte of non-versioned mnemonic.');
	}

	const buffer = getMnemonicBuffer(mnemonic);

	return buffer[PREFIX.length];
};

bip39v.mnemonicToVersion = mnemonic => {
	const versionByte = bip39v.mnemonicToVersionByte(mnemonic);

	for (const [name, byte] of Object.entries(bip39v.versions)) {
		if (versionByte === byte) {
			return name;
		}
	}

	return 'UNKNOWN';
};

module.exports = bip39v;
