import { utf8Encode } from '../utf8-encode';

// @see: https://github.com/locutusjs/locutus/blob/master/src/php/strings/md5.js
//       Latest commit 5080992 on 04 Apr 2024

export function md5(string: string) {
  //  discuss at: https://locutus.io/php/md5/
  // original by: Webtoolkit.info (https://www.webtoolkit.info/)
  // improved by: Michael White (https://getsprink.com)
  // improved by: Jack
  // improved by: Kevin van Zonneveld (https://kvz.io)
  //    input by: Brett Zamir (https://brett-zamir.me)
  // bugfixed by: Kevin van Zonneveld (https://kvz.io)
  //      note 1: Keep in mind that in accordance with PHP, the whole string is buffered and then
  //      note 1: hashed. If available, we'd recommend using Node's native crypto modules directly
  //      note 1: in a steaming fashion for faster and more efficient hashing
  //   example 1: md5('Kevin van Zonneveld')
  //   returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'

  if (string === undefined || string === null) {
    return '';
  }

  let hash;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require('node:crypto');
    const md5sum = crypto.createHash('md5');
    md5sum.update(string);
    hash = md5sum.digest('hex');
  } catch {
    hash = undefined;
  }

  if (hash !== undefined) {
    return hash;
  }

  const _rotateLeft = function (lValue: number, indexShiftBits: number) {
    return (lValue << indexShiftBits) | (lValue >>> (32 - indexShiftBits));
  };

  const _addUnsigned = function (lX: number, lY: number) {
    const lX8 = lX & 0x80_00_00_00;
    const lY8 = lY & 0x80_00_00_00;
    const lX4 = lX & 0x40_00_00_00;
    const lY4 = lY & 0x40_00_00_00;
    const lResult = (lX & 0x3f_ff_ff_ff) + (lY & 0x3f_ff_ff_ff);
    if (lX4 & lY4) {
      return lResult ^ 0x80_00_00_00 ^ lX8 ^ lY8;
    }
    if (lX4 | lY4) {
      return lResult & 0x40_00_00_00 ? lResult ^ 0xc0_00_00_00 ^ lX8 ^ lY8 : lResult ^ 0x40_00_00_00 ^ lX8 ^ lY8;
    } else {
      return lResult ^ lX8 ^ lY8;
    }
  };

  const _F = function (x: number, y: number, z: number) {
    return (x & y) | (~x & z);
  };
  const _G = function (x: number, y: number, z: number) {
    return (x & z) | (y & ~z);
  };
  const _H = function (x: number, y: number, z: number) {
    return x ^ y ^ z;
  };
  const _I = function (x: number, y: number, z: number) {
    return y ^ (x | ~z);
  };

  // eslint-disable-next-line max-params
  const _FF = function (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_F(b, c, d), x), ac));
    return _addUnsigned(_rotateLeft(a, s), b);
  };

  // eslint-disable-next-line max-params
  const _GG = function (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_G(b, c, d), x), ac));
    return _addUnsigned(_rotateLeft(a, s), b);
  };

  // eslint-disable-next-line max-params
  const _HH = function (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_H(b, c, d), x), ac));
    return _addUnsigned(_rotateLeft(a, s), b);
  };

  // eslint-disable-next-line max-params
  const _II = function (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_I(b, c, d), x), ac));
    return _addUnsigned(_rotateLeft(a, s), b);
  };

  const _convertToWordArray = function (string: string) {
    let lWordCount;
    const lMessageLength = string.length;
    const lNumberOfWordsTemporary1 = lMessageLength + 8;
    const lNumberOfWordsTemporary2 = (lNumberOfWordsTemporary1 - (lNumberOfWordsTemporary1 % 64)) / 64;
    const lNumberOfWords = (lNumberOfWordsTemporary2 + 1) * 16;
    const lWordArray: number[] = Array.from({ length: lNumberOfWords - 1 });
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition);
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  };

  const _wordToHex = function (lValue: number): string {
    let wordToHexValue = '';
    let wordToHexValueTemporary = '';
    let lByte;
    let lCount;

    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValueTemporary = '0' + lByte.toString(16);
      wordToHexValue = wordToHexValue + wordToHexValueTemporary.slice(-2, wordToHexValueTemporary.length - 2 + 2);
    }
    return wordToHexValue;
  };

  let k;
  let AA;
  let BB;
  let CC;
  let DD;
  let a;
  let b;
  let c;
  let d;
  const S11 = 7;
  const S12 = 12;
  const S13 = 17;
  const S14 = 22;
  const S21 = 5;
  const S22 = 9;
  const S23 = 14;
  const S24 = 20;
  const S31 = 4;
  const S32 = 11;
  const S33 = 16;
  const S34 = 23;
  const S41 = 6;
  const S42 = 10;
  const S43 = 15;
  const S44 = 21;

  string = utf8Encode(string);
  const x = _convertToWordArray(string);
  a = 0x67_45_23_01;
  b = 0xef_cd_ab_89;
  c = 0x98_ba_dc_fe;
  d = 0x10_32_54_76;

  const xl = x.length;
  for (k = 0; k < xl; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = _FF(a, b, c, d, x[k + 0], S11, 0xd7_6a_a4_78);
    d = _FF(d, a, b, c, x[k + 1], S12, 0xe8_c7_b7_56);
    c = _FF(c, d, a, b, x[k + 2], S13, 0x24_20_70_db);
    b = _FF(b, c, d, a, x[k + 3], S14, 0xc1_bd_ce_ee);
    a = _FF(a, b, c, d, x[k + 4], S11, 0xf5_7c_0f_af);
    d = _FF(d, a, b, c, x[k + 5], S12, 0x47_87_c6_2a);
    c = _FF(c, d, a, b, x[k + 6], S13, 0xa8_30_46_13);
    b = _FF(b, c, d, a, x[k + 7], S14, 0xfd_46_95_01);
    a = _FF(a, b, c, d, x[k + 8], S11, 0x69_80_98_d8);
    d = _FF(d, a, b, c, x[k + 9], S12, 0x8b_44_f7_af);
    c = _FF(c, d, a, b, x[k + 10], S13, 0xff_ff_5b_b1);
    b = _FF(b, c, d, a, x[k + 11], S14, 0x89_5c_d7_be);
    a = _FF(a, b, c, d, x[k + 12], S11, 0x6b_90_11_22);
    d = _FF(d, a, b, c, x[k + 13], S12, 0xfd_98_71_93);
    c = _FF(c, d, a, b, x[k + 14], S13, 0xa6_79_43_8e);
    b = _FF(b, c, d, a, x[k + 15], S14, 0x49_b4_08_21);
    a = _GG(a, b, c, d, x[k + 1], S21, 0xf6_1e_25_62);
    d = _GG(d, a, b, c, x[k + 6], S22, 0xc0_40_b3_40);
    c = _GG(c, d, a, b, x[k + 11], S23, 0x26_5e_5a_51);
    b = _GG(b, c, d, a, x[k + 0], S24, 0xe9_b6_c7_aa);
    a = _GG(a, b, c, d, x[k + 5], S21, 0xd6_2f_10_5d);
    d = _GG(d, a, b, c, x[k + 10], S22, 0x2_44_14_53);
    c = _GG(c, d, a, b, x[k + 15], S23, 0xd8_a1_e6_81);
    b = _GG(b, c, d, a, x[k + 4], S24, 0xe7_d3_fb_c8);
    a = _GG(a, b, c, d, x[k + 9], S21, 0x21_e1_cd_e6);
    d = _GG(d, a, b, c, x[k + 14], S22, 0xc3_37_07_d6);
    c = _GG(c, d, a, b, x[k + 3], S23, 0xf4_d5_0d_87);
    b = _GG(b, c, d, a, x[k + 8], S24, 0x45_5a_14_ed);
    a = _GG(a, b, c, d, x[k + 13], S21, 0xa9_e3_e9_05);
    d = _GG(d, a, b, c, x[k + 2], S22, 0xfc_ef_a3_f8);
    c = _GG(c, d, a, b, x[k + 7], S23, 0x67_6f_02_d9);
    b = _GG(b, c, d, a, x[k + 12], S24, 0x8d_2a_4c_8a);
    a = _HH(a, b, c, d, x[k + 5], S31, 0xff_fa_39_42);
    d = _HH(d, a, b, c, x[k + 8], S32, 0x87_71_f6_81);
    c = _HH(c, d, a, b, x[k + 11], S33, 0x6d_9d_61_22);
    b = _HH(b, c, d, a, x[k + 14], S34, 0xfd_e5_38_0c);
    a = _HH(a, b, c, d, x[k + 1], S31, 0xa4_be_ea_44);
    d = _HH(d, a, b, c, x[k + 4], S32, 0x4b_de_cf_a9);
    c = _HH(c, d, a, b, x[k + 7], S33, 0xf6_bb_4b_60);
    b = _HH(b, c, d, a, x[k + 10], S34, 0xbe_bf_bc_70);
    a = _HH(a, b, c, d, x[k + 13], S31, 0x28_9b_7e_c6);
    d = _HH(d, a, b, c, x[k + 0], S32, 0xea_a1_27_fa);
    c = _HH(c, d, a, b, x[k + 3], S33, 0xd4_ef_30_85);
    b = _HH(b, c, d, a, x[k + 6], S34, 0x4_88_1d_05);
    a = _HH(a, b, c, d, x[k + 9], S31, 0xd9_d4_d0_39);
    d = _HH(d, a, b, c, x[k + 12], S32, 0xe6_db_99_e5);
    c = _HH(c, d, a, b, x[k + 15], S33, 0x1f_a2_7c_f8);
    b = _HH(b, c, d, a, x[k + 2], S34, 0xc4_ac_56_65);
    a = _II(a, b, c, d, x[k + 0], S41, 0xf4_29_22_44);
    d = _II(d, a, b, c, x[k + 7], S42, 0x43_2a_ff_97);
    c = _II(c, d, a, b, x[k + 14], S43, 0xab_94_23_a7);
    b = _II(b, c, d, a, x[k + 5], S44, 0xfc_93_a0_39);
    a = _II(a, b, c, d, x[k + 12], S41, 0x65_5b_59_c3);
    d = _II(d, a, b, c, x[k + 3], S42, 0x8f_0c_cc_92);
    c = _II(c, d, a, b, x[k + 10], S43, 0xff_ef_f4_7d);
    b = _II(b, c, d, a, x[k + 1], S44, 0x85_84_5d_d1);
    a = _II(a, b, c, d, x[k + 8], S41, 0x6f_a8_7e_4f);
    d = _II(d, a, b, c, x[k + 15], S42, 0xfe_2c_e6_e0);
    c = _II(c, d, a, b, x[k + 6], S43, 0xa3_01_43_14);
    b = _II(b, c, d, a, x[k + 13], S44, 0x4e_08_11_a1);
    a = _II(a, b, c, d, x[k + 4], S41, 0xf7_53_7e_82);
    d = _II(d, a, b, c, x[k + 11], S42, 0xbd_3a_f2_35);
    c = _II(c, d, a, b, x[k + 2], S43, 0x2a_d7_d2_bb);
    b = _II(b, c, d, a, x[k + 9], S44, 0xeb_86_d3_91);
    a = _addUnsigned(a, AA);
    b = _addUnsigned(b, BB);
    c = _addUnsigned(c, CC);
    d = _addUnsigned(d, DD);
  }

  const temporary = _wordToHex(a) + _wordToHex(b) + _wordToHex(c) + _wordToHex(d);

  return temporary.toLowerCase();
}
