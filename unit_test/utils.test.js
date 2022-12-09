const {findCenterCoordinate} = require("../utils/functions");

test("test findCenterCoordinate util", () => {
  const mockup = [
    { lat: 14, lng: 120 },
    { lat: 15, lng: 121 },
    { lat: 16, lng: 122 },
  ];

  const centerCoordinate = findCenterCoordinate(mockup);
  expect(JSON.stringify(centerCoordinate)).toBe(JSON.stringify({ lat: 15,  lng: 121 }));
});