import { toCSVArraies } from "./convertXml";

// to test if the CSVIntervalData element contain at least 1 row for each
test("case one", () => {
	expect(
		toCSVArraies(["200,12345678901,E1,E1,E1,N1,HGLMET501,KWH,30,"])
	).toThrow();
});

// to test if header or tailer appeared more than once
test("case two", () => {
	expect(toCSVArraies(["900", "900"])).toThrow();
});

// to test '200' or '300' be within the header and trailer rows
test("case three", () => {
	expect(
		toCSVArraies([
			"200,12345678901,E1,E1,E1,N1,HGLMET501,KWH,30,",
			"100,NEM12,201801211010,MYENRGY,URENRGY",
			"900"
		])
	).toThrow();
});
