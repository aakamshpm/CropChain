const parceOCR = (text) => {
  let name = null;
  let aadhaar = null;
  let land = null;

  // Match aadhaar with regex to extract aadhaar number only
  const aadhaarMatch = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);

  if (aadhaarMatch) {
    aadhaar = aadhaarMatch[0].trim();
    if (aadhaar.length === 12 && !aadhaar.includes(" ")) {
      aadhaar = aadhaar.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3");
    }
  }

  // Extract fiels "Name"
  const nameMatch = text.match(/Name:\s*(.*)/i);

  if (nameMatch) {
    name = nameMatch[1].split("\n")[0].trim();
  }

  // Extract land record
  if (text.includes("7/12")) {
    const landMatch = text.match(/(7\/12\s*Extract:\s*.*)/i);
    if (landMatch) {
      land = landMatch[1].trim();
    } else {
      land = "7/12 Extract found";
    }
  }

  return { aadhaar, name, land };
};

const computeConfidence = (data) => {
  let score = 0;

  if (data.aadhaar) score += 1;
  if (data.name) score += 1;
  if (data.land) score += 1;

  return score;
};

const matchFarmer = async (data, farmer, res) => {
  try {
    // check if aadhaar matches
    if (
      data.aadhaar &&
      data.aadhaar.replace(/\s+/g, "") === farmer?.aadhaarNumber
    ) {
      // compare registered name
      if (data.name && ((farmer.firstName + " " + farmer.lastName) === data.name)) {
        return { match: true, farmer };
      } else {
        return { match: false, message: "Name does not match" };
      }
    } else {
      return { match: false, message: "Aadhaar does not match" };
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    throw new Error(err.message);
  }
};

export { parceOCR, matchFarmer, computeConfidence };
