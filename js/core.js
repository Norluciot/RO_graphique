function addEquation() {
  var equationCount = document.getElementsByClassName("equation").length;
  var equationCountString = "(" + equationCount + ")";

  var eqContainer = document.getElementById("equations");
  var root_form = document.createElement("form");
  root_form.setAttribute("class", "form-inline equation");
  root_form.setAttribute("role", "form");

  var input_x1 = document.createElement("input");
  var input_x2 = document.createElement("input");
  var input_y = document.createElement("input");

  input_x1.setAttribute("type", "number");
  input_x1.setAttribute("class", "form-control coefficients");
  input_x1.setAttribute("style", "width: 20%; margin-right: 5px;");
  input_x1.setAttribute("onchange", "verifyInputsRealtime(this)");

  input_x2.setAttribute("type", "number");
  input_x2.setAttribute("class", "form-control coefficients");
  input_x2.setAttribute("style", "width: 20%; margin-right: 5px;");
  input_x2.setAttribute("onchange", "verifyInputsRealtime(this)");

  input_y.setAttribute("type", "number");
  input_y.setAttribute("class", "form-control coefficients");
  input_y.setAttribute("style", "width: 20%; margin-right: 5px;");
  input_y.setAttribute("onchange", "verifyInputsRealtime(this)");

  var label_x1 = document.createElement("label");
  var label_x2 = document.createElement("label");
  var label_eq = document.createElement("label");
  label_x1.setAttribute("style", "margin-right: 3px;");
  label_x2.setAttribute("style", "margin-right: 3px;");
  label_eq.setAttribute("style", "margin-right: 3px;");

  var label_x1_text = document.createTextNode("X1");
  var label_x2_text = document.createTextNode("X2");
  var label_eq_text = document.createTextNode(equationCountString);

  var select_elt = document.createElement("select");
  select_elt.setAttribute(
    "style",
    "margin-right: 3px; display: inline; width: 50px;"
  );
  select_elt.setAttribute("class", "inegalite");
  var option_inf = document.createElement("option");
  var option_sup = document.createElement("option");

  option_inf.setAttribute("value", "inf");
  option_sup.setAttribute("value", "sup");

  var option_inf_text = document.createTextNode("≤");
  var option_sup_text = document.createTextNode("≥");

  var icon = document.createElement("i");
  icon.setAttribute("class", "material-icons");
  icon.setAttribute("style", "cursor: pointer;");
  icon.setAttribute("onclick", "removeEquation(this);");
  var icon_txt = document.createTextNode("delete");

  //Building Node Tree
  option_inf.appendChild(option_inf_text);
  option_sup.appendChild(option_sup_text);
  icon.appendChild(icon_txt);
  label_x1.appendChild(label_x1_text);
  label_x2.appendChild(label_x2_text);
  label_eq.appendChild(label_eq_text);
  select_elt.appendChild(option_inf);
  select_elt.appendChild(option_sup);
  root_form.appendChild(input_x1);
  root_form.appendChild(label_x1);
  root_form.appendChild(input_x2);
  root_form.appendChild(label_x2);
  root_form.appendChild(select_elt);
  root_form.appendChild(input_y);
  root_form.appendChild(label_eq);
  root_form.appendChild(icon);
  eqContainer.appendChild(root_form);
}

function animateSolution(limiterIndex, newCoordinates) {
  var xNew = [newCoordinates[0][0], newCoordinates[1][0]];
  var yNew = [newCoordinates[0][1], newCoordinates[1][1]];
  Plotly.animate(
    "drawArea",
    {
      data: [{y: yNew, x: xNew}],
      traces: [limiterIndex],
      layout: {},
    },
    {
      transition: {
        duration: 1000,
        easing: "cubic-in-out",
      },
      frame: {
        duration: 1000,
      },
    }
  );
}

function compareSolutions(s1, s2) {
  if (s1.length != s2.length) {
    return false;
  }
  for (var i = 0; i < s1.length; i++) {
    if (s1[i][0] != s2[i][0] || s1[i][1] != s2[i][1]) {
      return false;
    }
  }
  return true;
}

function displaySolution(intersections, solutionIndex) {
  var text =
    "Solution=(" +
    intersections[solutionIndex][0] +
    " ; " +
    intersections[solutionIndex][1] +
    ")";
  var limiterElems = document.getElementsByClassName("op_coefficients");
  var a = parseFloat(limiterElems[0].value);
  var b = parseFloat(limiterElems[1].value);
  var z =
    intersections[solutionIndex][0] * a + intersections[solutionIndex][1] * b;
  z = round100(z);
  var textZ = "Z=" + z;
  var layout = {
    annotations: [
      {
        x: intersections[solutionIndex][0],
        y: intersections[solutionIndex][1],
        xref: "x",
        yref: "y",
        text: text,
        showarrow: true,
        font: {
          family: "Arial, Courier New, monospace",
          size: 13,
          color: "#ffffff",
        },
        align: "center",
        arrowhead: 2,
        arrowsize: 1,
        arrowwidth: 2,
        arrowcolor: "#000066",
        ax: 20,
        ay: -30,
        bordercolor: "#145650",
        borderwidth: 2,
        borderpad: 4,
        bgcolor: "#145650",
        opacity: 0.8,
      },
      {
        xref: "paper",
        yref: "paper",
        x: 0,
        xanchor: "right",
        y: 1,
        yanchor: "bottom",
        text: "X2",
        showarrow: false,
      },
      {
        xref: "paper",
        yref: "paper",
        x: 1,
        xanchor: "left",
        y: 0,
        yanchor: "top",
        text: "X1",
        showarrow: false,
      },
      {
        xref: "paper",
        yref: "paper",
        x: 0.5,
        xanchor: "left",
        y: 0,
        yanchor: "top",
        text: textZ,
        showarrow: false,
        font: {
          family: "Arial, Courier New, monospace",
          size: 16,
          color: "#ffffff",
        },
        align: "center",
        bordercolor: "#c7c7c7",
        borderwidth: 2,
        borderpad: 4,
        bgcolor: "#145650",
        opacity: 0.9,
      },
    ],
  };
  setTimeout(function () {
    Plotly.update("drawArea", {}, layout);
  }, 1000);
}

