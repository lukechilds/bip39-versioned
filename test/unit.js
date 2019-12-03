import test from 'ava';
import bip39v from '..';

test('bip39v is exported', t => {
	t.not(bip39v, undefined);
});

test('bip39v.generateMnemonic() defaults to 12 words', t => {
	t.is(bip39v.generateMnemonic().split(' ').length, 12);
});
