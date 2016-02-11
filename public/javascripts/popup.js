myBlurFunction = function(state) {
    /* state can be 1 or 0 */
    var containerElement = document.getElementById('whole');
    var overlayEle = document.getElementById('overlay');

    if (state) {
        overlayEle.style.display = 'block';
        containerElement.setAttribute('class', 'blur');
    } else {
        overlayEle.style.display = 'none';
        containerElement.setAttribute('class', null);
    }
};


myBlurFunction2 = function(state) {
    /* state can be 1 or 0 */
    var containerElement = document.getElementById('whole');
    var overlayEle = document.getElementById('overlay2');

    if (state) {
        overlayEle.style.display = 'block';
        containerElement.setAttribute('class', 'blur2');
    } else {
        overlayEle.style.display = 'none';
        containerElement.setAttribute('class', null);
    }
};

myBlurFunction3 = function(state) {
    /* state can be 1 or 0 */
    var containerElement = document.getElementById('whole');
    var overlayEle = document.getElementById('overlay3');

    if (state) {
        overlayEle.style.display = 'block';
        containerElement.setAttribute('class', 'blur3');
    } else {
        overlayEle.style.display = 'none';
        containerElement.setAttribute('class', null);
    }
};

myBlurFunction4 = function(state) {
    /* state can be 1 or 0 */
	myBlurFunction2(0);
    var containerElement = document.getElementById('whole');
    var overlayEle = document.getElementById('overlay4');

    if (state) {
        overlayEle.style.display = 'block';
        containerElement.setAttribute('class', 'blur4');
    } else {
        overlayEle.style.display = 'none';
        containerElement.setAttribute('class', null);
    }
};

myBlurFunction5 = function(state) {
    /* state can be 1 or 0 */
	//myBlurFunction4(0);
    var containerElement = document.getElementById('whole');
    var overlayEle = document.getElementById('overlay5');

    if (state) {
        overlayEle.style.display = 'block';
        containerElement.setAttribute('class', 'blur5');
    } else {
        overlayEle.style.display = 'none';
        containerElement.setAttribute('class', null);
    }
};

var element = document.getElementById("username");
element.onclick = element.select();