# xml to csv converter app

## what was done

-   A front end form to take the xml input (done)
-   Extract out the data found in the CSVIntervalData element with the following conditions,

    -   Create a separate CSV file for each block of data within the CSVIntervalData element that starts with "200" (done)
        -   A single block of data is the "200" row of data, followed by the repeating rows after, until the next "200", or you hit the "900" trailing line (done)
    -   Each CSV file should have the "100" row as a header, and the "900" row as the trailer (done)
    -   Each CSV file should be named from the second field in the "200" row (done)
    -   Valid rows within the CSVIntervalData element can only start with "100", "200", "300","900"
        -   The CSVIntervalData element should contain at least 1 row for each of "100", "200", "300","900" (done)
        -   "100", "900" rows should only appear once inside the CSVIntervalData element (done)
        -   "200" and "300" can repeat and will be within the header and trailer rows (done)
    -   Remove leading and trailing white spaces, tabs, additional newlines. (done)

-   Some Unit test cases

## what wasn't done

-   validate rows - "200" row must be followed by at least 1 "300" row
-   failed to run the unit tests

## what would be done with more time

-   unit tests (I have only write tests for .net programs before and this is my first time using Jest. Would be done with some more time reading documentation)
-   Another entry point to take a file input in the front end

## Instructions

### `Prerequisites`

-   Visual Studio Code
-   node -v12.16.1
-   npm -v6.14.5

### `Installing`

Download the example or clone the repo

Please type the following command to install the packages:

```
npm install
```

To run the project on localhost, please run the following command:

```
npm start
```

Please copy this link to your browser to use the app:

```
http://localhost:3000
```

The unit tests are not runnable though, we can test the program by trying to input some value in the form. As we click on the submit button, it will download the csv output files.
