var colors = ["#c42b3c", "#381f22", "#2f70d8", "#e88020", "#95a7c4", "#c1838a"];

var border = "#e5dadb";

var transitionDuration = 0;

function setDuration(duration) {
  transitionDuration = duration;
}

function Hours(col = 0, ind = [-1]) {
  d3.select("#chart1Header").html("Hour Crime Occurred");

  d3.csv("Hours.csv", function(error, data) {
    if (error) {
      console.log(error);
    }

    var margin = { top: 0, right: 10, bottom: 15, left: 10 },
      parentwidth = parseInt(d3.select("#chart1td").style("width"), 10),
      width = parentwidth - margin.right - margin.left,
      height = 500;

    console.log(width);

    data.forEach(function(d) {
      d.Hour = +d.Hour;
      d.Count = +d.Count;
    });

    var maxCount = d3.max(data, function(d) {
      return d.Count;
    });

    var records = data.length;

    var canvas = d3
      .select("body")
      .select("#Hours")
      .attr("width", parentwidth)
      .attr("height", height);

    data.sort(function(x, y) {
      return d3.ascending(x.Hour, y.Hour);
    });

    var text = canvas.selectAll("text").data(data);

    text
      .enter()
      .append("text")
      .merge(text)
      .attr("fill", "black")
      .attr("x", function(d, i) {
        return margin.left + (i * width) / records + width / (2 * records);
      })
      .attr("width", width / (records + 3))
      .attr("y", height * 0.98)
      .style("text-anchor", "middle")
      .text(function(d) {
        return d.Hour;
      })
      .style("font-family", "monospace")
      .style("font-size", "1em")
      .attr("class", "HoursChart");
    text.exit().exit();

    var rects = canvas.selectAll(".hoursBars").data(data);

    rects
      .enter()
      .append("rect")
      .merge(rects)
      .on("mouseover", mouseOverHour)
      .on("mouseout", mouseOutHour)
      .on("click", hourClick)
      .transition("HoursTransition")
      .duration(transitionDuration)
      .attr("width", width / (records + 3))
      .attr("height", function(d) {
        return (d.Count / maxCount) * (height - 95);
      })
      .attr("x", function(d, i) {
        return margin.left + (i * width) / records;
      })
      .attr("y", function(d) {
        return height - 35 - (d.Count / maxCount) * (height - 95);
      })
      .attr("fill", function(d, i) {
        if (ind.includes(i)) {
          return colors[0];
        } else {
          return colors[col];
        }
      })
      .attr("class", "hoursBars");
    rects.exit().remove();
  });
}

function mouseOverHour(d, i) {
  if (currentScene === lastScene) {
    if (d.Hour != currentHour) {
      d3.select(this).attr("fill", colors[1]);
    }
  }
}
function mouseOutHour(d, i) {
  if (currentScene === lastScene) {
    if ("None" === currentHour) {
      d3.select(this)
        .attr("fill", colors[0])
        .transition("mouseOutHourTransition");
    }
    if ((currentHour != d.Hour) & ("None" != currentHour)) {
      d3.select(this)
        .attr("fill", colors[5])
        .transition("mouseOutHourTransition");
    }
  }
}

function mouseOverCategory(d, i) {
  if (currentScene === lastScene) {
    if (d.Category != currentCategory) {
      d3.select(this).attr("fill", colors[3]);
    }
  }
}

function mouseOutCategory(d, i) {
  if (currentScene === lastScene) {
      console.log("is last scene");
    if ("None" === currentCategory) {
        console.log("None Selected")
      d3.select(this)
        .attr("fill", colors[2])
        .transition("mouseOutCategoryTransition");
    }
    if ((currentCategory != d.Category) & ("None" != currentCategory)) {
        console.log("something Selected")
      d3.select(this)
        .attr("fill", colors[4])
        .transition("mouseOutCategoryTransition");
    }

  }
}

function categoryClick(d, i) {
  if (currentScene === lastScene) {
    if (d.Category === currentCategory) {
      Categories();
      Hours();
      currentCategory = "None";
      currentHour = "None";
    } else {
      Categories(4, [i]);
      HoursForCategory(d.Category);
      currentCategory = d.Category;
      currentHour = "None";
    }
  }
}