function displaySolutionInfinite() {
  var text = "Infinité de Solutions";
  var layout = {
    annotations: [
      {
        x: 0.5,
        y: 0.5,
        xref: "paper",
        yref: "paper",
        text: text,
        showarrow: false,
        font: {
          family: "Arial, Courier New, monospace",
          size: 14,
          color: "#ffffff",
        },
        align: "center",
        bordercolor: "#9b0000",
        borderwidth: 2,
        borderpad: 4,
        bgcolor: "#d50000",
        opacity: 0.9,
      },
      {
        xref: "paper",
        yref: "paper",
        x: 0,
        xanchor: "right",
        y: 1,
        yanchor: "bottom",
        text: "X2",
        showarrow: false,
      },
      {
        xref: "paper",
        yref: "paper",
        x: 1,
        xanchor: "left",
        y: 0,
        yanchor: "top",
        text: "X1",
        showarrow: false,
      },
    ],
  };
  Plotly.update("drawArea", {}, layout);
}

function displaySolutionNone() {
  $("#alert_text").html("<strong>Pas de Solution</strong><br><br>");
  $("#popup_container").show();
  $("#result_container").hide();
  $("#main_title").show();
}

function filterIntersectionPts(dataMatrix, interPts, operations) {
  var intersections = interPts;
  var filteredInterPts = [];
  var ops = operations; // [min/max,inf_Eg/sup_Eg,inf_eg/sup_Eg]
  var i;
  var keepInterPt = true;
  for (i = 0; i < intersections.length; i++) {
    for (var j = 0; j < dataMatrix.length; j++) {
      var res =
        dataMatrix[j][0] * intersections[i][0] +
        dataMatrix[j][1] * intersections[i][1]; // Getting Y value
      res = round(res);
      switch (ops[j + 1]) {
        case "inf_Eg":
          if (res > dataMatrix[j][2]) {
            //Negation
            keepInterPt = false;
          }
          if (dataMatrix[j][0] === 0) {
            //For Horizontal Line
            var temp = dataMatrix[j][2] / dataMatrix[j][1];
            if (intersections[i][1] > temp) {
              keepInterPt = false;
            }
          }
          if (dataMatrix[j][1] === 0) {
            //For Vertical Line
            var temp = dataMatrix[j][2] / dataMatrix[j][0];
            if (intersections[i][0] > temp) {
              keepInterPt = false;
            }
          }
          break;
        case "sup_Eg":
          if (res < dataMatrix[j][2]) {
            //Negation
            keepInterPt = false;
          }
          if (dataMatrix[j][0] === 0) {
            //For Horizontal Line
            var temp = dataMatrix[j][2] / dataMatrix[j][1];
            if (intersections[i][1] < temp) {
              keepInterPt = false;
            }
          }
          if (dataMatrix[j][1] === 0) {
            //For Vertical Line
            var temp = dataMatrix[j][2] / dataMatrix[j][0];
            if (intersections[i][0] < temp) {
              keepInterPt = false;
            }
          }
          break;
        default:
          break;
      }
    }
    if (keepInterPt) {
      filteredInterPts.push(intersections[i]);
    }
    keepInterPt = true;
  }
  return filteredInterPts;
}

function findX2(dataMatrix, index, x1) {
  return (
    (dataMatrix[index][2] - dataMatrix[index][0] * x1) / dataMatrix[index][1]
  );
}

function getAllValues() {
  var inputFields = document.getElementsByClassName("coefficients");
  var matrix = [];
  var subArray = [];
  var i = 0;
  while (i < inputFields.length) {
    if ((i + 1) % 3 === 0) {
      subArray.push(parseFloat(inputFields[i].value));
      matrix.push(subArray);
      subArray = new Array();
      i++;
      continue;
    }
    subArray.push(parseFloat(inputFields[i].value));
    i++;
  }
  return matrix;
}

