export interface ICity {
  name: string;
  latitude: number;
  longitude: number;
}

export interface ICityApi {
  results: {
    name: string;
    admin1: string;
    country: string;
    latitude: number;
    longitude: number;
  }[]
}
