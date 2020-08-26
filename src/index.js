const crypto = require('crypto');
const bip39 = require('bip39');

const PREFIX = [0xC2, 0xFE, 0x58];

const P2PKH = 0x00;
const P2WPKHP2SH = 0x01;
const P2WPKH = 0x02;

const bip39v = {
	versions: {P2PKH, P2WPKHP2SH, P2WPKH}
};

bip39v.generateMnemonic = (length = 224, versionByte = P2PKH) => {
	const buffer = Buffer.concat([
		Buffer.from(PREFIX),
		Buffer.from([versionByte]),
		crypto.randomBytes(length / 8)
	]);

	return bip39.entropyToMnemonic(buffer);
};

bip39v.mnemonicToVersionByte = mnemonic => {
	const buffer = Buffer.from(
		bip39.mnemonicToEntropy(mnemonic),
		'hex'
	);

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