function getAxisLimits(intersectionPts, margin) {
  //Return [X1max, X2max, X1min, X2min]
  var max_x = intersectionPts[0][0];
  var max_y = intersectionPts[0][1];
  var min_x = intersectionPts[0][0];
  var min_y = intersectionPts[0][1];
  var i;
  var max = 0;
  for (i = 0; i < intersectionPts.length; i++) {
    if (intersectionPts[i][0] > max_x) {
      max_x = intersectionPts[i][0];
    }
    if (intersectionPts[i][1] > max_y) {
      max_y = intersectionPts[i][1];
    }
    if (intersectionPts[i][0] < min_x) {
      min_x = intersectionPts[i][0];
    }
    if (intersectionPts[i][1] < min_y) {
      min_y = intersectionPts[i][1];
    }
  }
  var all = [max_x, max_y, min_x, min_y];
  for (i = 0; i < 4; i++) {
    if (all[i] > max) {
      max = all[i];
    }
  }
  max_x += (max * margin) / 100;
  max_y += (max * margin) / 100;
  min_x -= (max * margin) / 100;
  min_y -= (max * margin) / 100;
  return [max_x, max_y, min_x, min_y];
}

function getIntersectionPts(dataMatrix) {
  var newDataMatrix = [];
  var intersections = [];
  var allX2ForX1MinMax = []; // Matrix for Couple(x2=f(x1 Min), x2=f(x1 Max))
  var x2ForX1MinMax = [];
  var horizontalEquations = []; // fixed X2 values for Horizontal Line Equations
  var verticalEquations = []; // fixed X1 values for Vertical Line Equations
  var splicedIndex = []; //Indexes to splice
  var temp = [];
  var x1Min = -20;
  var x1Max = 20;
  var i;
  var x1 = 0;
  var x2 = 0;
  var nbCouples = 0;
  var duplicate = false; //Check if there is some duplicated Intersection Point
  //Get all Vertical&Horizontal Line Equations
  //Create newDataMatrix without Vertical&Horizontal Line Equations
  for (var i = 0; i < dataMatrix.length; i++) {
    if (dataMatrix[i][0] === 0) {
      var fixedX2 = dataMatrix[i][2] / dataMatrix[i][1];
      horizontalEquations.push(fixedX2);
      continue;
    }
    if (dataMatrix[i][1] === 0) {
      var fixedX1 = dataMatrix[i][2] / dataMatrix[i][0];
      verticalEquations.push(fixedX1);
      continue;
    }
    newDataMatrix.push(dataMatrix[i]);
  }
  for (
    i = 0;
    i < newDataMatrix.length;
    i++ //Find each X2 for X1(min,max)
  ) {
    x2 = findX2(newDataMatrix, i, x1Min);
    x2ForX1MinMax.push(x2); //X1 MIN
    x2 = findX2(newDataMatrix, i, x1Max);
    x2ForX1MinMax.push(x2); //X1 MAX
    allX2ForX1MinMax.push(x2ForX1MinMax); //Save Couple(Min,Max)
    x2ForX1MinMax = [];
  }
  nbCouples = allX2ForX1MinMax.length;
  //ADD ORIGIN
  intersections.push([0, 0]);
  //Permutation 2 couples
  for (i = 0; i < nbCouples; i++) {
    var j;
    for (
      j = i + 1;
      j < nbCouples;
      j++ // Getting possible Couples ([i][j])
    ) {
      // INTERSECTIONS FOR POSSIBLE COUPLE COMBINATIONS
      temp = math.intersect(
        [x1Min, allX2ForX1MinMax[i][0]],
        [x1Max, allX2ForX1MinMax[i][1]],
        [x1Min, allX2ForX1MinMax[j][0]],
        [x1Max, allX2ForX1MinMax[j][1]]
      );
      if (temp != null) {
        temp[0] = Math.round(temp[0] * 100) / 100;
        temp[1] = Math.round(temp[1] * 100) / 100;
        intersections.push(temp);
      }
    }
  }
  for (i = 0; i < nbCouples; i++) {
    // INTERSECTION WITH X1 AXIS
    temp = math.intersect(
      [x1Min, allX2ForX1MinMax[i][0]],
      [x1Max, allX2ForX1MinMax[i][1]],
      [x1Min, 0],
      [x1Max, 0]
    );
    if (temp != null) {
      temp[0] = Math.round(temp[0] * 100) / 100;
      temp[1] = Math.round(temp[1] * 100) / 100;
      intersections.push(temp);
    }

    // INTERSECTION WITH X2 AXIS
    temp = math.intersect(
      [x1Min, allX2ForX1MinMax[i][0]],
      [x1Max, allX2ForX1MinMax[i][1]],
      [0, allX2ForX1MinMax[i][0]],
      [0, allX2ForX1MinMax[i][1]]
    );
    if (temp != null) {
      temp[0] = Math.round(temp[0] * 100) / 100;
      temp[1] = Math.round(temp[1] * 100) / 100;
      intersections.push(temp);
    }
  }
  //Horizontal & Vertical Lines Processing
  //Horizontal
  for (i = 0; i < horizontalEquations.length; i++) {
    for (var j = 0; j < nbCouples; j++) {
      temp = math.intersect(
        [x1Min, horizontalEquations[i]],
        [x1Max, horizontalEquations[i]],
        [x1Min, allX2ForX1MinMax[j][0]],
        [x1Max, allX2ForX1MinMax[j][1]]
      );
      if (temp != null) {
        temp[0] = Math.round(temp[0] * 100) / 100;
        temp[1] = Math.round(temp[1] * 100) / 100;
        intersections.push(temp);
      }
    }
    //Intersection with X2 axis
    intersections.push([0, horizontalEquations[i]]);
    //Intersection with Vertical axis
    if (verticalEquations.length > 0) {
      duplicate = true;
    }
    for (var j = 0; j < verticalEquations.length; j++) {
      intersections.push([verticalEquations[j], horizontalEquations[i]]);
    }
  }
  //Vertical
  for (i = 0; i < verticalEquations.length; i++) {
    for (var j = 0; j < nbCouples; j++) {
      temp = math.intersect(
        [verticalEquations[i], -20],
        [verticalEquations[i], 20],
        [x1Min, allX2ForX1MinMax[j][0]],
        [x1Max, allX2ForX1MinMax[j][1]]
      );
      if (temp != null) {
        temp[0] = Math.round(temp[0] * 100) / 100;
        temp[1] = Math.round(temp[1] * 100) / 100;
        intersections.push(temp);
      }
    }
    //intersection with X1 axis
    intersections.push([verticalEquations[i], 0]);
    //Intersection with Horizontal Axis
    if (!duplicate) {
      //Si les intersections n'ont pas encore été définies dans la boucle des axes horizontales
      for (var j = 0; j < horizontalEquations.length; j++) {
        intersections.push([verticalEquations[i], horizontalEquations[j]]);
      }
    }
  }
  return intersections;
}

