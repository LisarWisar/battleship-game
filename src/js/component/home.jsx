import React, { useState, useEffect } from "react";

const Home = () => {

	const [userBoard, setUserBoard] = useState(CreateBoard());
	const [cpuBoard, setCpuBoard] = useState(CreateBoard());
	const [currentlyTargeted , setCurrentlyTargeted] = useState([0,0]);
	const [boat1, setBoat1] = useState({"column": 1, "row": 1, "direction": "up"});
	const [boat2, setBoat2] = useState({"column": 1, "row": 1, "direction": "up"});
	const [boat3, setBoat3] = useState({"column": 1, "row": 1, "direction": "up"});
	const [boat4, setBoat4] = useState({"column": 1, "row": 1, "direction": "up"});
	const [boat5, setBoat5] = useState({"column": 1, "row": 1, "direction": "up"});
	const [userBoats, setUserBoats] = useState({});
	const [cpuBoats, setCpuBoats] = useState({});
	const [boardColumns, setBoardColumns] = useState([{},{},{},{},{}]);
	const [boardRows, setBoardRows] = useState([]);
	const [numberOfBoats, setNumberOfBoats] = useState([1,2,3,4,5]);

	useEffect(() => {
        defineColumns();
		defineRows();
      }, []);
	
	function defineColumns () {
		let tempArr = []
		for (let i = 1; i <10; i++){
			tempArr.push({name: i, value: i})
		}
		setBoardColumns(tempArr);
	}

	function defineRows () {
		let tempArr = []
		const rowCoordinates = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
		for (let i = 1; i <10; i++){
			tempArr.push({name: rowCoordinates[i-1], value: i})
		}
		setBoardRows(tempArr);
	}


	function handleTargeting (xCoord, yCoord){
		setCurrentlyTargeted([xCoord, yCoord]);
	}

	function addUserBoat (startingXCoord, startingYCoord, direction, size){
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
			console.log(userBoats);
			console.log(tempCoords);
			if(CheckIfValueIsInNestedArray(userBoats, tempCoords[i])){
				newBoatCoordinates = []
				console.log("Boats can't overlap");
			}
		}

		setUserBoats(prevState => ({
			...prevState,
			[size]: newBoatCoordinates //uses size as id as both are unique and the same in this game
		}));
		return "ok";
	}

	function CheckIfValueIsInNestedArray (obj, valueToFind){
		let result = false;
		let objPosition = 0;
		while(result === false && objPosition < Object.values(obj).length){
			result = Object.values(obj)[objPosition].includes(valueToFind);
			objPosition = objPosition +1;
		}
		return result;
	}

	function saveBoatInput (name, value, boatNumber) {
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

	function sendBoatInput (boatNumber){
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

	return (
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
											${(tile.xCoordinate == currentlyTargeted[0] && tile.yCoordinate == currentlyTargeted[1]) ? "targetedTile" : "notTargetedTile"}`
										}
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
				tempArray.push({"posClass": "cornerTile", "xCoordinate": j, "yCoordinate": i, "tileText": "", "ocuppied": false, "targeted": "notTargetedTile", "wasShotAt": false});
			}
			else if((i == 0 || i == 10)){
				if (j == 1){
					tempArray.push({"posClass": "firstTopTile", "xCoordinate": j, "yCoordinate": i, "tileText": j, "ocuppied": false, "targeted": "notTargetedTile", "wasShotAt": false});
				}
				else {
					tempArray.push({"posClass": "topTile", "xCoordinate": j, "yCoordinate": i, "tileText": j, "ocuppied": false, "targeted": "notTargetedTile", "wasShotAt": false});
				}
			}
			else if(j == 0 || j == 10){
				if (i == 1){
					tempArray.push({"posClass": "firstSideTile", "xCoordinate": j, "yCoordinate": i, "tileText": sideCoordinates[i-1], "ocuppied": false, "targeted": "notTargetedTile", "wasShotAt": false});
				}
				else{
					tempArray.push({"posClass": "sideTile", "xCoordinate": j, "yCoordinate": i, "tileText": sideCoordinates[i-1], "ocuppied": false, "targeted": "notTargetedTile", "wasShotAt": false});
				}
			}
			else {
				tempArray.push({"posClass": "centerTile", "xCoordinate": j, "yCoordinate": i, "tileText": "", "ocuppied": false, "targeted": "notTargetedTile", "wasShotAt": false});
			}
		}
		newBoard.push(tempArray);
	}
	return newBoard;
}