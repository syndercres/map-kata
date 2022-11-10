import ourFilter from "./filter";

test("", () => {
  expect(ourFilter([10, 50, -20, -10, 100], (v:number) => v < 11)).toEqual([
    10, -20, -10,
  ]);
});

test("", () => {
  expect(ourFilter("AbcDeFgHI".split(""), (ch:string) => ch.toUpperCase() === ch)).toStrictEqual(["A", "D", "F", "H", "I"]);
});

