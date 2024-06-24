import React, { useState, useEffect } from "react";

const Home = () => {

	const [userBoard, setUserBoard] = useState(CreateBoard());
	const [cpuBoard, setCpuBoard] = useState(CreateBoard());
	const [currentlyTargeted , setCurrentlyTargeted] = useState([1,1]);
	const [boat1, setBoat1] = useState({"column": 1, "row": 1, "direction": "up"});
	const [boat2, setBoat2] = useState({"column": 1, "row": 1, "direction": "up"});
	const [boat3, setBoat3] = useState({"column": 1, "row": 1, "direction": "up"});
	const [boat4, setBoat4] = useState({"column": 1, "row": 1, "direction": "up"});
	const [boat5, setBoat5] = useState({"column": 1, "row": 1, "direction": "up"});
	const [userBoats, setUserBoats] = useState({});
	const [cpuBoats, setCpuBoats] = useState({});
	const [boardColumns, setBoardColumns] = useState([]);
	const [boardRows, setBoardRows] = useState([]);
	const [numberOfBoats, setNumberOfBoats] = useState([1,2,3,4,5]);
	const [playerLifePoints, setPlayerLifePoints] = useState();
	const [cpuLifePoints, setCpuLifePoints] = useState();
	const [gameStatus, setGameStatus] = useState("inactive");
	const [turnStatus, setTurnStatus] = useState();
	const [userFiredAtTiles, setUserFiredAtTiles] = useState([]);
	const [cpuFiredAtTiles, setCpuFiredAtTiles] = useState([]);
	const rowCoordinates = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];


	useEffect(() => {
        defineColumns();
		defineRows();
      }, []);
	
	function defineColumns () { //create array to be used in boat selection options
		let tempArr = []
		for (let i = 1; i <10; i++){
			tempArr.push({name: i, value: i})
		}
		setBoardColumns(tempArr);
	}

	function defineRows () { //create array to be used in boat selection options
		let tempArr = []
		
		for (let i = 1; i <10; i++){
			tempArr.push({name: rowCoordinates[i-1], value: i})
		}
		setBoardRows(tempArr);
	}


	function handleTargeting (xCoord, yCoord){ //Handles which tile on the cpu board is being targeted
		setCurrentlyTargeted([xCoord, yCoord]);
	}

	function addUserBoat (startingXCoord, startingYCoord, direction, size){ //Adds boats to user board
		let newBoatCoordinates = [];
		startingXCoord = Number(startingXCoord);
		startingYCoord = Number(startingYCoord);

		for (let i = 0; i < size; i++){
			if(direction === "up" && startingYCoord >= size){   //validates direction, prevents overflow from the board
				newBoatCoordinates.push(`${startingXCoord}${startingYCoord - i}`); //add cordinates as XY instead of [X,Y] to avoid unnecesary array nesting
			}
			else if(direction === "right" && ((startingXCoord+size) <= 10)){
				newBoatCoordinates.push(`${startingXCoord + i}${startingYCoord}`);
			}
			else if(direction === "down" && ((startingYCoord+size) <= 10)){
				newBoatCoordinates.push(`${startingXCoord}${startingYCoord + i}`);
			}
			else if(direction === "left" && startingXCoord >= size){
				newBoatCoordinates.push(`${startingXCoord - i}${startingYCoord}`);
			}
			else {
				console.log("Can't place a boat out of bounds");
				return ("not ok");
			}
		}
		
		let tempCoords = newBoatCoordinates; //Prevents boat overlapping
		for (let i = 0; i < newBoatCoordinates.length; i++){
			if(CheckIfValueIsInNestedArray(userBoats, tempCoords[i])){
				newBoatCoordinates = []
				console.log("Boats can't overlap");
			}
		}
		if (newBoatCoordinates.length != 0){
			setUserBoats(prevState => ({
				...prevState,
				[size]: newBoatCoordinates //uses size as id as both are unique and the same in this game
			}));
		}
		return "ok";
	}

	function addCpuBoats () { //Hardcoded to test firing and turns, random selection will be added
		let possibleDirections = ["up", "right", "left", "down"];
		let tempObj = {}
		for (let i = 1; i < 6; i++){
			let newCpuBoats = []
			let boatIsCorrect = false;
			while(!boatIsCorrect){
				let newBoatCoordinates = [Math.floor(Math.random() * 9) +1, Math.floor(Math.random() * 9)+1];
				let newBoatDirection = possibleDirections[Math.floor(Math.random() * 5)];
				for (let j = 0; j < i; j++){
					if(newBoatDirection === "up" && newBoatCoordinates[1] >= i){   //validates direction, prevents overflow from the board
						newCpuBoats.push(Number(`${newBoatCoordinates[0]}${newBoatCoordinates[1] - j}`)); //add cordinates as XY instead of [X,Y] to avoid unnecesary array nesting
						boatIsCorrect = true;
					}
					else if(newBoatDirection === "right" && (([newBoatCoordinates[0]]+i) <= 10)){
						newCpuBoats.push(Number(`${newBoatCoordinates[0] + j}${newBoatCoordinates[1]}`));
						boatIsCorrect = true;
					}
					else if(newBoatDirection === "down" && ((newBoatCoordinates[1]+i) <= 10)){
						newCpuBoats.push(Number(`${newBoatCoordinates[0]}${newBoatCoordinates[1] + j}`));
						boatIsCorrect = true;
					}
					else if(newBoatDirection === "left" && newBoatCoordinates[0] >= i){
						newCpuBoats.push(Number(`${newBoatCoordinates[0] - j}${newBoatCoordinates[1]}`));
						boatIsCorrect = true;
					}
				}
				let tempCoords = newCpuBoats; //Prevents boat overlapping
				let overlappingTiles = 0;
				console.log(tempObj);
				for (let k = 0; k < newCpuBoats.length; k++){
					console.log(tempCoords[k]);
					if(CheckIfValueIsInNestedArray(tempObj, tempCoords[k])){
						overlappingTiles += 1;
						console.log("Boats can't overlap");
					}
				}
				console.log("tiles: ", overlappingTiles)
			}
			tempObj[i] = newCpuBoats;
		}
		console.log(tempObj) //borrar
		setCpuBoats(tempObj);
		return tempObj;
	}

	function CheckIfValueIsInNestedArray (obj, valueToFind){ //Checks if a tile coordinates are in a given object of arrays
		let result = false;
		let objPosition = 0;
		while(result === false && objPosition < Object.values(obj).length){
			result = Object.values(obj)[objPosition].includes(valueToFind);
			objPosition = objPosition +1;
		}
		return result;
	}

	function saveBoatInput (name, value, boatNumber) { //saves boat selection on change but doesnt automatically add it to the board
		if(boatNumber == 1){
			setBoat1((prevState => ({
				...prevState,
				[name]: value
			})));
		}
		else if (boatNumber == 2){
			setBoat2((prevState => ({
				...prevState,
				[name]: value
			})));
		}
		else if (boatNumber == 3){
			setBoat3((prevState => ({
				...prevState,
				[name]: value
			})));
		}
		else if (boatNumber == 4){
			setBoat4((prevState => ({
				...prevState,
				[name]: value
			})));
		}
		else if (boatNumber == 5){
			setBoat5((prevState => ({
				...prevState,
				[name]: value
			})));
		}
	}

	function sendBoatInput (boatNumber){ //Saves boat data to be added
		if(boatNumber == 1){
			addUserBoat(boat1.column, boat1.row, boat1.direction, boatNumber);
		}
		else if (boatNumber == 2){
			addUserBoat(boat2.column, boat2.row, boat2.direction, boatNumber);
		}
		else if (boatNumber == 3){
			addUserBoat(boat3.column, boat3.row, boat3.direction, boatNumber);
		}
		else if (boatNumber == 4){
			addUserBoat(boat4.column, boat4.row, boat4.direction, boatNumber);
		}
		else if (boatNumber == 5){
			addUserBoat(boat5.column, boat5.row, boat5.direction, boatNumber);
		}
	}

	function UserFireAtTarget(xCoord, yCoord){    //Handles user firing at enemy positions

		let tempTurnStatus = "";
		let tempGameStatus = "active"
		if (!userFiredAtTiles.includes(Number(`${xCoord}${yCoord}`))){ //checks if the user has already fired at that position
			if (CheckIfValueIsInNestedArray(cpuBoats, Number(`${xCoord}${yCoord}`)) && turnStatus === "player turn"){
				let tempFiredAtArr = userFiredAtTiles;
				tempFiredAtArr.push(Number(`${xCoord}${yCoord}`));
				setUserFiredAtTiles(tempFiredAtArr);
				console.log("You hit a boat!");
				
				setTurnStatus("cpu turn");
				tempTurnStatus = "cpu turn";
				setCurrentlyTargeted([1,1]);

				let tempCpuLifePoints = cpuLifePoints-1;
				setCpuLifePoints(cpuLifePoints-1);
				if(tempCpuLifePoints == 0){  //Checks if the game has finished
					setGameStatus("inactive");
					tempGameStatus = "inactive";
					console.log("Congratulations! You've won the game!");
				}
			}
			else if(gameStatus !== "active"){
				console.log("Game hasn't started yet")
			}
			else if(turnStatus !== "player turn"){
				console.log("It's not your turn");
			}
			else{
				let tempFiredAtArr = userFiredAtTiles;
				tempFiredAtArr.push(Number(`${xCoord}${yCoord}`));
				setUserFiredAtTiles(tempFiredAtArr);
				console.log("You missed!");
				setTurnStatus("cpu turn");
				tempTurnStatus = "cpu turn"
				setCurrentlyTargeted([1,1]);
			}
		}
		else {
			console.log("You already fired here, try another position!");
		}

		if(tempTurnStatus === "cpu turn" && tempGameStatus == "active"){
			CpuFireAtTarget();
		}
	}

	function CpuFireAtTarget (){ //handles CPU targeting and firing
		let cpuFireCoords = [Math.floor(Math.random() * 9) +1, Math.floor(Math.random() * 9)+1];

		while(cpuFiredAtTiles.includes(Number(`${cpuFireCoords[0]}${cpuFireCoords[1]}`))){   //checks if the cpu has already fired at that position
			cpuFireCoords = [Math.floor(Math.random() * 9) +1, Math.floor(Math.random() * 9)+1];
		}

		if (CheckIfValueIsInNestedArray(userBoats, `${cpuFireCoords[0]}${cpuFireCoords[1]}`)){
			let tempFiredAtArr = cpuFiredAtTiles;
			tempFiredAtArr.push(Number(`${cpuFireCoords[0]}${cpuFireCoords[1]}`));
			setCpuFiredAtTiles(tempFiredAtArr);
			console.log("You've been hit!");
			setTurnStatus("player turn");

			let tempPlayerLifePoints = playerLifePoints-1;
			setPlayerLifePoints(playerLifePoints-1);
			if(tempPlayerLifePoints == 0){
				setGameStatus("inactive");
				console.log("Too bad! You've lost the game!");
			}
		}
		else{
			let tempFiredAtArr = cpuFiredAtTiles;
			tempFiredAtArr.push(Number(`${cpuFireCoords[0]}${cpuFireCoords[1]}`));
			setCpuFiredAtTiles(tempFiredAtArr);
			console.log("The CPU missed!");
			setTurnStatus("player turn");
		}
	}

	return (
		<div>
			<div className="mainScreen">
				<div className="cpuSide">
					<div className="boardTitle">CPU Board</div>
					<div className="gameBoard">
						{cpuBoard.map(boardColumn => (
							boardColumn.map(tile => {
								if (tile.posClass === "centerTile"){
									return(
										<div 
											className={`
												${tile.posClass} 
												${(tile.xCoordinate == currentlyTargeted[0] && tile.yCoordinate == currentlyTargeted[1]) ? "targetedTile" : "notTargetedTile"}
												${userFiredAtTiles.includes(Number(`${tile.xCoordinate}${tile.yCoordinate}`))
												? CheckIfValueIsInNestedArray(cpuBoats, Number(`${tile.xCoordinate}${tile.yCoordinate}`))
													? "boatHit"
													: "waterHit"
												: ""	
												}
											`}
											onClick={() => handleTargeting(tile.xCoordinate, tile.yCoordinate)}
										></div>
									)
								}
								else{
									return(
										<div className={tile.posClass}>{tile.tileText}</div>
									)
								}
							})
						))}
					</div>
				</div>
				<div className="userSide">
					<div className="boardTitle">Your Board</div>
					<div className="gameBoard">
						{userBoard.map(boardColumn => (
							boardColumn.map(tile => {
								if (tile.posClass === "centerTile"){
									return(
										<div 
											className={`
												${tile.posClass}
												${CheckIfValueIsInNestedArray(userBoats, `${tile.xCoordinate}${tile.yCoordinate}`) ? "ocuppiedTile" : ""}
												${cpuFiredAtTiles.includes(Number(`${tile.xCoordinate}${tile.yCoordinate}`))
												? CheckIfValueIsInNestedArray(userBoats, `${tile.xCoordinate}${tile.yCoordinate}`)
													? "boatHit"
													: "waterHit"
												: ""
												}
											`}
										></div>
									)
								}
								else{
									return(
										<div className={tile.posClass}>{tile.tileText}</div>
									)
								}
							})
						))}
					</div>
				</div>
				<div className="controlPanelSide">
					<div>
						{numberOfBoats.map(boatNumber => (
							<div className="boatsSelection">
							<div className="boatTitle">Boat {boatNumber}</div>
							<label for="boat1" className="boatDirectionLabel">Direction</label>
							<select name="direction" id="boat1" className="boatDirectionSelection" 
							onChange={(e => {
								saveBoatInput(e.target.name, e.target.value, boatNumber);
							})}>
								<option value="up">Up</option>
								<option value="down">Down</option>
								<option value="left">Left</option>
								<option value="right">Right</option>
							</select>
							<label for="boat1" className="boatColumnLabel">Column</label>
							<select name="column" id="boat1" className="boatColumnSelection"
							onChange={(e => {
								saveBoatInput(e.target.name, e.target.value, boatNumber);
							})}>
								{boardColumns.map(column => {
									return(
										<option value={column.value}>{column.name}</option>
									)
								})}
							</select>
							<label for="boat1" className="boatRowLabel">Row</label>
							<select name="row" id="boat1" className="boatRowSelection"
							onChange={(e => {
								saveBoatInput(e.target.name, e.target.value, boatNumber);
							})}>
								{boardRows.map(column => {
									return(
										<option value={column.value}>{column.name}</option>
									)
								})}
							</select>
							<button onClick={() =>{
								sendBoatInput(boatNumber);
							}}>Create</button>
						</div>	
						))}
					</div>
					<div className="weaponsControl">
						<div>Currently targeted tile: {`${rowCoordinates[currentlyTargeted[1]-1]}${currentlyTargeted[0]}`}</div>
						<button onClick={()=> {
							UserFireAtTarget(currentlyTargeted[0], currentlyTargeted[1]);
						}}>Fire!</button>
					</div>
					<div className="gameStatus">
						<div>Your life points: {playerLifePoints}</div>
						<div>CPU life points: {cpuLifePoints}</div>
						<button onClick={() => {
							if (Object.keys(userBoats).length == 1 && gameStatus === "inactive"){ //change to 5 after testing
								addCpuBoats();
								setPlayerLifePoints(15);
								setCpuLifePoints(15);
								setTurnStatus("player turn");
								setGameStatus("active");
								console.log("It's your turn!");
							}
							else {
								console.log("You need to place all your boats first");
							}
						}}>Start game</button>
					</div>
				</div>
			</div>
			<div className="instructionsBox">
				<h5 className="warningText">Important! Must read before playing!</h5>
				<h2>Instructions</h2>
				<h4>Before the game starts:</h4>
				<ol>
					<li>Place your 5 ships on the board, each ship has a size equal to it's number. So ship 1 has a length of 1 tile, ship 2 has a length of 2, and so on.</li>
					<li>Be aware that ships can't overlap and they can't be placed out of the bounds of the board.</li>
					<li>Once all your ships are positioned, click on the "Start game" button to start.</li>
				</ol>
				<h4>How to play:</h4>
				<ol>
					<li>Select a tile on the cpu board where you want to fire by click on it, once you've done that click on the "Fire!" button to shoot. Be aware that you can't shoot again on a tile you previously fire on.</li>
					<li>If your shot hit an enemy ship, that tile will be colored red and the cpu will lose 1 life point. And if your shot missed, it will turn light blue. A message will also be displayed on the console telling you if you missed or not.</li>
					<li>After you fire the cpu will immediately shoot back. If one of your boats get hit, that tile will turn red and you will lose 1 life point, otherwhise, the tile will turn light-blue.</li>
					<li>After the cpu shoots, it will be your turn and you can fire again.</li>
				</ol>
				<h4>Important notes:</h4>
				<ul>
					<li>It's highly recommended to have the console open while playing, as all important information regarding the game status will be displayed there.</li>
					<li>The cpu currently aims randomly, so it does not take previous shots into consideration when deciding where to fire.</li>
				</ul>
			</div>
		</div>
	);
};

