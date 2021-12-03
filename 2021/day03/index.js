require('../../fetch.js')(2021, 3).then(x => {

  const binary = x.split("\n").filter(a => a !== "");

  const counts = Array(binary[0].length)
    .fill(0)
    .map((_, index) => Array(binary.length)
      .fill(0)
      .map((_, number) => binary[number][index])
      .reduce((data, digit) => ({
        0: data["0"] + (digit === "0" ? 1 : 0),
        1: data["1"] + (digit === "1" ? 1 : 0),
      }), {0: 0, 1: 1})
    );

  const epsilon = counts.map(digits => digits["0"] > digits["1"] ? 0 : 1).join("");
  const gamma = counts.map(digits => digits["0"] < digits["1"] ? 0 : 1).join("");

  const binaryToDecimal = (digits) => parseInt(digits,2);

  const matchDigits = (x,y) => Array.from(x).map((xi, i) => +xi === +y[i] ? 1 : 0);

  const findRating = (binary, mostCommon) => binaryToDecimal(Array(binary[0].length)
    .fill(binary)
    .reduce((data, binary, round) => [
        binary.filter(value => data.includes(value) || data.length <= 0)
      ].map(leftBinaries => ({
        leftBinaries,
        zeros: leftBinaries.filter(x => +x[round] === 0).length,
        ones: leftBinaries.filter(x => +x[round] === 1).length
      }))
      .map(({leftBinaries, zeros, ones}) => ({leftBinaries, criteria: mostCommon
          ? (zeros > ones ? 0 : 1)
          : (zeros > ones ? 1 : 0)
      }))
      .map(({leftBinaries, criteria}) => leftBinaries
        .filter(value => +value[round] === criteria || leftBinaries.length === 1))[0]
    , []
  )[0]);


  console.log(binaryToDecimal(epsilon) * binaryToDecimal(gamma));
  console.log(findRating(binary, true) * findRating(binary, false));

  //console.log(binaryToDecimal(oxygenRating[0].value), binaryToDecimal(scrubberRating[0].value));
  //console.log(binaryToDecimal(oxygenRating[0].value) * binaryToDecimal(scrubberRating[0].value));
});