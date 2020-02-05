const createObject = Object.create;

export interface MapLike<T> {
  [key: string]: T | undefined;
}

export function createMap<T>(): MapLike<T> {
  const map: MapLike<T> = createObject(null);
  map["__"] = undefined;
  delete map["__"];
  return map;
}
