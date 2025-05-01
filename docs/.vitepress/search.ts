export const customTokenProcessor = (token: string): string | null => {
  // Remove dots and normalize case before processing
  const normalizedToken = token.replace(/\./g, '').toLowerCase()

  const step2list: Record<string, string> = {
    ational: 'ate',
    tional: 'tion',
    enci: 'ence',
    anci: 'ance',
    izer: 'ize',
    bli: 'ble',
    alli: 'al',
    entli: 'ent',
    eli: 'e',
    ousli: 'ous',
    ization: 'ize',
    ation: 'ate',
    ator: 'ate',
    alism: 'al',
    iveness: 'ive',
    fulness: 'ful',
    ousness: 'ous',
    aliti: 'al',
    iviti: 'ive',
    biliti: 'ble',
    logi: 'log'
  }

  const step3list: Record<string, string> = {
    icate: 'ic',
    ative: '',
    alize: 'al',
    iciti: 'ic',
    ical: 'ic',
    ful: '',
    ness: ''
  }

  const consonant = '[^aeiou]'
  const vowel = '[aeiouy]'
  const consonants = '(' + consonant + '[^aeiouy]*)'
  const vowels = '(' + vowel + '[aeiou]*)'

  const gt0 = new RegExp('^' + consonants + '?' + vowels + consonants)
  const eq1 = new RegExp(
    '^' + consonants + '?' + vowels + consonants + vowels + '?$'
  )
  const gt1 = new RegExp(
    '^' + consonants + '?(' + vowels + consonants + '){2,}'
  )
  const vowelInStem = new RegExp('^' + consonants + '?' + vowel)
  const consonantLike = new RegExp('^' + consonants + vowel + '[^aeiouwxy]$')

  const sfxLl = /ll$/
  const sfxE = /^(.+?)e$/
  const sfxY = /^(.+?)y$/
  const sfxIon = /^(.+?(s|t))(ion)$/
  const sfxEdOrIng = /^(.+?)(ed|ing)$/
  const sfxAtOrBlOrIz = /(at|bl|iz)$/
  const sfxEED = /^(.+?)eed$/
  const sfxS = /^.+?[^s]s$/
  const sfxSsesOrIes = /^.+?(ss|i)es$/
  const sfxMultiConsonantLike = /([^aeiouylsz])\1$/
  const step2 =
    /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/
  const step3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/
  const step4 =
    /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/

  function stemmer(value: string) {
    let result = String(value).toLowerCase()

    // Exit early.
    if (result.length < 3) {
      return result
    }

    /** @type {boolean} */
    let firstCharacterWasLowerCaseY = false

    // Detect initial `y`, make sure it never matches.
    if (
      result.codePointAt(0) === 121 // Lowercase Y
    ) {
      firstCharacterWasLowerCaseY = true
      result = 'Y' + result.slice(1)
    }

    // Step 1a.
    if (sfxSsesOrIes.test(result)) {
      // Remove last two characters.
      result = result.slice(0, -2)
    } else if (sfxS.test(result)) {
      // Remove last character.
      result = result.slice(0, -1)
    }

    /** @type {RegExpMatchArray|null} */
    let match

    // Step 1b.
    if ((match = sfxEED.exec(result))) {
      if (gt0.test(match[1])) {
        // Remove last character.
        result = result.slice(0, -1)
      }
    } else if (
      (match = sfxEdOrIng.exec(result)) &&
      vowelInStem.test(match[1])
    ) {
      result = match[1]

      if (sfxAtOrBlOrIz.test(result)) {
        // Append `e`.
        result += 'e'
      } else if (sfxMultiConsonantLike.test(result)) {
        // Remove last character.
        result = result.slice(0, -1)
      } else if (consonantLike.test(result)) {
        // Append `e`.
        result += 'e'
      }
    }

    // Step 1c.
    if ((match = sfxY.exec(result)) && vowelInStem.test(match[1])) {
      // Remove suffixing `y` and append `i`.
      result = match[1] + 'i'
    }

    // Step 2.
    if ((match = step2.exec(result)) && gt0.test(match[1])) {
      result = match[1] + step2list[match[2]]
    }

    // Step 3.
    if ((match = step3.exec(result)) && gt0.test(match[1])) {
      result = match[1] + step3list[match[2]]
    }

    // Step 4.
    if ((match = step4.exec(result))) {
      if (gt1.test(match[1])) {
        result = match[1]
      }
    } else if ((match = sfxIon.exec(result)) && gt1.test(match[1])) {
      result = match[1]
    }

    // Step 5.
    if (
      (match = sfxE.exec(result)) &&
      (gt1.test(match[1]) ||
        (eq1.test(match[1]) && !consonantLike.test(match[1])))
    ) {
      result = match[1]
    }

    if (sfxLl.test(result) && gt1.test(result)) {
      result = result.slice(0, -1)
    }

    // Turn initial `Y` back to `y`.
    if (firstCharacterWasLowerCaseY) {
      result = 'y' + result.slice(1)
    }

    return result
  }
  // adapted from these two sources
  // https://gist.github.com/sebleier/554280
  // https://meta.wikimedia.org/wiki/Stop_word_list/google_stop_word_list
  const stopWords = new Set([
    'a',
    'about',
    'above',
    'after',
    'again',
    'against',
    'all',
    'am',
    'an',
    'and',
    'any',
    'are',
    'aren',
    'as',
    'at',
    'be',
    'because',
    'been',
    'before',
    'being',
    'below',
    'between',
    'both',
    'but',
    'by',
    'can',
    'cannot',
    'com',
    'could',
    'couldn',
    'did',
    'didn',
    'do',
    'does',
    'doesn',
    'doing',
    'down',
    'during',
    'each',
    'few',
    'for',
    'from',
    'further',
    'had',
    'hadn',
    'has',
    'hasn',
    'have',
    'haven',
    'having',
    'he',
    'her',
    'here',
    'hers',
    'herself',
    'him',
    'himself',
    'his',
    'how',
    'i',
    'if',
    'in',
    'into',
    'is',
    'isn',
    'it',
    'its',
    'itself',
    'just',
    'let',
    'll',
    'me',
    'more',
    'most',
    'mustn',
    'my',
    'myself',
    'no',
    'nor',
    'not',
    'now',
    'of',
    'off',
    'on',
    'once',
    'only',
    'or',
    'other',
    'ought',
    'our',
    'ours',
    'ourselves',
    'out',
    'over',
    'own',
    're',
    's',
    'same',
    'shan',
    'she',
    'should',
    'shouldn',
    'so',
    'some',
    'such',
    't',
    'than',
    'that',
    'the',
    'their',
    'theirs',
    'them',
    'themselves',
    'then',
    'there',
    'these',
    'they',
    'this',
    'those',
    'through',
    'to',
    'too',
    'under',
    'until',
    'up',
    've',
    'very',
    'was',
    'wasn',
    'we',
    'were',
    'weren',
    'what',
    'when',
    'where',
    'which',
    'while',
    'who',
    'whom',
    'why',
    'will',
    'with',
    'won',
    'would',
    'wouldn',
    'you',
    'your',
    'yours',
    'yourself',
    'yourselves'
  ])

  return stopWords.has(normalizedToken) ? null : stemmer(normalizedToken)
}