export default Home;

function CreateBoard () {
	let newBoard= [];
	const sideCoordinates = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

	for (let i = 0; i<11; i++){ // j is x coordinate
		let tempArray = [];
		for (let j = 0; j<11; j++){ //i is y coordinate
			if ((i == 0 || i == 10) && (j == 0 || j == 10)){
				tempArray.push({"posClass": "cornerTile", "xCoordinate": j, "yCoordinate": i, "tileText": "", "targeted": "notTargetedTile"});
			}
			else if((i == 0 || i == 10)){
				if (j == 1){
					tempArray.push({"posClass": "firstTopTile", "xCoordinate": j, "yCoordinate": i, "tileText": j, "targeted": "notTargetedTile"});
				}
				else {
					tempArray.push({"posClass": "topTile", "xCoordinate": j, "yCoordinate": i, "tileText": j, "targeted": "notTargetedTile"});
				}
			}
			else if(j == 0 || j == 10){
				if (i == 1){
					tempArray.push({"posClass": "firstSideTile", "xCoordinate": j, "yCoordinate": i, "tileText": sideCoordinates[i-1], "targeted": "notTargetedTile"});
				}
				else{
					tempArray.push({"posClass": "sideTile", "xCoordinate": j, "yCoordinate": i, "tileText": sideCoordinates[i-1], "targeted": "notTargetedTile"});
				}
			}
			else {
				tempArray.push({"posClass": "centerTile", "xCoordinate": j, "yCoordinate": i, "tileText": "", "targeted": "notTargetedTile"});
			}
		}
		newBoard.push(tempArray);
	}
	return newBoard;
}