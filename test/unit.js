import test from 'ava';
import bip39v from '..';

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
	t.is(versionByte, 0x00);
});
