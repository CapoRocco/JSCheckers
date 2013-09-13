/**
 * @author Eliyahu Kiperwasser
 */

function InitialCheckersBoard()
{
	var board = {};
	board.state = [ 
	[ 1, NaN, 1, NaN, 1, NaN, 1, NaN], 
	[ NaN, 1, NaN, 1, NaN, 1, NaN, 1], 
	[ 1, NaN, 1, NaN, 1, NaN, 1, NaN], 
	[ NaN, 0, NaN, 0, NaN, 0, NaN, 0], 
	[ 0, NaN, 0, NaN, 0, NaN, 0, NaN], 
	[NaN, -1, NaN, -1, NaN, -1, NaN, -1], 
	[-1, NaN, -1, NaN, -1, NaN, -1, NaN], 
	[NaN, -1, NaN, -1, NaN, -1, NaN, -1] ];
	
	board.width = 8;
	board.height = 8;
	
	board.playerTurn = 1;
	board.highlightX = -1;
	board.highlightY = -1;
	board.doubleEatPossible = false;
	board.eatPossible = false;
	board.winningPlayer = null;
	board.prevBoard = null;
	board.depth = 0;
	
	return board;
}

function CloneBoard(board)
{
	if(board == null)
		return null;
		
	var cloneboard = {};
	cloneboard.state = [];
	
	for (var i=0; i < board.height; i++) 
	{
	  cloneboard.state.push(board.state[i].slice());
	}
	
	cloneboard.width = board.width;
	cloneboard.height = board.height;
	
	cloneboard.playerTurn = board.playerTurn;
	cloneboard.highlightX = board.highlightX;
	cloneboard.highlightY = board.highlightY;
	cloneboard.doubleEatPossible = board.doubleEatPossible;
	cloneboard.eatPossible = board.eatPossible;
	cloneboard.winningPlayer = board.winningPlayer;
	cloneboard.prevBoard = CloneBoard(board.prevBoard);
	cloneboard.depth = board.depth;
	
	return cloneboard;
}


function PieceClicked(coordinates, board)
{
	var oldBoard = board;
	board = CloneBoard(oldBoard);

	if( board.state[coordinates[0]][coordinates[1]] * board.playerTurn > 0 && !board.doubleEatPossible)
	{    
	    board.highlightY  = coordinates[0];
	    board.highlightX  = coordinates[1];
    }
	else if( board.highlightY >= 0 && board.highlightX >= 0 )
	{
		for( moveInfo in GetPiecePossibleMoves([board.highlightY, board.highlightX], board) )
		{
			if ( moveInfo[0][0] == coordinates[0] && moveInfo[0][1] == coordinates[1] && ( (!board.doubleEatPossible && !board.eatPossible) || moveInfo[1] != null ))
			{
				board.state[coordinates[0]][coordinates[1]] = board.state[board.highlightY][board.highlightX] * 
				((coordinates[0] == board.height - 1 || coordinates[0]==0) && Math.abs(board.state[board.highlightY][board.highlightX]) == 1 ? Math.min(board.width, board.height) : 1);
				board.state[board.highlightY][board.highlightX] = 0;
				
				if (moveInfo[1] != null)
				{
					board.state[moveInfo[1][0]][moveInfo[1][1]] = 0;
				
					board.doubleEatPossible = false;
					for( secondMove in GetPiecePossibleMoves([coordinates[0], coordinates[1]], board) )
					{
						if (secondMove[1] != null)
						{
							board.doubleEatPossible = true;
							break;
						}
					}
					if(board.doubleEatPossible)
					{
						board.highlightY = coordinates[0];
						board.highlightX = coordinates[1];
					}
				}
				
				
				if(!board.doubleEatPossible)
				{
					board.highlightY  = -1;
		    		board.highlightX  = -1;
		    		board.playerTurn *= -1;
		    		board.doubleEatPossible = false;
		    		board.prevBoard = oldBoard;
		    		board.depth = oldBoard.depth + 1;
		    	}
			}
		}
	}
    
    board.eatPossible = MustEat(board);
    
    var winningFlag = true;
    for( moveInfo in GetAllPiecesPossibleMoves(board) )
	{
		winningFlag = false;
		break;
	}
	
	if(winningFlag)
		board.winningPlayer = board.playerTurn * (-1);
    
    return board;
}

