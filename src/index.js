const bip39 = require('bip39');

const P2PKH = 0x00;
const P2WPKHP2SH = 0x01;
const P2WPKH = 0x02;

const bip39v = {
	versions: {P2PKH, P2WPKHP2SH, P2WPKH}
};

const getEntropyBuffer = mnemonic => Buffer.from(
	bip39.mnemonicToEntropy(mnemonic),
	'hex'
);

bip39v.generateMnemonic = (length, versionByte = P2PKH) => {
	const entropy = getEntropyBuffer(bip39.generateMnemonic(length));
	entropy[0] = versionByte;

	return bip39.entropyToMnemonic(entropy);
};

bip39v.mnemonicToVersionByte = mnemonic => {
	const entropy = getEntropyBuffer(mnemonic);

	return entropy[0];
};

bip39v.mnemonicToVersionByte = mnemonic => getEntropyBuffer(mnemonic)[0];

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
