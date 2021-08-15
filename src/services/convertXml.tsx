var sharedHeaders: string = "";
var sharedTailer: string = "";

export const convertXml = (dataFromForm: string) => {
	let unformattedArray = formToArray(dataFromForm) || [];
	sharedHeaders = getHeaders(unformattedArray) || "";
	sharedTailer = getTailer(unformattedArray) || "";

	toCSVArraies(unformattedArray).forEach((eachCSV: string[]) => {
		let fileName = getFileName(eachCSV);

		let csvString = eachCSV.join("\n");

		var a = document.createElement("a");
		a.href = "data:attachment/csv," + encodeURIComponent(csvString);
		a.target = "_blank";
		a.download = `${fileName}.csv`;

		document.body.appendChild(a);
		a.click();
	});
};

const getFileName = (eachCSV: string[]) => {
	return eachCSV[1].split(",")[1];
};

const formToArray = (dataFromForm: string) => {
	var xmlParser = new DOMParser();
	var xmlDoc = xmlParser.parseFromString(dataFromForm, "text/xml");
	return xmlDoc
		.getElementsByTagName("CSVIntervalData")[0]
		.textContent?.split("\n");
};

//get the header row which start with 100
const getHeaders = (xmlDocArr: string[]) => {
	let headers;
	xmlDocArr.forEach((row) => {
		if (row.startsWith("100")) headers = row;
	});
	return headers;
};

//get the tailer row that start with 900
const getTailer = (xmlDocArr: string[]) => {
	let tailer;
	xmlDocArr.forEach((row) => {
		if (row.startsWith("900")) tailer = row;
	});
	return tailer;
};

const toCSVArraies = (unformattedRows: string[]) => {
	let CSVArraies: string[][] = [];
	let seperatedData = seperateRowsToChunks(unformattedRows);
	seperatedData.forEach((chunk) => {
		let eachCSV: string[] = [sharedHeaders];
		chunk.forEach((row) => {
			//remove the comma in the end
			row.charAt(row.length - 1) === ","
				? eachCSV.push(row.substring(0, row.length - 1))
				: eachCSV.push(row);
		});
		eachCSV.push(sharedTailer);
		CSVArraies.push(eachCSV);
	});
	return CSVArraies;
};

//seperate the rows by the line which contains 200
const seperateRowsToChunks = (unformattedRows: string[]) => {
	let chunks: string[][] = [];
	let quickPointer = 0;
	let slowPointer = 0;
	let validatedRows = validateRows(unformattedRows);
	validatedRows.forEach((row, i) => {
		if (row.startsWith("200") || row.includes("900")) {
			if (quickPointer === 0) {
				quickPointer = i + 1;
				slowPointer = i + 1;
				// to make sure it contains at least 1 row for each 200
			} else if (i - slowPointer > 1) {
				quickPointer = i + 1;
				chunks.push(unformattedRows.slice(slowPointer, quickPointer));
				slowPointer = i + 1;
			}
		}
	});
	return chunks;
};

//to check whether the row is validate
const validateRows = (unformattedRows: string[]) => {
	let validatedRows = unformattedRows.filter(
		(row) =>
			row.startsWith("100") ||
			row.startsWith("200") ||
			row.startsWith("300") ||
			row.startsWith("900")
	);
	return validatedRows;
};