export const customTokenize = (text: string): string[] => {
  // Pre-process the text to handle dots in special cases
  // This will help with cases like "V.R" to match with "vr" by removing dots
  const preprocessedText = text.replace(/([A-Za-z])\.([A-Za-z])/g, '$1$2') // Remove dots between letters (like V.R -> VR)

  // This regular expression matches any Unicode space or punctuation character
  // Copied from https://github.com/lucaong/minisearch
  // which adapted from https://unicode.org/cldr/utility/list-unicodeset.jsp?a=%5Cp%7BZ%7D%5Cp%7BP%7D&abb=on&c=on&esc=on
  const SPACE_OR_PUNCTUATION =
    /[\n\r -#%-*,-/:;?@[-\]_{}\u00A0\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u1680\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2000-\u200A\u2010-\u2029\u202F-\u2043\u2045-\u2051\u2053-\u205F\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u3000-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]+/u

  // Split on any space or punctuation; same as minisearch default tokenizer
  // except i've corrected for the possibility for returning empty string
  const tokens = preprocessedText.split(SPACE_OR_PUNCTUATION).filter(Boolean)

  // Handle cases with capital letters in the middle (like "xManager" -> "x Manager")
  const expandedTokens: string[] = []

  for (const token of tokens) {
    expandedTokens.push(token)

    // If token has a capital letter in the middle, add a version with space before it
    // This helps with cases like "xManager" to match with "x Manager"
    const splitOnCapitals = token.replace(/([a-z])([A-Z])/g, '$1 $2')
    if (splitOnCapitals !== token) {
      const additionalTokens = splitOnCapitals.split(' ').filter(Boolean)
      expandedTokens.push(...additionalTokens)
    }
  }

  return expandedTokens
}
