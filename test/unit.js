import test from 'ava';
import bip39v from '..';

test('bip39v is exported', t => {
	t.not(bip39v, undefined);
});
