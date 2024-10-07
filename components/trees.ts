type RawTree = [string, number, number];

type Tree = {
  key: string;
  name: string;
  lat: number;
  lng: number;
};

const trees: RawTree[] = [
  ["Ash, green", 9.03, 38.74],
  ["Birch, white", 9.04, 38.75],
  ["Maple, Manitoba", 9.05, 38.76],
  ["Elm, American 'Valley Forge'", 9.06, 38.77],
  ["Spruce, Colorado blue", 9.07, 38.78],
  ["Maple, Norway 'Schwedler'", 9.08, 38.79],
  ["Mulberry, white", 9.09, 38.8],
  ["Elm, Siberian", 9.1, 38.81],
  ["Kentucky coffee", 9.11, 38.82],
  ["Katsura, Japanese", 9.12, 38.83],
  ["Elm, American", 9.13, 38.84],
  ["Maple, Norway", 9.14, 38.85],
  ["Oak, white", 9.15, 38.86],
  ["Honey locust, 'Skyline'", 9.16, 38.87],
  ["Cherry", 9.17, 38.88],
  ["Maple, Norway", 9.18, 38.89],
  ["Hackberry", 9.19, 38.9],
  ["Ash, green", 9.2, 38.91],
  ["Mulberry, white", 9.21, 38.92],
  ["Apple, Sargents", 9.22, 38.93],
  ["Mountain ash, European", 9.23, 38.94],
  ["Oak, white", 9.24, 38.95],
  ["Tulip tree", 9.25, 38.96],
  ["Honey locust, 'Shade master'", 9.26, 38.97],
  ["Hackberry", 9.27, 38.98],
];

const formatted: Tree[] = trees.map(([name, lat, lng]) => ({
  name,
  lat: lat + Math.random() * 0.01,
  lng: lng + Math.random() * 0.01,
  key: JSON.stringify({ name, lat, lng }),
}));

export default formatted;