function hourClick(d, i) {
  if (currentScene === lastScene) {
    if (d.Hour === currentHour) {
      Categories();
      Hours();
      currentHour = "None";
      currentCategory = "None";
    } else {
      Hours(5, [i]);
      CategoryForHours(d.Hour);
      currentHour = d.Hour;
      currentCategory = "None";
    }
  }
}

var currentCategory = "None",
  currentHour = "None";

function Categories(col = 2, ind = [-1]) {
  d3.select("#chart2Header")
    .attr("Height", 30)
    .html("Category of Crime");

  d3.csv("Categories.csv", function(error, data) {
    if (error) {
      console.log(error);
    }

    var margin = { top: 20, right: 10, bottom: 30, left: 10 },
      width = parseInt(d3.select("#Category").style("width"), 10),
      width = width - margin.right - margin.left,
      height = 700;

    data.forEach(function(d) {
      d.Category = d.Category;
      d.Count = +d.Count;
    });

    var maxCount = d3.max(data, function(d) {
      return d.Count;
    });

    var canvas = d3
      .select("body")
      .select("#Category")
      .attr("width", width)
      .attr("height", height);

    data.sort(function(x, y) {
      return d3.descending(x.Count, y.Count);
    });

    var text = canvas.selectAll("text").data(data);

    text
      .enter()
      .append("text")
      .merge(text)
      .attr("fill", "black")
      .attr("y", function(d, i) {
        return i * 30 + 15;
      })
      .attr("x", 0)
      .attr("class", "Categories")
      .on("click", categoryClick)
      .text(function(d) {
        return d.Category;
      });
    text.exit().remove();

    var rects = canvas.selectAll("rect").data(data);

    rects
      .enter()
      .append("rect")
      .merge(rects)
      .on("mouseover", mouseOverCategory)
      .on("mouseout", mouseOutCategory)
      .on("click", categoryClick)
      .attr("height", 25)
      .transition("CategoriesTransition")
      .duration(transitionDuration)
      .attr("width", function(d) {
        return (d.Count / maxCount) * (width - 130);
      })
      .attr("y", function(d, i) {
        return i * 30;
      })
      .attr("class", "Categories")
      .attr("x", 130)
      .attr("fill", function(d, i) {
        if (ind.includes(i)) {
          return colors[2];
        } else {
          return colors[col];
        }
      });
    rects.exit().remove();
  });
}

function HoursForCategory(categoryFilter, col = 0) {
  d3.select("#chart1Header").html("Hour Crime Occurred");
  d3.csv("Hours by Crime.csv", function(error, data) {
    if (error) {
      console.log(error);
    }


    var margin = { top: 20, right: 10, bottom: 30, left: 10 },
    parentwidth = parseInt(d3.select("#Hours").style("width"), 10),
      width = parentwidth - margin.right - margin.left,
      height = 500;

    data.forEach(function(d) {
      d.Hour = +d.Hour;
      d.Count = +d.Count;
      d.Category = d.Category;
    });

    data = data.filter((value, index, array) => {
      return value.Category === categoryFilter;
    });

    var maxCount = d3.max(data, function(d) {
      return d.Count;
    });

    var records = data.length;

    var canvas = d3
      .select("body")
      .select("#Hours")
      .attr("width", parentwidth)
      .attr("height", height);

    data.sort(function(x, y) {
      return d3.ascending(x.Hour, y.Hour);
    });

    var text = canvas.selectAll("text").data(data);

    text
      .enter()
      .append("text")
      .merge(text)
      .attr("fill", "black")
      .attr("x", function(d, i) {
        return margin.left + (i * width) / records + width / (2 * records);
      })
      .attr("width", width / (records + 3))
      .attr("y", height * 0.98)
      .style("text-anchor", "middle")
      .text(function(d) {
        return d.Hour;
      })
      .style("font-family", "monospace")
      .style("font-size", "1em")
      .attr("class", "HoursChart");
    text.exit().exit();

    var rects = canvas.selectAll("rect").data(data);

    var rects = canvas.selectAll(".hoursBars").data(data);

    rects
      .enter()
      .append("rect")
      .merge(rects)
      .on("mouseover", mouseOverHour)
      .on("mouseout", mouseOutHour)
      .on("click", hourClick)
      .transition("HoursTransition")
      .duration(transitionDuration)
      .attr("width", width / (records + 3))
      .attr("height", function(d) {
        return (d.Count / maxCount) * (height - 95);
      })
      .attr("x", function(d, i) {
        return margin.left + (i * width) / records;
      })
      .attr("y", function(d) {
        return height - 35 - (d.Count / maxCount) * (height - 95);
      })
      .attr("fill", function(d, i) {
        
          return colors[col];
        
      })
      .attr("class", "hoursBars");
    rects.exit().remove();
  });
}

