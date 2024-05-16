import Stage1 from '../assets/godhead_level_icon/stage_1.svg';
import Stage2 from '../assets/godhead_level_icon/stage_2.svg';
import Stage3 from '../assets/godhead_level_icon/stage_3.svg';
import Stage4 from '../assets/godhead_level_icon/stage_4.svg';
import Stage5 from '../assets/godhead_level_icon/stage_5.svg';
import Stage6 from '../assets/godhead_level_icon/stage_6.svg';
import Stage7 from '../assets/godhead_level_icon/stage_7.svg';
import Stage8 from '../assets/godhead_level_icon/stage_8.svg';
import Stage9 from '../assets/godhead_level_icon/stage_9.svg';
import Stage10 from '../assets/godhead_level_icon/stage_10.svg';
import Stage11 from '../assets/godhead_level_icon/stage_11.svg';
import Stage12 from '../assets/godhead_level_icon/stage_12.svg';
import Stage13 from '../assets/godhead_level_icon/stage_13.svg';
import Stage14 from '../assets/godhead_level_icon/stage_14.svg';
import Stage15 from '../assets/godhead_level_icon/stage_15.svg';
import Stage16 from '../assets/godhead_level_icon/stage_16.svg';
import Stage17 from '../assets/godhead_level_icon/stage_17.svg';
import Stage18 from '../assets/godhead_level_icon/stage_18.svg';
import Stage19 from '../assets/godhead_level_icon/stage_19.svg';
import Stage20 from '../assets/godhead_level_icon/stage_20.svg';
import Stage21 from '../assets/godhead_level_icon/stage_21.svg';
import Stage22 from '../assets/godhead_level_icon/stage_22.svg';
import Stage23 from '../assets/godhead_level_icon/stage_23.svg';
import Stage24 from '../assets/godhead_level_icon/stage_24.svg';
import Stage25 from '../assets/godhead_level_icon/stage_25.svg';
import Stage26 from '../assets/godhead_level_icon/stage_26.svg';
import Stage27 from '../assets/godhead_level_icon/stage_27.svg';
import Stage28 from '../assets/godhead_level_icon/stage_28.svg';
import Stage29 from '../assets/godhead_level_icon/stage_29.svg';
import Stage30 from '../assets/godhead_level_icon/stage_30.svg';
import Stage31 from '../assets/godhead_level_icon/stage_31.svg';
import Stage32 from '../assets/godhead_level_icon/stage_32.svg';
import Stage33 from '../assets/godhead_level_icon/stage_33.svg';
import Stage34 from '../assets/godhead_level_icon/stage_34.svg';
import Stage35 from '../assets/godhead_level_icon/stage_35.svg';

const levelIconMap = {
    27: Stage1,
    28: Stage1,
    29: Stage2,
    30: Stage2,
    31: Stage3,
    32: Stage3,
    33: Stage4,
    34: Stage4,
    35: Stage5,
    36: Stage5,
    37: Stage6,
    38: Stage6,
    39: Stage7,
    40: Stage7,
    41: Stage8,
    42: Stage8,
    43: Stage9,
    44: Stage9,
    45: Stage10,
    46: Stage10,
    47: Stage11,
    48: Stage11,
    49: Stage12,
    50: Stage12,
    51: Stage13,
    52: Stage13,
    53: Stage14,
    54: Stage14,
    55: Stage15,
    56: Stage15,
    57: Stage16,
    58: Stage16,
    59: Stage17,
    60: Stage17,
    61: Stage18,
    62: Stage18,
    63: Stage19,
    64: Stage19,
    65: Stage20,
    66: Stage20,
    67: Stage21,
    68: Stage21,
    69: Stage22,
    70: Stage22,
    71: Stage23,
    72: Stage23,
    73: Stage24,
    74: Stage24,
    75: Stage25,
    76: Stage25,
    77: Stage26,
    78: Stage26,
    79: Stage27,
    80: Stage27,
    81: Stage28,
    82: Stage28,
    83: Stage29,
    84: Stage29,
    85: Stage30,
    86: Stage30,
    87: Stage31,
    88: Stage31,
    89: Stage32,
    90: Stage32,
    91: Stage33,
    92: Stage33,
    93: Stage34,
    94: Stage34,
    95: Stage35,
    96: Stage35,
}

export function GetGodheadIcon(level) {
    if (level <= 96) {
        return levelIconMap[level]
    }
    return levelIconMap[96]
}