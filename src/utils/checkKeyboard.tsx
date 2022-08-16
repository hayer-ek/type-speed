import { Language } from "../interfaces";

const ruLetters = [
    "а",
    "б",
    "в",
    "г",
    "д",
    "е",
    "ё",
    "ж",
    "з",
    "и",
    "й",
    "к",
    "л",
    "м",
    "н",
    "о",
    "п",
    "р",
    "с",
    "т",
    "у",
    "ф",
    "х",
    "ц",
    "ч",
    "ш",
    "щ",
    "ъ",
    "ы",
    "ь",
    "э",
    "ю",
    "я",
    "'",
    "\"",
    "`",
    "~",
    "-",
    "_",
    ".",
    ",",
    "\\",
    "/"
];
const enLetters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "'",
    "\"",
    "`",
    "~",
    "-",
    "_",
    ".",
    ",",
    "\\",
    "/"
];

export default function checkKeyboard(
    event: KeyboardEvent,
    language: Language
) {
    if (language === "ru") {
        if (ruLetters.includes(event.key.toLowerCase())) return true;
        return false;
    }

    if (language === "en") {
        if (enLetters.includes(event.key.toLowerCase())) return true;
        return false;
    }
}