function getIntersectionPtsLimits(dataMatrix, axisLimits) {
  // Intersections With Axis Limits
  var intersections = [];
  var newDataMatrix = [];
  var horizontalEquations = [];
  var verticalEquations = [];
  var x2ForX1MinMax = [];
  var allX2ForX1MinMax = []; // Matrix for Couple(x2=f(x1 Min), x2=f(x1 Max))
  var axisLimitLines = [];
  var x2 = 0;
  var nbCouples = 0;
  var x1Min = -20;
  var x1Max = 20;
  //Getting all axis limit lines
  axisLimitLines.push([axisLimits[2], axisLimits[1]]); //NO Corner
  axisLimitLines.push([axisLimits[0], axisLimits[1]]); //NE Corner
  axisLimitLines.push([axisLimits[0], axisLimits[3]]); //SE Corner
  axisLimitLines.push([axisLimits[2], axisLimits[3]]); //SO Corner
  axisLimitLines.push([axisLimits[2], axisLimits[1]]); //NO Corner
  //Adding all Corners
  for (var i = 0; i < 4; i++) {
    intersections.push(axisLimitLines[i]);
  }
  //Adding intersections with X1 & X2 axis
  intersections.push([0, axisLimits[1]]); // North
  intersections.push([axisLimits[0], 0]); // Est
  intersections.push([0, axisLimits[3]]); // South
  intersections.push([axisLimits[2], 0]); // West
  //Create newDataMatrix without Vertical&Horizontal Line Equations
  for (var i = 0; i < dataMatrix.length; i++) {
    if (dataMatrix[i][0] === 0) {
      var fixedX2 = dataMatrix[i][2] / dataMatrix[i][1];
      horizontalEquations.push(fixedX2);
      continue;
    }
    if (dataMatrix[i][1] === 0) {
      var fixedX1 = dataMatrix[i][2] / dataMatrix[i][0];
      verticalEquations.push(fixedX1);
      continue;
    }
    newDataMatrix.push(dataMatrix[i]);
  }
  for (
    i = 0;
    i < newDataMatrix.length;
    i++ //Find each X2 for X1(min,max)
  ) {
    x2 = findX2(newDataMatrix, i, x1Min);
    x2ForX1MinMax.push(x2); //X1 MIN
    x2 = findX2(newDataMatrix, i, x1Max);
    x2ForX1MinMax.push(x2); //X1 MAX
    allX2ForX1MinMax.push(x2ForX1MinMax); //Save Couple(Min,Max)
    x2ForX1MinMax = [];
  }
  nbCouples = allX2ForX1MinMax.length;

  for (var i = 0; i < nbCouples; i++) {
    var len = axisLimitLines.length - 1;
    for (
      var j = 0;
      j < len;
      j++ // Getting possible Couples ([i][j])
    ) {
      // INTERSECTIONS FOR COUPLES WITH AXIS LIMITS (CLOCKWISE)
      temp = math.intersect(
        [x1Min, allX2ForX1MinMax[i][0]],
        [x1Max, allX2ForX1MinMax[i][1]],
        axisLimitLines[j],
        axisLimitLines[j + 1]
      );
      if (temp != null) {
        temp[0] = Math.round(temp[0] * 100) / 100;
        temp[1] = Math.round(temp[1] * 100) / 100;
        intersections.push(temp);
      }
    }
  }
  for (var i = 0; i < verticalEquations.length; i++) {
    var len = axisLimitLines.length - 1;
    for (var j = 0; j < len; j++) {
      temp = math.intersect(
        [verticalEquations[i], -20],
        [verticalEquations[i], 20],
        axisLimitLines[j],
        axisLimitLines[j + 1]
      );
      if (temp != null) {
        temp[0] = Math.round(temp[0] * 100) / 100;
        temp[1] = Math.round(temp[1] * 100) / 100;
        intersections.push(temp);
      }
    }
  }
  for (var i = 0; i < horizontalEquations.length; i++) {
    var len = axisLimitLines.length - 1;
    for (var j = 0; j < len; j++) {
      temp = math.intersect(
        [x1Min, horizontalEquations[i]],
        [x1Max, horizontalEquations[i]],
        axisLimitLines[j],
        axisLimitLines[j + 1]
      );
      if (temp != null) {
        temp[0] = Math.round(temp[0] * 100) / 100;
        temp[1] = Math.round(temp[1] * 100) / 100;
        intersections.push(temp);
      }
    }
  }
  return intersections;
}

