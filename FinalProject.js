var colors = ["#c42b3c", "#381f22", "#2f70d8", "#e88020", "#95a7c4", "#c1838a"];

var border = "#e5dadb";



var transitionDuration = 0;

function setDuration(duration){
    transitionDuration = duration;
}

function Hours(col = 0, ind = -1) {

    d3.csv("Hours.csv", function(error,data) {
        if (error){
            console.log(error);
        }

        var margin = {top: 0, right: 10, bottom: 15, left: 10}
        , width = parseInt(d3.select("#Hours").style("width"), 10)
        , width = (width - margin.right) - margin.left
        , height = 500;
    
        data.forEach( function(d) {
            d.Hour = +d.Hour;
            d.Count = +d.Count;
        });

        var maxCount = d3.max(data, function(d) {return d.Count; });

        var records = data.length;

        var canvas = d3.select("body").select("#Hours")
            .attr("width", width)
            .attr("height", height)
            .style("border", border);
    
        data.sort(function(x, y){
            return d3.ascending(x.Hour, y.Hour)
        })

        var text = canvas.selectAll("text").data(data);

        text.enter().append("text").merge(text)
                .attr("fill", "black")
                .attr("x", function(d, i) {return (i * width / (records)) + width / (2 * (records)) ;})
                .attr("width", width / (records + 3) )
                .attr("y", 485)
                .style("text-anchor", "middle")
                .text(function (d) {return d.Hour})
                .style("font-family", "monospace")
                .style("font-size", "1em");
        text.exit().exit();
    
        var rects = canvas.selectAll("rect").data(data);

        rects.enter().append("rect").merge(rects)
                .on("mouseover", mouseOverHour)
                .on("mouseout", mouseOutHour)
                .on("click", hourClick)
                .transition("HoursTransition")
                .duration(transitionDuration)
                .attr("width", width / (records + 3))
                .attr("height", function (d) {return  d.Count / maxCount * (height - 100) ;})
                .attr("x", function(d, i) {return i * width / (records);})
                .attr("y",  function(d) { return (height - 35)  - d.Count / maxCount * (height - 100); })
                .attr("fill", function(d, i) { if (i === ind) {return colors[0]} else {return colors[col]};})
                
                ;
        rects.exit().remove();

    })
}

function mouseOverHour(d, i){
    if (d.Hour != currentHour){
        d3.select(this)
            .attr("fill", colors[1]);
    }
}
function mouseOutHour(d, i){

    if ("None" ===  currentHour){
        d3.select(this)
            .attr("fill", colors[0])
            .transition("mouseOutHourTransition");
    }
    if (currentHour != d.Hour & "None" != currentHour){
        d3.select(this)
            .attr("fill", colors[5])
            .transition("mouseOutHourTransition");
    }

}

function mouseOverCategory(d, i){
    if (d.Category != currentCategory){
        d3.select(this)
            .attr("fill", colors[3]);
    }
}
function mouseOutCategory(d, i){
    if ("None" ===  currentCategory){
        d3.select(this)
            .attr("fill", colors[2])
            .transition("mouseOutCategoryTransition");
    }
    if (currentCategory != d.Category & "None" != currentCategory){
        d3.select(this)
            .attr("fill", colors[4])
            .transition("mouseOutCategoryTransition");
    }
}

function categoryClick(d, i){
    if (d.Category === currentCategory){
        Categories();
        Hours();
        currentCategory = "None";
        currentHour = "None";
    }
    else{
        Categories(4, i);
        HoursForCategory(d.Category);
        currentCategory = d.Category;
        currentHour = "None";
    }
    
}

function hourClick(d, i){
    if (d.Hour === currentHour){
        Categories();
        Hours();
        currentHour = "None";
        currentCategory = "None";
    }
    else{
        Hours(5, i);
        CategoryForHours(d.Hour);
        currentHour = d.Hour;
        currentCategory = "None";
    }
    
}

var currentCategory = "None",
    currentHour = "None";

