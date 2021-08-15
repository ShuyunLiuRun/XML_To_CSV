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

// push each row of the xml into an array
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

export const toCSVArraies = (unformattedRows: string[]) => {
	console.log(unformattedRows);

	let CSVArraies: string[][] = [];
	//seperate the chunks by the "200"
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
			} else {
				quickPointer = i + 1;
				chunks.push(unformattedRows.slice(slowPointer, quickPointer));
				slowPointer = i + 1;
			}
		}
	});
	return chunks;
};

//to check whether the rows are validate
const validateRows = (unformattedRows: string[]) => {
	const validateOneRowForEach = (unformattedRows: string[]) => {
		let one = false;
		let two = false;
		let three = false;
		let nine = false;
		unformattedRows.forEach((row) => {
			if (row.startsWith("100")) one = true;
			if (row.startsWith("200")) two = true;
			if (row.startsWith("300")) three = true;
			if (row.startsWith("900")) nine = true;
		});
		return one && two && three && nine;
	};

	const validateOnlyAppearOnce = (unformattedRows: string[]) => {
		let one = 0;
		let nine = 0;
		unformattedRows.forEach((row) => {
			if (row.startsWith("100")) one += 1;
			if (row.startsWith("900")) nine += 1;
		});
		return one === 1 && nine === 1;
	};

	const validateWithinHeadAndTail = (unformattedRows: string[]) => {
		let two = false;
		let three = false;
		unformattedRows.forEach((row, i) => {
			if (row.startsWith("200"))
				two = i > 0 && i < unformattedRows.length - 1;
			if (row.startsWith("300"))
				three = i > 0 && i < unformattedRows.length - 1;
		});
		return two && three;
	};

	try {
		if (validateOneRowForEach(unformattedRows) === false) {
			throw new Error(
				'The CSVIntervalData element should contain at least 1 row for each of "100", "200", "300","900"'
			);
		}
		if (validateOnlyAppearOnce(unformattedRows) === false) {
			throw new Error(
				"'100', '900' rows should only appear once inside the CSVIntervalData element"
			);
		}
		if (validateWithinHeadAndTail(unformattedRows) === false) {
			throw new Error(
				'"200" and "300" can repeat and should be within the header and trailer rows'
			);
		}
	} catch (e) {
		console.error(e);
	}

	let validatedRows = unformattedRows.filter(
		(row) =>
			row.startsWith("100") ||
			row.startsWith("200") ||
			row.startsWith("300") ||
			row.startsWith("900")
	);
	return validatedRows;
};
