export interface ICity {
  results: ICityResults[]
}

export interface ICityResults {
  name: string;
  admin1: string;
  country: string;
  latitude: number;
  longitude: number;
}
