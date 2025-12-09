import { REFERENCE_TOKEN_REGEX, isTextReferencesToken } from './WordCounter';

test('Reference token regex matches good references titles', () => {
  const goodTexts = [
    '   \n Références   \n  ',
    'reference',
    '[1] Rèfèrences.',
    '2) Rëfêrence.',
    '3# References.',
    '1.2 Références',
    'A Références',
    'A) Références',
    'A.B) Références',
    '[1.4] Références',
  ];

  const idxTextMatching = goodTexts
    .map((txt, idx) => [isTextReferencesToken(txt), idx])
    .filter(([m]) => m)
    .map(([,idx]) => idx);

  for (let i = 0; i < goodTexts.length; i++) {
    expect(idxTextMatching).toContain(i);
  }
});

test('Reference token regex does not match not-title text', () => {
  const goodTexts = [
    '   \n\t Nous présentons les Références suivantes  \n\t  ',
    'Vous trouverez les références.',
    'Ces références montrent que nous sommes ici.',
    'Références comprise, en en sommes là.',
  ];

  const nbTextMatching = goodTexts
    .map(txt => [txt.match(REFERENCE_TOKEN_REGEX), txt])
    .filter(([m, txt]) => m?.length === 1 && m[0].length === txt.length)
    .length;

  expect(nbTextMatching).toEqual(0);
});
