/**
 * Created by vimalkumar on 12/31/2015.
 */

var memoryGame=function(gameInit){
   var gLevel={   Easy :{ row:2,column:4},
                  Medium:{ row:4,column:5},
                  Hard : {row:5,column:6}
                    };

    // default
    var $level=gLevel.Easy;
    var $width=100;
    var $height=100;
    var $ImagePrefix="Image";
    var $ImagePath="../Images/"+$ImagePrefix;
    var $FirstSelectedImage="";
    var $ElementSelector="";
    var $move=0;
    // if ini
    if(gameInit !=null)
    {
        $level=gLevel[gameInit.level] || $level;
        $width=gameInit.width || 100;
        $width=gameInit.height || 100;

    }

    var setupGame=function()
    {
        $("#gridWrapper").empty();
        var rows = $level.row;
        var columns = $level.column;

        var $row = $("<div />", {
            class: 'section__content_inner clearfix'

        });

        var sectionWidth=(columns*$width)+50;
        $row.css({'width':sectionWidth+'px'});
        var $square = $("<div />", {
            class: 'card effect__click',

        });

        $square.css({'width':$width+'px','height':$height+'px'});

        var $cardFront=$("<div />", {
            //class: 'card__front'
        });

        var $cardBack=$("<div />", {
            class: 'card__back'
        });

        var count=1;
        var trackID=[];
        //Create Grid
        for (var j = 0; j < rows; j++) {
            var row=$row.clone();
            trackID.push([]);
            for (var i = 0; i < columns; i++) {
                var square=$square.clone();
                square.attr("id",count);
                var cardfront=$cardFront.clone();
                cardfront.attr("id","cardF"+count);
                //cardfront.append("<span>"+count+"</span>")
                var cardBack=$cardBack.clone();
                cardBack.attr("id","cardB"+count);
                //cardBack.append("<span>"+count+"</span>")
                square.append(cardfront);
                square.append(cardBack);
                row.append(square);
                trackID[j].push(count);
                count=count+1;

            }
            $("#gridWrapper").append(row);
        }

        // get the spiral behaiour based on id
        var spiralTravArr=spiralTraversal(trackID);
        // get the card image tile
        var shuffleImage=getCardImage((rows*columns));

        $.each(spiralTravArr,function(i,val){
            //showItem(val);
            if(shuffleImage[i] !== undefined) {

                $("#cardB" + val).prepend('<img id="theImg" data-name="Image'+Math.ceil(shuffleImage[i] / 2) +'.png" src="' + $ImagePath + Math.ceil(shuffleImage[i] / 2) + '.png" />');


                $("#" + val).delay(200 * i).show(100, function () {
                    //$(this).delay(7000).hide(300);
                    $("#cardF" + val).addClass('card__front');


                });
            }
        });
        bindGridFlip();
    };

    var getCardImage= function(noOfTiles){
        var arr= Array.apply(null,Array(noOfTiles));
        arr=arr.map(function (x,i){return i+1});

        var i = 0
            , j = 0
            , temp = null

        for (i = arr.length - 1; i > 0; i -= 1) {
            j = Math.floor(Math.random() * (i + 1))
            temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }

        return arr;
    };

    var bindGridFlip=function () {
        var cards = document.querySelectorAll(".card.effect__click");
        for (var i = 0, len = cards.length; i < len; i++) {
            var card = cards[i];
            clickListener(card);
        }

        function clickListener(card) {
            card.addEventListener("click", function () {
                var c = this.classList;
                var self=this;
               // c.contains("flipped") === true ? c.remove("flipped") : c.add("flipped");
                if(c.contains("flipped")=== false){
                    c.add("flipped");
                    //$(this).addClass("flipped").delay("200",
                    setTimeout(function(){checkImageMatch(self)},1000);
                }
            });
        }
    };

    var gameScore=function(){

    };

    var checkImageMatch=function(element){
         if($FirstSelectedImage==""){
             $FirstSelectedImage= $(element).find("#theImg").attr("data-name")
             $ElementSelector=element;
         }
        else if($FirstSelectedImage==$(element).find("#theImg").attr("data-name")){
             //score ++
             //move ++
             $move=$move+1;
             $("#score").text($move);
             $FirstSelectedImage=""
             $ElementSelector=""
         }
        else
         {
             element.classList.remove("flipped");
             $ElementSelector.classList.remove("flipped");
             $FirstSelectedImage=""
             $ElementSelector=""
             $move=$move+1;
             $("#score").text($move);
         }



    };
    var spiralTraversal = function(matrix){
        if (!Array.isArray(matrix) || !matrix.length) return null;
        if (!matrix[0].length) return [];

        var row = 0, col = 0;
        var visited = [matrix[row][col]];

        var topBound  = 0, bottomBound = matrix.length-1,
            leftBound = 0, rightBound  = matrix[0].length-1;

        while (leftBound <= rightBound && topBound <= bottomBound) {
            while (col < rightBound) { visited.push(matrix[row][++col]); }
            topBound++;
            while (row < bottomBound) { visited.push(matrix[++row][col]); }
            rightBound--;
            while (col > leftBound) { visited.push(matrix[row][--col]); }
            bottomBound--;
            while (row > topBound) { visited.push(matrix[--row][col]); }
            leftBound++;
        }

        return visited;
    };


    return {
        gLevel:gLevel,
        setup:setupGame
    }
}