function MustEat(board)
{
	for( moveInfo in GetAllPiecesPossibleMoves(board) )
	{
		if( moveInfo[1][1] != null )
			return true;
	}
	
	return false;
}

function GetValidNextBoard(board)
{
	var cboard = CloneBoard(board);
	var boards = [];
	
	for( moveInfo in GetAllValidPiecesPossibleMoves(cboard) )
	{
		boards.push(ApplyBoardMove(moveInfo, cboard));
	}
	
	return boards;
}

function ApplyBoardMove(moveInfo, board)
{
	if(!board.doubleEatPossible)
		board = PieceClicked(moveInfo[0], board);
	board = PieceClicked(moveInfo[1][0], board);
	return board;
}

function GetAllValidPiecesPossibleMoves(board)
{
	if(board.doubleEatPossible)
	{
		for( secondMove in GetPiecePossibleMoves([board.highlightY, board.highlightX], board) )
		{
			if (secondMove[1] != null)
			{
				yield [[board.highlightY, board.highlightX], secondMove];
			}
		}
	}
	else
	{
		for( moveInfo in GetAllPiecesPossibleMoves(board) )
		{
			if( moveInfo[1][1] != null || !board.eatPossible)
				yield moveInfo;
		}
	}
}

function GetAllPiecesPossibleMoves(board)
{
	for (var i=0; i < board.height; i++) 
	{
	  for (var j=0; j < board.width; j++)
	  {
	  	if( board.playerTurn * board.state[i][j] > 0)
	  	{
	  		for( moveInfo in GetPiecePossibleMoves([i, j], board) )
			{
				yield [[i, j], moveInfo];
			}
	  	}	
	  }
    }
}

function GetPiecePossibleMoves(coordinates, board)
{
	var playerOriginalSign = ( board.state[coordinates[0]][coordinates[1]] < 0 ? -1 : 1);
	var playerSigns = [playerOriginalSign];
	var maxLen = board.state[coordinates[0]][coordinates[1]] * playerOriginalSign;
	var isKing = (maxLen > 1);
	var xDiffs = [-1, 1] ;
	
	if (isKing) playerSigns = [1, -1];
	
	for( var xDiff = 0; xDiff < 2 ; xDiff++ )
	{
		for( var iPlayerSign = 0 ; iPlayerSign < playerSigns.length ; iPlayerSign++ )
		{
			var cCoordinates = [coordinates[0] + playerSigns[iPlayerSign], coordinates[1] + (xDiff * 2 -1)];
			var eatenPieceCoords = null;
			
			for(var i = 0 ; i < maxLen + (eatenPieceCoords != null ? 1 : 0) ; i++)
			{
				if( cCoordinates[0] < 0 || cCoordinates[1] < 0 || cCoordinates[0] >= board.height || cCoordinates[1] >= board.width )
					break;
				
				if(board.state[cCoordinates[0]][cCoordinates[1]] == 0)
				{
					yield [cCoordinates, eatenPieceCoords];
				}
				else if (eatenPieceCoords == null && board.state[cCoordinates[0]][cCoordinates[1]] * playerOriginalSign < 0)
				{
					eatenPieceCoords = [cCoordinates[0], cCoordinates[1]];
				}
				else break;
				
				cCoordinates[0] += playerSigns[iPlayerSign];
				cCoordinates[1] += (xDiff * 2 -1);
			}
		}
	}
}

function GetBoardFeatureVector(board)
{
	for (var i=0; i < board.height; i++) 
	{
	  yield board.playerTurn;
	  
	  for (var j=0; j < board.width; j++)
	  {
	  	if( isNaN(board.state[i][j]) == false )
	  	{
	  		yield board.state[i][j];
	  	}
	  }
	}
}
