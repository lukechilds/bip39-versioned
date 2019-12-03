import test from 'ava';
import bip39 from '..';

test('bip39 is exported', t => {
	t.not(bip39, undefined);
});