function CategoryForHours(hourFilter, col = 2) {
  d3.csv("Hours by Crime.csv", function(error, data) {
    if (error) {
      console.log(error);
    }

    var margin = { top: 20, right: 10, bottom: 30, left: 10 },
      width = parseInt(d3.select("#Category").style("width"), 10),
      width = width - margin.right - margin.left,
      height = 700;

    data.forEach(function(d) {
      d.Hour = +d.Hour;
      d.Count = +d.Count;
      d.Category = d.Category;
    });

    data = data.filter((value, index, array) => {
      return value.Hour === hourFilter;
    });

    var maxCount = d3.max(data, function(d) {
      return d.Count;
    });

    var canvas = d3
      .select("body")
      .select("#Category")
      .attr("width", width)
      .attr("height", height);

    data.sort(function(x, y) {
      return d3.descending(x.Count, y.Count);
    });

    var text = canvas.selectAll("text").data(data);

    text
      .enter()
      .append("text")
      .merge(text)
      .attr("fill", "black")
      .attr("y", function(d, i) {
        return i * 30 + 15;
      })
      .on("click", categoryClick)
      .attr("x", 0)
      .text(function(d) {
        return d.Category;
      });
    text.exit().exit();

    var rects = canvas.selectAll("rect").data(data);

    rects
      .enter()
      .append("rect")
      .merge(rects)
      .on("mouseover", mouseOverCategory)
      .on("mouseout", mouseOutCategory)
      .on("click", categoryClick)
      .transition("HoursForCategoryTransition")
      .duration(transitionDuration)
      .attr("height", 25)
      .attr("width", function(d) {
        return (d.Count / maxCount) * (width - 130);
      })
      .attr("y", function(d, i) {
        return i * 30;
      })
      .attr("x", 130)
      .attr("fill", colors[col]);
    rects.exit().remove();
    var text = canvas.selectAll("text").data(data);
  });
}

var currentProgress = 0.0;

var currentScene = -1;

var lastScene = 5;

function advanceScene() {
  
  scenePicker(currentScene + 1);
  progressBar();
}

function reverseScene() {
  scenePicker(currentScene - 1);
  progressBar();
}

function progressBar(percent = currentScene / lastScene) {
  var canvas = d3.select("body").select("#slider");





  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = parseInt(d3.select("#slider").style("width"), 10),
    width = width - margin.right - margin.left,
    height = parseInt(d3.select("#slider").style("height"), 10),
    height = height - margin.top - margin.bottom;

  var data = [width * percent, width * (1 - percent)],
    colors = ["#54e814", "#7f8c7a"];

  var rects = canvas.selectAll("rect").data(data);
  rects
    .enter()
    .append("rect")
    .merge(rects)
    .transition("progressBar")
    .duration(1000)
    .attr("x", function(d, i) {
      return width * percent * i + margin.left;
    })
    .attr("width", function(d) {
      return d;
    })
    .attr("fill", function(d, i) {
      return colors[i];
    })
    .attr("height", height)
    .attr("y", height + margin.top);
  rects
    .exit()
    .transition()
    .remove();
}

function scenePicker(scene = 0) {
  console.log(currentScene);
  if (scene <= 0) {
    sceneZero();
  }
  if (scene === 1) {
    sceneOne();
  }
  if (scene === 2) {
    sceneTwo();
  }
  if (scene === 3) {
    sceneThree();
  }
  if (scene === 4) {
    sceneFour();
  }
  if (scene === 5) {
    sceneFive();
  }
}

function sceneZero() {
  currentScene = 0;
  d3.selectAll(".halfWidthtd").attr("width", "0");
  d3.selectAll(".tdHorizontalSpacer").attr("width", "0");
  d3.selectAll(".chart1tdClass").attr("width", "90%");

  d3.select("#chart1Header").attr("colspan", 3);

  d3.select("#chart2Header").html("");

  removeCategories();

  d3.selectAll(".scene1").remove();

  Hours();
}