function getIntersectionPtsPositive(intersectionPts) {
  var intersectionPts = intersectionPts;
  var i;
  var positiveIntersections = [];
  for (i = 0; i < intersectionPts.length; i++) {
    if (intersectionPts[i][0] < 0 || intersectionPts[i][1] < 0) {
      continue;
    }
    positiveIntersections.push(intersectionPts[i]);
  }
  return positiveIntersections;
}

function getEndpoints(dataMatrix, axisLimits) {
  // Get Extremités des Droites
  var endpoints = [];
  var couple = [];
  var i;
  var x2;
  var c;
  for (i = 0; i < dataMatrix.length; i++) {
    if (dataMatrix[i][1] == 0) {
      //Vertical (b = 0)
      c = dataMatrix[i][2] / dataMatrix[i][0];
      endpoints.push([c, axisLimits[3]]);

      endpoints.push([c, axisLimits[1]]);
      continue;
    }
    if (dataMatrix[i][0] == 0) {
      //Horizontal (a = 0)
      c = dataMatrix[i][2] / dataMatrix[i][1];
      endpoints.push([axisLimits[3], c]);

      endpoints.push([axisLimits[0], c]);
      continue;
    }
    couple.push(axisLimits[2]); //X1min
    x2 = findX2(dataMatrix, i, axisLimits[2]); //X2min
    couple.push(x2);
    endpoints.push(couple);
    couple = [];

    couple.push(axisLimits[0]); //X1max
    x2 = findX2(dataMatrix, i, axisLimits[0]); //X2max
    couple.push(x2);
    endpoints.push(couple);
    couple = [];
  }
  return endpoints;
}

function getFinalSolutionLineMax(maximizerValues, intersections, axisLimits) {
  //Maximisation
  var solutions = []; //Coordinates of the Final Solution Limiter
  var solutionIndex = 0;
  var temp = 0;
  var couple = [];
  var c = 0; // aX1 + bx2 = c
  var cMax = 0;
  var cMin = 0;
  if (maximizerValues[1] < 0) {
    // Si b < 0 => c = cMin
    cMin =
      maximizerValues[0] * intersections[0][0] +
      maximizerValues[1] * intersections[0][1]; //Init cMin

    for (var i = 0; i < intersections.length; i++) {
      c =
        maximizerValues[0] * intersections[i][0] +
        maximizerValues[1] * intersections[i][1];
      if (c < cMin) {
        // Finding c Max
        cMin = c;
        solutionIndex = i;
      }
    }
    temp = (cMin - maximizerValues[0] * axisLimits[2]) / maximizerValues[1]; // X2 = f(X1min);
    solutions.push([axisLimits[2], temp, solutionIndex]);
    temp = (cMin - maximizerValues[0] * axisLimits[0]) / maximizerValues[1]; // X2 = f(X1max);
    solutions.push([axisLimits[0], temp, solutionIndex]);
    return solutions;
  }
  for (
    var i = 0;
    i < intersections.length;
    i++ // Si b > 0 => cMax
  ) {
    c =
      maximizerValues[0] * intersections[i][0] +
      maximizerValues[1] * intersections[i][1];
    if (c > cMax) {
      // Finding c Max
      cMax = c;
      solutionIndex = i;
    }
  }
  temp = (cMax - maximizerValues[0] * axisLimits[2]) / maximizerValues[1]; // X2 = f(X1min);
  solutions.push([axisLimits[2], temp, solutionIndex]);
  temp = (cMax - maximizerValues[0] * axisLimits[0]) / maximizerValues[1]; // X2 = f(X1max);
  solutions.push([axisLimits[0], temp, solutionIndex]);
  return solutions;
}

function getFinalSolutionLineMin(maximizerValues, intersections, axisLimits) {
  //Minimisation
  var solutions = []; //Coordinates of the Final Solution Limiter
  var solutionIndex = 0;
  var temp = 0;
  var couple = [];
  var c = 0; // aX1 + bx2 = c
  var cMax = 0;
  var cMin = 0;
  if (maximizerValues[1] > 0) {
    // Si b > 0 => c = cMin
    cMin =
      maximizerValues[0] * intersections[0][0] +
      maximizerValues[1] * intersections[0][1]; //Init cMin

    for (var i = 0; i < intersections.length; i++) {
      c =
        maximizerValues[0] * intersections[i][0] +
        maximizerValues[1] * intersections[i][1];
      if (c < cMin) {
        // Finding c Max
        cMin = c;
        solutionIndex = i;
      }
    }
    temp = (cMin - maximizerValues[0] * axisLimits[2]) / maximizerValues[1]; // X2 = f(X1min);
    solutions.push([axisLimits[2], temp, solutionIndex]);
    temp = (cMin - maximizerValues[0] * axisLimits[0]) / maximizerValues[1]; // X2 = f(X1max);
    solutions.push([axisLimits[0], temp, solutionIndex]);
    return solutions;
  }
  for (
    var i = 0;
    i < intersections.length;
    i++ // Si b < 0 => cMax
  ) {
    c =
      maximizerValues[0] * intersections[i][0] +
      maximizerValues[1] * intersections[i][1];
    if (c > cMax) {
      // Finding c Max
      cMax = c;
      solutionIndex = i;
    }
  }
  temp = (cMax - maximizerValues[0] * axisLimits[2]) / maximizerValues[1]; // X2 = f(X1min);
  solutions.push([axisLimits[2], temp, solutionIndex]);
  temp = (cMax - maximizerValues[0] * axisLimits[0]) / maximizerValues[1]; // X2 = f(X1max);
  solutions.push([axisLimits[0], temp, solutionIndex]);
  return solutions;
}

