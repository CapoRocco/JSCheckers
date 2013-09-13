/**
 * @author Eliyahu Kiperwasser
 */

function GetComputerBoard(boardsGenerator, generation)
{
	var bestBoard = null;
	var bestScore = 0;
	
	for(var i = 0; i < boardsGenerator.length ; i++)
	{
		var currScore = EvaluateBoard(boardsGenerator[i], generation, null) ;
		
		if( currScore > bestScore || bestBoard == null)
		{
			bestScore = currScore;
			bestBoard = boardsGenerator[i]; 
		}
	}
	
	//console.log("GetComputerBoard Best score " + bestScore);
	
	return bestBoard;
}

function InitComputerOpponent(width, height, n)
{
	var generation = [];
	
	for(var i = 0 ; i < n ; i++)
	{
		var nn = [[],[]];
		
		for(var jnn = 0 ; jnn < width * height / 2 ; jnn++)
		{
			var layerone = [];
			
			for(var inn = 0 ; inn < board.width * (board.height + 1) / 2; inn++)
			{
				layerone.push( (Math.random() - 0.5) * 10 );
			}
			
			nn[0].push(layerone);
			nn[1].push( (Math.random() - 0.5) * 10 );
		}
		
		generation.push(nn);
	}
	
	return generation;
}

function EvaluateBoard(board, generation, n)
{
	nn = generation[n==null ? Math.floor(Math.random()*generation.length) : n];
	
	var result = 0;
	
	for(var jnn = 0 ; jnn < board.width * board.height / 2 ; jnn++)
	{
		var temp = 0;
		var features = GetBoardFeatureVector(board);
		
		for(var inn = 0 ; inn < board.width * (board.height + 1) / 2 ; inn++)
		{
			var feature = features.next();
			temp += (feature * nn[0][jnn][inn]);
		}
		
		result += nn[1][jnn]/(1.0 + Math.exp((-1.0)*temp));
	}
	
	return result; 
}

function DE(board, generation)
{
	var errors = [];
	var argMax = 0;
	var argMin = 0;
	
	for( var iGen = 0 ; iGen < generation.length ; iGen++ )
	{
		var iBoard = 0;
		var cboard = board;
		var tempErr = 0.0;
		
		while(cboard != null)
		{
			if (board.playerTurn * cboard.playerTurn > 0)
				tempErr += Math.abs((100 - iBoard) - ( EvaluateBoard(cboard, generation, iGen) ) );
			else tempErr += Math.abs((iBoard) - ( EvaluateBoard(cboard, generation, iGen) ) );
			cboard = cboard.prevBoard;
			iBoard++;
		}
		
		errors.push(tempErr);
		if(tempErr > errors[argMax])
			argMax = iGen;
			
		if(tempErr < errors[argMin])
			argMin = iGen;
	}

	nna = generation[Math.floor(Math.random()*generation.length)];
	nnb = generation[Math.floor(Math.random()*generation.length)];
	nnc = generation[Math.floor(Math.random()*generation.length)];
	
	for(var jnn = 0 ; jnn < board.width * board.height / 2 ; jnn++)
	{	
		for(var inn = 0 ; inn < board.width * board.height / 2 ; inn++)
		{
			if(Math.random() < 0.5)
				generation[argMax][0][jnn][inn] = Math.random() * (nnb[0][jnn][inn] - nnc[0][jnn][inn]) + nna[0][jnn][inn]; 
		}
		if(Math.random() < 0.5)
				generation[argMax][1][jnn] = Math.random() * (nnb[1][jnn] - nnc[1][jnn]) + nna[1][jnn];
	}
	
	return [generation, errors[argMin], errors[argMax]];
}
