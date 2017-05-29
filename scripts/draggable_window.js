var currZIndex = 0;
var draggable_window = function(){ // To make the code cooler. TZDragg. Cool name!
    return {
        // Here we start of with the main functions
        startMoving : function(evt, el){ // The function that sets up the div coordinates to make it move. Executed on the onmousedown event on the div.
            el.style.zIndex = ++currZIndex;
            evt = evt || window.event;
            var posX = evt.clientX, // The x-coordinate of the mouse pointer position on the screen
                posY = evt.clientY; // The y-coordinate of the mouse pointer position on the screen
                a = el; // Points to the div element

            var divTop = window.getComputedStyle(el,null).getPropertyValue("top");
            var divLeft = window.getComputedStyle(el,null).getPropertyValue("left"); // We need the initial position of the div so that we can determine its final position on dragging
            divTop = divTop.replace('px',''); // Just so that we can perform calculations on the variable.
            divLeft = divLeft.replace('px',''); // Just so that we can perform calculations on the variable.
            var diffX = posX - divLeft, // We keep this value so that we can calculate the final position of the element
                diffY = posY - divTop; // We keep this value so that we can calculate the final position of the element
            document.onmousemove = function(evt){ // Whenever the mouse moves, this function is execulted
                evt = evt || window.event;
                var posX = evt.clientX, // Mouse x-coordinate
                    posY = evt.clientY, // Mouse y-coordinate
                    aX = posX - diffX, // The final x-coordinate of the element
                    aY = posY - diffY; // The final y-coordinate of the element
                draggable_window.move(el,aX,aY); // Function to assign the style rules to the element
            }
        },
        stopMoving : function(el){ // This function gets executed when the user leaves the div alone. Changed the value of the onmousemove attribute.
            document.onmousemove = function(){}
        },
        move : function(el,xpos,ypos){ // Function to assign the style rules to the element
            var a = el;
            el.style.left = xpos + 'px';
            el.style.top = ypos + 'px';
        },
        showIt: function (el) {
            el.style.zIndex = ++currZIndex;
        }
    }
}();