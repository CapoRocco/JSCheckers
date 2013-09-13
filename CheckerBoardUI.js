/**
 * @author Eliyahu Kiperwasser
 */
function DrawCheckersBoardUI( canvas, board )
{
	var width = canvas.width / board.width;
	var height = canvas.height / board.height;
	var context = canvas.getContext("2d");
	
	
	for (var i=0; i < board.height; i++) 
	{
	  
	  for (var j=0; j < board.width; j++)
	  {	
	  	if( ( i + j ) % 2 == 1 )
	  	{
	  		context.fillStyle="#000000";
	  		context.fillRect(width*j, height*i, width, height);
	  	}
	  	else
	  	{
	  		if(board.highlightX != j || board.highlightY != i ) 
	  		{
		  		context.fillStyle="#FFFFFF";
		  		context.fillRect(width*j, height*i, width, height);
	  		}
	  		else if( board.playerTurn * board.state[i][j] > 0)
	  		{
	  			context.fillStyle="yellow";
		  		context.fillRect(width*j, height*i, width, height);
	  		}
	  		
		  	if(board.state[i][j] > 0)
		  	{
				context.beginPath();
		      	context.arc(width*j + width / 2, height*i + height / 2, Math.min(height / 2, width / 2) - 5, 0, 2 * Math.PI, false);
		        context.fillStyle = 'green';
		        context.fill();
		     	context.lineWidth = 5 + Math.abs(board.state[i][j]);
		        context.strokeStyle = '#000000';
		        context.stroke();
		  	}
		  	else if(board.state[i][j] < 0)
		  	{
				context.beginPath();
		      	context.arc(width*j + width / 2, height*i + height / 2, Math.min(height / 2, width / 2) - 5, 0, 2 * Math.PI, false);
		        context.fillStyle = 'red';
		        context.fill();
		     	context.lineWidth = 5 + Math.abs(board.state[i][j]);
		        context.strokeStyle = '#000000';
		        context.stroke();
  		
		  	}

	  	}
	  	
	  }
	}
	
	if (board.winningPlayer != null)
	{
		alert("Player " + (board.winningPlayer > 0 ? "green" : "red") + " won!");
	}
}

function BoardClicked(event, board, canvas)
{
	var x = new Number();
    var y = new Number();

    if (event.x != undefined && event.y != undefined)
    {
      x = event.x;
      y = event.y;
    }
    else // Firefox method to get the position
    {
      x = event.clientX + document.body.scrollLeft +
          document.documentElement.scrollLeft;
      y = event.clientY + document.body.scrollTop +
          document.documentElement.scrollTop;
    }

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    
    return [Math.floor( y * board.height / canvas.height), Math.floor( x * board.width / canvas.width )];
}