function sceneOne() {
  currentScene = 1;

  removeCategories();

  d3.selectAll(".scene0")
  .remove();
  d3.selectAll(".scene2")
  .remove();

  var width = parseInt(d3.select(".charttr").style("width"), 10);

  d3.selectAll(".halfWidthtd").attr("width", 0);
  d3.selectAll(".tdHorizontalSpacer").attr("width", 0);
  d3.selectAll(".chart1tdClass").attr("width", width * 0.9);
  d3.selectAll("#Hours").attr("width", width * 0.9);

  d3.select("#chart2Header").html("");

  Hours(5, [0, 12]);

  (width = parseInt(d3.select("#Hours").style("width"), 10)),
    (height = parseInt(d3.select("#Hours").style("height"), 10));

  data = ["The highlighted hours (0 and 12) are likely", "higher than those around them due to estimated", "times being rounded to midnight and noon."]

  d3.select("body").select("#Hours").selectAll(".scene1").data(data)
    .enter()
    .append("text")
    .attr("fill", "black")
    .attr("x", width * 0.1)
    .attr("y", function(d, i) { return height * 0.25 + i * 20 ;} )
    .style("font-size", "1em")
    .attr("width", 200)
    .attr("class", "scene1")
    .attr("height", 20)
    .text(function(d) {return d});
}

function sceneTwo() {
  currentScene = 2;

  function cleanup(_callback) {
    d3.selectAll(".scene1").remove();
    d3.selectAll(".scene3").remove();

    var width = parseInt(d3.select(".charttr").style("width"), 10);

    d3.selectAll("#Hours").attr("width", width * 0.43);
    d3.selectAll(".halfWidthtd").attr("width", width * 0.43);
    d3.selectAll(".tdHorizontalSpacer").attr("width", width * 0.04);
    d3.selectAll(".chart1tdClass").attr("width", width * 0.43);

    d3.select(".scrollableDiv").style("overflow-y", "scroll");

    _callback();
  }

  function finish() {
    cleanup(function() {
      Hours();
      Categories();
    });
  }

  finish();
}

function removeHours() {
  d3.selectAll(".HoursChart").remove();
  d3.selectAll(".hoursBars").remove();
}

function removeCategories() {
    d3.select("#Category").attr("width", 0);
  d3.select(".scrollableDiv").style("overflow-y", "hidden");
  d3.selectAll(".Categories").remove();
}

function sceneThree() {
    currentScene = 3
    d3.selectAll(".scene4").remove();
  Categories(4, [8]);
  HoursForCategory("DUI", 0);

  (width = parseInt(d3.select("#Hours").style("width"), 10)),
    (height = parseInt(d3.select("#Hours").style("height"), 10));

  data = ["Some crimes like DUIs occur", "much more frequently at night"]

  d3.select("body").select("#Hours").selectAll(".scene3").data(data)
    .enter()
    .append("text")
    .attr("fill", "black")
    .attr("x", width * 0.3)
    .attr("y", function(d, i) { return height * 0.60 + i * 20 ;} )
    .style("font-size", "1em")
    .attr("width", 200)
    .attr("class", "scene3")
    .attr("height", 20)
    .text(function(d) {return d});

}

function sceneFour() {
    currentScene = 4
    d3.selectAll(".scene3").remove();
    Categories(4, [1]);
    HoursForCategory("Theft", 0);

    data = ["Others, like Theft peak", "in the afternoon."]

  d3.select("body").select("#Hours").selectAll(".scene4").data(data)
    .enter()
    .append("text")
    .attr("fill", "black")
    .attr("x", width * 0.075)
    .attr("y", function(d, i) { return height * 0.2 + i * 20 ;} )
    .style("font-size", "1em")
    .attr("width", 200)
    .attr("class", "scene4")
    .attr("height", 20)
    .text(function(d) {return d});
}

function sceneFive() {
    currentScene = 5
    d3.selectAll(".scene4").remove();
    Hours();
    Categories();
    d3.selectAll("rect")
        .style("cursor", "pointer");
    d3.selectAll("text")
        .style("cursor", "pointer");

    
}
