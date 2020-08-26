import test from 'ava';
import bip39v from '..';

const fixtures = {
	versionBytes: {
		P2PKH: 0x00,
		P2WPKHP2SH: 0x01,
		P2WPKH: 0x02
	},
	mnemonics: {
		P2PKH: 'seed version abandon bus rebuild logic connect wise illegal traffic transfer olympic royal style equal',
		P2WPKHP2SH: 'seed version about math twice crater force critic grace panic party label flag draft sketch',
		P2WPKH: 'seed version absent reward pipe sketch clarify sight spread addict divorce idle burst alarm tide',
		UNKNOWN: 'seed version divide rural field error snack clump gather shift globe mask trend october ten'
	},
	nonVersionedMnemonic: 'much bottom such hurt hunt welcome cushion erosion pulse admit name deer'
};

test('bip39v is exported', t => {
	t.not(bip39v, undefined);
});

test('bip39v.generateMnemonic() defaults to 24 words', t => {
	t.is(bip39v.generateMnemonic().split(' ').length, 24);
});

test('bip39v.generateMnemonic(length) generates different length mnemonics', t => {
	t.is(bip39v.generateMnemonic(128).split(' ').length, 15);
	t.is(bip39v.generateMnemonic(160).split(' ').length, 18);
	t.is(bip39v.generateMnemonic(192).split(' ').length, 21);
	t.is(bip39v.generateMnemonic(224).split(' ').length, 24);
});

test('bip39v.generateMnemonic() defaults to P2PKH version byte', t => {
	const mnemonic = bip39v.generateMnemonic();
	const versionByte = bip39v.mnemonicToVersionByte(mnemonic);
	t.is(versionByte, bip39v.versions.P2PKH);
	t.is(versionByte, fixtures.versionBytes.P2PKH);
});

test('bip39v.generateMnemonic(length, version) adds correct version', t => {
	Object.entries(fixtures.versionBytes).forEach(([version, byte]) => {
		const mnemonic = bip39v.generateMnemonic(128, bip39v.versions[version]);
		const versionByte = bip39v.mnemonicToVersionByte(mnemonic);
		const versionString = bip39v.mnemonicToVersion(mnemonic);
		t.is(versionByte, bip39v.versions[version]);
		t.is(versionByte, byte);
		t.is(versionString, version);
	});
});

test('bip39v.isVersionedMnemonic(mnemonic) against fixture data', t => {
	Object.values(fixtures.mnemonics).forEach(mnemonic => {
		const isVersionedMnemonic = bip39v.isVersionedMnemonic(mnemonic);
		t.true(isVersionedMnemonic);
	});
	const isVersionedMnemonic = bip39v.isVersionedMnemonic(fixtures.nonVersionedMnemonic);
	t.false(isVersionedMnemonic);
});

test('bip39v.mnemonicToVersionByte(mnemonic) against fixture data', t => {
	Object.entries(fixtures.mnemonics).forEach(([version, mnemonic]) => {
		const versionByte = bip39v.mnemonicToVersionByte(mnemonic);
		const expectedVersionByte = version === 'UNKNOWN' ? 0xFF : fixtures.versionBytes[version];
		t.is(versionByte, expectedVersionByte);
	});
});

test('bip39v.mnemonicToVersion(mnemonic) against fixture data', t => {
	Object.entries(fixtures.mnemonics).forEach(([version, mnemonic]) => {
		const versionString = bip39v.mnemonicToVersion(mnemonic);
		t.is(versionString, version);
	});
});