function getMaximizerValues() {
  //Maximisation
  var values = [];
  var inputs = document.getElementsByClassName("op_coefficients");
  var i;
  for (i = 0; i < inputs.length; i++) {
    values.push(parseFloat(inputs[i].value));
  }
  return values;
}

function getMaximizerPlotData(axisLimits, maximizerValues) {
  //Maximisation Initial Maximizer Line Position
  //X2 = (-a*X1/b)
  var x2ForX1Min = (-maximizerValues[0] * axisLimits[2]) / maximizerValues[1];
  var x2ForX1Max = (-maximizerValues[0] * axisLimits[0]) / maximizerValues[1];
  var trace = {
    x: [axisLimits[2], axisLimits[0]],
    y: [x2ForX1Min, x2ForX1Max],
    name: "Isomarge (max)",
    mode: "lines",
    type: "scatter",
  };
  return trace;
}

function getMinimizerPlotData(axisLimits, maximizerValues) {
  //Minimisation Initial Minimizer Line Position
  var c;
  var signe = maximizerValues[0] * maximizerValues[1];
  var x2ForX1Max;
  var x2ForX1Min;
  if (signe > 0) {
    // Line start in the NE Corner
    c =
      maximizerValues[0] * (axisLimits[0] - (axisLimits[0] * 10) / 100) +
      maximizerValues[1] * (axisLimits[1] - (axisLimits[1] * 10) / 100); // Limits - 10% margin (c=aX1 + aX2)
    //X2 = (c-a*X1/b)
    x2ForX1Min = (c - maximizerValues[0] * axisLimits[2]) / maximizerValues[1];
    x2ForX1Max = (c - maximizerValues[0] * axisLimits[0]) / maximizerValues[1];
    var trace = {
      x: [axisLimits[2], axisLimits[0]],
      y: [x2ForX1Min, x2ForX1Max],
      name: "Isomarge (min)",
      mode: "lines",
      type: "scatter",
    };
    return trace;
  }
  // Line start in NO Corner
  c =
    maximizerValues[0] * (axisLimits[2] - (axisLimits[2] * 10) / 100) +
    maximizerValues[1] * (axisLimits[1] - (axisLimits[1] * 10) / 100); // Limits - 10% margin (c=aX1 + aX2)
  //X2 = (c-a*X1/b)
  x2ForX1Min = (c - maximizerValues[0] * axisLimits[2]) / maximizerValues[1];
  x2ForX1Max = (c - maximizerValues[0] * axisLimits[0]) / maximizerValues[1];
  var trace = {
    x: [axisLimits[2], axisLimits[0]],
    y: [x2ForX1Min, x2ForX1Max],
    name: "Minimisation",
    mode: "lines",
    type: "scatter",
  };
  return trace;
}

function getOperations() {
  var operationType = document.getElementById("operation").value;
  var result = new Array();
  result.push(operationType);

  var inegalites = document.getElementsByClassName("inegalite");
  for (var i = 0; i < inegalites.length; i++) {
    if (inegalites[i].value === "inf") {
      result.push("inf_Eg");
    } else {
      result.push("sup_Eg");
    }
  }
  return result;
}

function getPlotData(endpoints, intersections) {
  var i = 0;
  var j = 0;
  var data = [];
  var trace;
  var traceName = "";
  if (endpoints.length > 1) {
    while (i < endpoints.length) {
      tracename = "Contrainte (" + j + ")";
      trace = {
        x: [endpoints[i][0], endpoints[i + 1][0]],
        y: [endpoints[i][1], endpoints[i + 1][1]],
        name: tracename,
        mode: "lines",
        type: "scatter",
      };
      data.push(trace);
      i += 2;
      j++;
    }

    // For intersection points Markers
    i = 0;
    trace = {
      x: [],
      y: [],
      name: "Intersections",
      mode: "markers",
      type: "scatter",
    };
    while (i < intersections.length) {
      trace.x.push(intersections[i][0]);
      trace.y.push(intersections[i][1]);
      i++;
    }
    data.push(trace);
  }
  return data;
}

