import test from 'ava';
import bip39v from '..';

const fixtures = {
	versionBytes: {
		P2PKH: 0x00,
		P2WPKHP2SH: 0x01,
		P2WPKH: 0x02
	},
	mnemonics: {
		P2PKH: 'above rack wait angle thank ribbon strategy gallery silk leave brave swarm',
		P2WPKHP2SH: 'abuse lottery polar torch prison option common common mix moon wonder length',
		P2WPKH: 'across sword flip inspire allow joke skate drip icon lady emerge toss',
		UNKNOWN: 'such galaxy much glimpse music turkey toward exhaust filter key pilot hello'
	}
};

test('bip39v is exported', t => {
	t.not(bip39v, undefined);
});

test('bip39v.generateMnemonic() defaults to 12 words', t => {
	t.is(bip39v.generateMnemonic().split(' ').length, 12);
});

test('bip39v.generateMnemonic(length) generates different length mnemonics', t => {
	t.is(bip39v.generateMnemonic(128).split(' ').length, 12);
	t.is(bip39v.generateMnemonic(160).split(' ').length, 15);
	t.is(bip39v.generateMnemonic(192).split(' ').length, 18);
	t.is(bip39v.generateMnemonic(224).split(' ').length, 21);
	t.is(bip39v.generateMnemonic(256).split(' ').length, 24);
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

test('bip39v.mnemonicToVersionByte(mnemonic) against fixture data', t => {
	Object.entries(fixtures.mnemonics).forEach(([version, mnemonic]) => {
		const versionByte = bip39v.mnemonicToVersionByte(mnemonic);
		const expectedVersionByte = version === 'UNKNOWN' ? 0xD8 : fixtures.versionBytes[version];
		t.is(versionByte, expectedVersionByte);
	});
});

test('bip39v.mnemonicToVersion(mnemonic) against fixture data', t => {
	Object.entries(fixtures.mnemonics).forEach(([version, mnemonic]) => {
		const versionString = bip39v.mnemonicToVersion(mnemonic);
		t.is(versionString, version);
	});
});