function Categories(col = 2, ind = -1) {

    d3.csv("Categories.csv", function(error,data) {
        if (error){
            console.log(error);
        }

        var margin = {top: 20, right: 10, bottom: 30, left: 10}
        , width = parseInt(d3.select("#Category").style("width"), 10)
        , width = (width - margin.right) - margin.left
        , height = 700;
    
        data.forEach( function(d) {
            d.Category = d.Category;
            d.Count = +d.Count;
        });

        var maxCount = d3.max(data, function(d) {return d.Count; });

        var canvas = d3.select("body").select("#Category")
            .attr("width", width)
            .attr("height", height);
    
        data.sort(function(x, y){
            return d3.descending(x.Count, y.Count)
        })

        var text = canvas.selectAll("text").data(data);

        text.enter().append("text").merge(text)
                .attr("fill", "black")
                .attr("y", function(d, i) {return i * 30 + 15;})
                .attr("x", 0)
                .on("click", categoryClick)
                .text(function (d) {return d.Category});
        text.exit().remove();
    
        var rects = canvas.selectAll("rect").data(data)

        rects.enter().append("rect").merge(rects)
                .on("mouseover", mouseOverCategory)
                .on("mouseout", mouseOutCategory)
                .on("click", categoryClick)
                .attr("height", 25)
                .transition("CategoriesTransition")
                .duration(transitionDuration)
                .attr("width", function (d) {return d.Count / maxCount * (width - 140);})
                .attr("y", function(d, i) {return i * 30;})
                .attr("x", 140)
                .attr("fill", function(d, i) { if (i === ind) {return colors[2]} else {return colors[col]};});
        rects.exit().remove();
    })
}

function HoursForCategory(categoryFilter, col = 0) {

    d3.csv("Hours by Crime.csv", function(error,data) {
        if (error){
            console.log(error);
        }
        console.log(transitionDuration);

        var margin = {top: 20, right: 10, bottom: 30, left: 10}
        , width = parseInt(d3.select("#Hours").style("width"), 10)
        , width = width - margin.right - margin.left
        , height = 500;
        
    
        data.forEach( function(d) {
            d.Hour = +d.Hour;
            d.Count = +d.Count;
            d.Category = d.Category;
        });

        data = data.filter((value, index, array) => {
            return value.Category === categoryFilter;
        });

        var maxCount = d3.max(data, function(d) {return d.Count; });

        var records = data.length;

        var canvas = d3.select("body").select("#Hours")
            .attr("width", width)
            .attr("height", height);
    
        data.sort(function(x, y){
            return d3.ascending(x.Hour, y.Hour)
        })

        var text = canvas.selectAll("text").data(data);

        text.enter().append("text").merge(text)
                .filter(function(d) { return d.Category == categoryFilter})
                .attr("fill", "black")
                .attr("x", function(d, i) {return (i * width / (records)) + width / (2 * (records)) ;})
                .attr("y", 485)
                .text(function (d) {return d.Hour});
        text.exit().exit();
    
        var rects = canvas.selectAll("rect").data(data);

        rects.enter().append("rect").merge(rects)
                .filter(function(d) { return d.Category == categoryFilter})
                .on("mouseover", mouseOverHour)
                .on("mouseout", mouseOutHour)
                .on("click", hourClick)
                .transition("CategoryHourTransition")
                .duration(transitionDuration)
                .attr("width", width / (records + 3))
                .attr("height", function (d) {return  d.Count / maxCount * (height - 100) ;})
                .attr("x", function(d, i) {return i * width / (records);})
                .attr("y",  function(d) { return (height - 35)  - d.Count / maxCount * (height - 100); })
                .attr("fill", colors[col]);
                
                
        rects.exit().remove();
    
        
    
    
    
    
    })
}

function CategoryForHours(hourFilter, col = 2) {

    d3.csv("Hours by Crime.csv", function(error,data) {
        if (error){
            console.log(error);
        }

        var margin = {top: 20, right: 10, bottom: 30, left: 10}
        , width = parseInt(d3.select("#Category").style("width"), 10)
        , width = (width - margin.right) - margin.left
        , height = 700;
    
        data.forEach( function(d) {
            d.Hour = +d.Hour;
            d.Count = +d.Count;
            d.Category = d.Category;
        });


        data = data.filter((value, index, array) => {
            return value.Hour === hourFilter;
        });


        var maxCount = d3.max(data, function(d) {return d.Count; });

        var canvas = d3.select("body").select("#Category")
            .attr("width", width)
            .attr("height", height);
    
        data.sort(function(x, y){
            return d3.descending(x.Count, y.Count)
        })

        var text = canvas.selectAll("text").data(data);

        text.enter().append("text").merge(text)
                .attr("fill", "black")
                .attr("y", function(d, i) {return i * 30 + 15;})
                .attr("x", 0)
                .text(function (d) {return d.Category});
        text.exit().exit();
    
        var rects = canvas.selectAll("rect").data(data);

        rects.enter().append("rect").merge(rects)
                .on("mouseover", mouseOverHour)
                .on("mouseout", mouseOutHour)
                .on("click", categoryClick)
                .transition("HoursForCategoryTransition")
                .duration(transitionDuration)
                .attr("height", 25)
                .attr("width", function (d) {return  d.Count / maxCount * (width - 100) ;})
                .attr("y", function(d, i) {return i * 30;})
                .attr("x",  140)
                .attr("fill", colors[col])
                
                ;
        rects.exit().remove();var text = canvas.selectAll("text").data(data);

    

    })
}