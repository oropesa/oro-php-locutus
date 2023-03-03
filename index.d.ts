export function serialize( mixedValue: any ): string

export function unserialize( str: string | any, showError?: boolean ): any

export function htmlspecialchars(
    string: string,
    quoteStyle?: number | null,
    charset?: null,
    doubleEncode?: boolean
): string

export function md5( str: string ): string

export function utf8Encode( argString: string ): string

export function utf8Decode( strData: string ): string