function getPolygonPath(intersectionPts) {
  var pathString = "M ";
  var pathArray = [];
  var fullPathArray = [];
  var temp = [];
  var i = 0;
  var j = 1;
  var nbInterPts = intersectionPts.length;
  var endChar;
  intersectionPts.sort(sortNumberASC);
  pathArray.push(intersectionPts[0]);
  while (i < nbInterPts) {
    if (j < nbInterPts) {
      if (intersectionPts[i][1] <= intersectionPts[j][1]) {
        if (!isNaN(intersectionPts[j][0]) || !isNaN(intersectionPts[j][1])) {
          // To avoid NaN Coordinates
          pathArray.push(intersectionPts[j]); //Path Aller
        }
        i = j;
        j++;
        continue;
      }
      if (intersectionPts[i][1] > intersectionPts[j][1]) {
        if (!isNaN(intersectionPts[j][0]) || !isNaN(intersectionPts[j][1])) {
          // To avoid NaN Coordinates
          if (j + 2 >= nbInterPts) {
            //Lorsqu'on est arrivé à l'extremité droite de la figure
            pathArray.push(intersectionPts[j]);
          } else {
            temp.push(intersectionPts[j]); //Save for later use (Path retour)
          }
        }
        i = j;
        j++;
        continue;
      }
    }
    break;
  }
  temp.sort(sortNumberDESC);
  fullPathArray = pathArray.concat(temp);

  for (i = 0; i < fullPathArray.length; i++) {
    if (i === fullPathArray.length - 1) {
      endChar = "Z";
    } else {
      endChar = "L ";
    }
    pathString =
      pathString +
      "" +
      fullPathArray[i][0] +
      " " +
      fullPathArray[i][1] +
      " " +
      endChar;
  }
  return pathString;
}

function removeEquation(elem) {
  var i = 0;
  var numChildren = elem.parentNode.parentNode.children.length;
  while (i < numChildren) {
    if (elem.parentNode === elem.parentNode.parentNode.children[i]) {
      elem.parentNode.parentNode.removeChild(
        elem.parentNode.parentNode.children[i]
      );
      break;
    }
    i++;
  }
}

function removeDuplicate(arr) {
  var final_arr = [];
  var ignored = [];
  for (var i = 0; i < arr.length; i++) {
    if (ignored.indexOf(i) != -1) {
      continue;
    }
    for (var j = 0; j < arr.length; j++) {
      if (ignored.indexOf(j) != -1) {
        continue;
      }
      if (j != i) {
        if (arr[i][1] === arr[j][1] && arr[i][0] === arr[j][0]) {
          // Array i == Array j
          ignored.push(j);
        }
      }
    }
    if (ignored.indexOf(i) === -1) {
      final_arr.push(arr[i]);
    }
  }
  return final_arr;
}

function resolve(zoom) {
  // Zoom 0 to 100%
  var mode = document.getElementById("operation").value;
  var verified = verifyInputs();
  var axisMargin = 100 - zoom;
  if (verified) {
    var matrix = getAllValues();
    var operations = getOperations();
    var intersections = getIntersectionPts(matrix);

    console.log("ALL INTERSECTIONS");
    console.log(intersections);

    intersections = getIntersectionPtsPositive(intersections);

    console.log("POSITIVE INTERSECTIONS");
    console.log(intersections);

    var filteredInterPts = filterIntersectionPts(
      matrix,
      intersections,
      operations
    );

    if (filteredInterPts.length === 0) {
      // PAS de Solutions
      displaySolutionNone();
      return -1;
    }

    console.log("FILTERED INTERSECTIONS");
    console.log(filteredInterPts);

    var axisLimits = getAxisLimits(filteredInterPts, axisMargin);

    console.log("LIMITS OF AXIS");
    console.log(axisLimits); //[maxX,maxY,minX,minY]

    var intersections_2 = getIntersectionPtsLimits(matrix, axisLimits); //Intersections w/ axislimits
    var all_intersections = intersections.concat(intersections_2);
    all_intersections = filterIntersectionPts(
      matrix,
      all_intersections,
      operations
    );
    all_intersections = removeDuplicate(all_intersections);
    all_intersections = getIntersectionPtsPositive(all_intersections);

    console.log("ALL INTERSECTIONS (FILTERED)");
    console.log(all_intersections);

    var endpoints = getEndpoints(matrix, axisLimits);

    console.log("LINES ENDPOINTS");
    console.log(endpoints);

    var plotData = getPlotData(endpoints, all_intersections);

    console.log("PLOTDATA");
    console.log(plotData);

    var maximizerValues = getMaximizerValues();

    console.log("MAXIMIZER/MINIMIZER VALUES");
    console.log(maximizerValues);

    var pathString = getPolygonPath(all_intersections);

    console.log("PATH STRING");
    console.log(pathString);

    var limiterPlotData;
    var solutionLine;
    var solutionLineAll; //SolutionLine including Intersections w/ axisLimits
    var isUniqueSolution;

    if (mode === "max") {
      limiterPlotData = getMaximizerPlotData(axisLimits, maximizerValues);
      console.log("LIMITER PLOT DATA (MAX)");
      console.log(limiterPlotData);
      solutionLine = getFinalSolutionLineMax(
        maximizerValues,
        filteredInterPts,
        axisLimits
      );
      solutionLineAll = getFinalSolutionLineMax(
        maximizerValues,
        all_intersections,
        axisLimits
      );
      isUniqueSolution = compareSolutions(solutionLine, solutionLineAll);
      console.log("SOLUTION");
      console.log(solutionLine);
      console.log("SOLUTION (INCL AXISLimits INT)");
      console.log(solutionLineAll);
      console.log("UNIQUE SOLUTION ?");
      console.log(isUniqueSolution);
    }
    if (mode === "min") {
      limiterPlotData = getMinimizerPlotData(axisLimits, maximizerValues);
      console.log("LIMITER PLOT DATA (MIN)");
      console.log(limiterPlotData);
      solutionLine = getFinalSolutionLineMin(
        maximizerValues,
        filteredInterPts,
        axisLimits
      );
      solutionLineAll = getFinalSolutionLineMin(
        maximizerValues,
        all_intersections,
        axisLimits
      );
      isUniqueSolution = compareSolutions(solutionLine, solutionLineAll);
      console.log("SOLUTION");
      console.log(solutionLine);
      console.log("SOLUTION (INCL AXISLimits INT)");
      console.log(solutionLineAll);
      console.log("UNIQUE SOLUTION ?");
      console.log(isUniqueSolution);
    }

    plotData.push(limiterPlotData);
    var layout = {
      title: "Résolution Graphique",
      showlegend: true,
      xaxis: {
        range: [axisLimits[2], axisLimits[0]],
        showgrid: true,
        zeroline: true,
        fixedrange: true,
      },
      yaxis: {
        range: [axisLimits[3], axisLimits[1]],
        showgrid: true,
        zeroline: true,
        fixedrange: true,
      },
      shapes: [
        {
          type: "path",
          path: pathString,
          fillcolor: "rgba(44, 160, 101, 0.5)",
          line: {
            color: "rgba(44, 160, 101, 0.5)",
          },
        },
      ],
      annotations: [
        {
          xref: "paper",
          yref: "paper",
          x: 0,
          xanchor: "right",
          y: 1,
          yanchor: "bottom",
          text: "X2",
          showarrow: false,
        },
        {
          xref: "paper",
          yref: "paper",
          x: 1,
          xanchor: "left",
          y: 0,
          yanchor: "top",
          text: "X1",
          showarrow: false,
        },
      ],
    };

    Plotly.newPlot("drawArea", plotData, layout, {
      scrollZoom: false,
      displayModeBar: false,
      locale: "fr",
    });
    if (isUniqueSolution) {
      animateSolution(plotData.length - 1, solutionLine);
      displaySolution(filteredInterPts, solutionLine[0][2]); // SolutionLine[0][2] ==> solutionIndex;
      return 0;
    }
    displaySolutionInfinite();
    return 1;
  }
}

