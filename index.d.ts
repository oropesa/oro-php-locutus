export function serialize( mixedValue: any ): string

export function unserialize( str: string | any, showError?: boolean ): any

export type ENT_OPTION =
    | 0 | 'ENT_NOQUOTES'
    | 1 | 'ENT_HTML_QUOTE_SINGLE'
    | 2 | 'ENT_HTML_QUOTE_DOUBLE'
        | 'ENT_COMPAT'
    | 3 | 'ENT_QUOTES'
    | 4 | 'ENT_IGNORE'

export function htmlspecialchars(
    string: string,
    quoteStyle?: ENT_OPTION | ENT_OPTION[],
    charset?: null,
    doubleEncode?: boolean
): string

export function md5( str: string ): string

export function utf8Encode( str: string ): string

export function utf8Decode( str: string ): string