//IMPROVE THIS CODE

(function () {

    var spaceShip = "3o$o2bo$o$o$bobo!"; //lightweight spaceShip 8
    var lGlider = "3o$o$bo!"; //glider 5
    var rGlider = "3o$2bo$bo!"; //glilder 5
    var preblock = "2o$o!"; // pre block 3
    var zap = "o$2o$bo!"; // creates a boat(6) costs:4
    var blinker = "3o!";
    var fourBoats = "$2bo$bobo$bobo$2bo$2bo!";
    var boat = "$b4o!";
    var trafficLights = "bo$2o$bo!";
    var LinePointer = "$b47o$b2obobobobobobobobobobobobobobobobobobobobobob2o!"; // line which is pointing forward
    var Metushelach = "2bo$bobo$bo$o!";
    var oneDot = "$bo!";




    function getRnd(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function registerArmy() {
        window.registerArmy({
            name: 'DevOps Giants',
            icon: 'knight',
            cb: cb
        });
    }

    setTimeout(registerArmy, 0);

    function cb(data) {
        var pixels = [];
        var plan;
        if (data.generation === 1) {
            planIndex = 0;
            fenceLocation = 0;
            fenceRow = 15;
        }
        if (data.generation < 200) {
            plan = ['trafficLights', 'Rspaceship'];
        } else if (data.generation < 600) {
            plan = ['fence'];
        } else if (data.generation % 5) {
            plan = ['Lspaceship'];
        } else if (data.generation % 4) {
            plan = ['Lspaceship'];
        } else {
            plan = ['rglider'];
        }
        planIndex = planIndex % plan.length;
        if (plan[planIndex] === 'boat') {
            pixels = tryPlaceRle(data, boat, 4);
        } else if (plan[planIndex] === 'fence') {
            pixels = tryPlaceFence(data);
        } else if (plan[planIndex] === 'lglider') {
            pixels = tryPlaceRle(data, lGlider, 4, getRnd(0,data.cols), 0);
        } else if (plan[planIndex] === 'rglider') {
            pixels = tryPlaceRle(data, rGlider, 4, getRnd(0,data.cols), 0);
        } else if (plan[planIndex] === 'Rspaceship') {
            pixels = tryPlaceRle(data, spaceShip, 15, getRnd(data.cols/2, 3*data.cols/4),0);
        } else if (plan[planIndex] === 'Lspaceship') {
            pixels = tryPlaceRle(data, spaceShip, 15, getRnd(data.cols/4, data.cols/2),0);
        } else if (plan[planIndex] === 'trafficLights') {
            pixels = tryPlaceRle(data, trafficLights, 3, getRnd(0,data.cols/2), getRnd(0,data.rows/2));
        }

        if (pixels.length > 0) {
            planIndex = (planIndex + 1) % plan.length;
        }
        return pixels;
    };

    function tryPlaceFence(data, col, row) {
        var pixels = [];
        // var fenceRow = data.rows - 15;
        var r, c;
        c = col || fenceLocation;
        r = row || data.rows - fenceRow;
        pixels = tryPlaceRle(data, fourBoats, 5, c, r);

        if (pixels.length > 0)
            fenceLocation += 8;

        if (fenceLocation > data.cols - 2) {
            fenceLocation = 0;
            fenceRow += 15;
        }
        return pixels;
    }

    function tryPlaceRle(data, rle, neededBudget, col, row) {
        var pixels = [];

        if (data.budget >= neededBudget) {
            c = (col === 0) ? 0 : col || getRnd(0, data.cols - 2);
            r = (row === 0) ? 0 : row || getRnd(0, 30);
            pixels = getPixelsFromRle(rle, c, r);
        }
      
        return pixels;
    }

    function lineOfDeath(data,row) {
        var pixels = [];
        if (data.budget >= (data.cols + (data.cols % 17) + 10)) {
            for (i = 0 ; i <= (data.cols) ; i++) {
                pixels.push([i,row]);
                if((i % 17) === 0) {
                    pixels.push([i,row+1]);
                }
            }
        }
        return pixels;
    }

    function getPixelsFromRle(rle, c, r, pixels) {
        var pixels = [];
        var num = '';
        var x = 0;
        var y = 0;
        var l;

        for (var s in rle) {
            var s = rle[s];
            if (s === 'b') {
                x = num === '' ? x + 1 : x + parseInt(num);
                num = '';
            } else if (s === 'o') {
                var i = num === '' ? 1 : parseInt(num);
                while (i--)
                    pixels.push([c + x + i, r + y]);

                x = num === '' ? x + 1 : x + parseInt(num);
                num = '';
            } else if (s === '$') {
                y += num === '' ? 1 : parseInt(num);
                x = 0;
                num = '';
            } else if (s === '!')
                break;
            else if (parseInt(s).toString() !== 'NaN') {
                num += s;
            }
        }
        return pixels;
    };

})();