function round(nb) {
  var precision = 10;
  var number = Math.round(nb * precision);
  var numberString = number.toString();
  var lastNb = parseInt(numberString[numberString.length - 1]);
  if (lastNb > 5) {
    number += 1;
  }
  return number / precision;
}

function round100(nb) {
  var precision = 1000;
  var number = Math.round(nb * precision);
  var numberString = number.toString();
  var lastNb = parseInt(numberString[numberString.length - 1]);
  if (lastNb > 5) {
    number += 1;
  }
  return number / precision;
}

function sortNumberASC(a, b) {
  //Read Array.sort() method documentation
  if (a[0] === b[0]) {
    return 0;
  } else {
    return a[0] < b[0] ? -1 : 1; //Invert inequality for DESC Order
  }
}

function sortNumberDESC(a, b) {
  if (a[0] === b[0]) {
    return 0;
  } else {
    return a[0] > b[0] ? -1 : 1;
  }
}

function sortNumberDESC_Y(a, b) {
  if (a[1] === b[1]) {
    return 0;
  } else {
    return a[1] > b[1] ? -1 : 1;
  }
}

function verifyInputs() {
  var fields = document.getElementsByClassName("coefficients");
  var limiterFields = document.getElementsByClassName("op_coefficients");
  var emptyFields = [];
  var limiterEmptyFields = [];
  for (var i = 0; i < fields.length; i++) {
    if (fields[i].value == "") {
      emptyFields.push(i);
      fields[i].setAttribute("style", "width:20%; border: 1px solid red");
      continue;
    }
    fields[i].setAttribute("style", "width:20%");
  }
  for (var i = 0; i < limiterFields.length; i++) {
    if (limiterFields[i].value == "") {
      limiterEmptyFields.push(i);
      limiterFields[i].setAttribute(
        "style",
        "width:20%; border: 1px solid red"
      );
      continue;
    }
    limiterFields[i].setAttribute("style", "width:20%");
  }
  if (emptyFields.length > 0 || limiterEmptyFields > 0) {
    $("#alert_text").html(
      "<strong>Veuillez remplir les champs vides</strong><br><br>"
    );
    $("#popup_container").show();
    return false;
  }
  return true;
}

function verifyInputsRealtime(element) {
  if (element.value != "") {
    element.setAttribute("style", "width:20%;");
  } else {
    element.setAttribute("style", "width:20%; border: 1px solid red");
  }
}

$(document).ready(function () {
  $("#btn_close_alert").click(function () {
    $("#popup_container").hide();
  });
  $("#resolve_btn").click(function () {
    $("#drawArea").show();
    $("#result_container").show();
    $("#main_title").hide();
    $("#zoom_container").show();
    var zoom = parseInt($("#zoom_value").text());
    resolve(zoom);
  });
  $("#zoom_plus").click(function () {
    var zoom = parseInt($("#zoom_value").text());
    if (zoom < 100) {
      zoom += 5;
      $("#zoom_value").text("" + zoom + "");
      resolve(zoom);
    }
  });
  $("#zoom_moins").click(function () {
    var zoom = parseInt($("#zoom_value").text());
    if (zoom > 0) {
      zoom -= 5;
      $("#zoom_value").text("" + zoom + "");
      resolve(zoom);
    }
  });
});
