const createObject = Object.create;

export function createMap<T>() {
  const map: { [key: string]: T | undefined } = createObject(null);
  map["__"] = undefined;
  delete map["__"];
  return map;
}
