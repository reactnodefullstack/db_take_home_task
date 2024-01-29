interface Name {
    common: string,
    official: string,
    nativeName: NativeNAme,
}
interface NativeNAme {
    cat: Cat
}
interface Cat {
    official: string,
    common: string
}
export interface Currency {
    name: string,
    symbol: string
}
interface Currencies {
    [key: string]: Currency
}
interface Idd {
    root: string,
    suffixes: string[]
}
export interface Languages {
    [key: string]: string
}
interface Translation {
    official: string,
    common: string
}
interface Translations {
    [key: string]: Translation
}
interface Demonym {
    f: string,
    m: string
}
interface Demonyms {
    [key: string ]: Demonym
}
interface Maps {
    [key: string]: string
}
interface Car {
    signs: string[],
    side: string
}
interface Flags {
    png: string,
    svg: string,
    alt: string
}
interface CoatOfArms {
    png: string,
    svg: string
}
type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
interface CapitalInfo {
    latlng: number[]
}
interface PostalCode {
    format: string,
    regex: string
}
interface Cca2 {
    [key:string]: string
}
interface Cca3 {
    [key:string]: string
}
interface Ccn3 {
    [key:string]: string
}
export interface Country {
    name: Name,
    tld: string[],
    cca2: Cca2,
    ccn3: Ccn3,
    cca3: Cca3,
    cioc: string,
    independent: boolean,
    status: string,
    unMember: boolean,
    currencies: Currencies,
    idd: Idd,
    capital: string[],
    altSpellings: string[],
    region: string,
    subregion: string,
    languages: Languages,
    translations: Translations,
    latlng: number[],
    landlocked: boolean,
    borders: string[],
    area: number,
    demonyms: Demonyms,
    flag: string,
    maps: Maps,
    population: number,
    fifa: string,
    car: Car,
    timezones: string[],
    continents: string[],
    flags: Flags,
    coatOfArms: CoatOfArms,
    startOfWeek: DayOfWeek,
    capitalInfo: CapitalInfo,
    postalCode: PostalCode
}