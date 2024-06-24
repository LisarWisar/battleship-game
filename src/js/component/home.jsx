import React, { useState, useEffect } from "react";

const Home = () => {

	const [userBoard, setUserBoard] = useState(CreateBoard());
	const [cpuBoard, setCpuBoard] = useState(CreateBoard());
	const [currentlyTargeted , setCurrentlyTargeted] = useState([0,0]);
	const [userBoats, setUserBoats] = useState({});
	const [cpuBoats, setCpuBoats] = useState({});

	useEffect(() => {
        addBoat(5,4,"up", 3);
      }, []);


	function handleTargeting (xCoord, yCoord){
		setCurrentlyTargeted([xCoord, yCoord]);
	}

	function addBoat (startingXCoord, startingYCoord, direction, size){
		let newBoatCoordinates = [];
		for (let i = 0; i < size; i++){
			if(direction === "up" && startingYCoord >= size && !CheckIfValueIsInNestedArray(userBoats, `${startingXCoord}${startingYCoord - i}`)){   //validates direction, prevents overflow from the board, and prevents boat overlapping
				newBoatCoordinates.push(`${startingXCoord}${startingYCoord - i}`); //add cordinates as XY instead of [X,Y] to avoid unnecesary array nesting
			}
			else if(direction === "right" && ((startingXCoord+size) <= 9) && !CheckIfValueIsInNestedArray(userBoats, `${startingXCoord+i}${startingYCoord}`)){
				newBoatCoordinates.push(`${startingXCoord + i}${startingYCoord}`);
			}
			else if(direction === "down" && ((startingYCoord+size) <= 9) && !CheckIfValueIsInNestedArray(userBoats, `${startingXCoord}${startingYCoord+i}`)){
				newBoatCoordinates.push(`${startingXCoord}${startingYCoord + i}`);
			}
			else if(direction === "left" && startingXCoord >= size && !CheckIfValueIsInNestedArray(userBoats, `${startingXCoord-i}${startingYCoord}`)){
				newBoatCoordinates.push(`${startingXCoord - i}${startingYCoord}`);
			}
			else {
				return ("not ok");
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

	return (
		<div className="mainScreen">
			<div className="cpuSide">
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
				tempArray.push({"key": `${i}${j}`, "posClass": "cornerTile", "xCoordinate": j, "yCoordinate": i, "tileText": "", "ocuppied": false, "targeted": "notTargetedTile", "wasShotAt": false});
			}
			else if((i == 0 || i == 10)){
				if (j == 1){
					tempArray.push({"key": `${i}${j}`,"posClass": "firstTopTile", "xCoordinate": j, "yCoordinate": i, "tileText": j, "ocuppied": false, "targeted": "notTargetedTile", "wasShotAt": false});
				}
				else {
					tempArray.push({"key": `${i}${j}`,"posClass": "topTile", "xCoordinate": j, "yCoordinate": i, "tileText": j, "ocuppied": false, "targeted": "notTargetedTile", "wasShotAt": false});
				}
			}
			else if(j == 0 || j == 10){
				if (i == 1){
					tempArray.push({"key": `${i}${j}`,"posClass": "firstSideTile", "xCoordinate": j, "yCoordinate": i, "tileText": sideCoordinates[i-1], "ocuppied": false, "targeted": "notTargetedTile", "wasShotAt": false});
				}
				else{
					tempArray.push({"key": `${i}${j}`,"posClass": "sideTile", "xCoordinate": j, "yCoordinate": i, "tileText": sideCoordinates[i-1], "ocuppied": false, "targeted": "notTargetedTile", "wasShotAt": false});
				}
			}
			else {
				tempArray.push({"key": `${i}${j}`,"posClass": "centerTile", "xCoordinate": j, "yCoordinate": i, "tileText": "", "ocuppied": false, "targeted": "notTargetedTile", "wasShotAt": false});
			}
		}
		newBoard.push(tempArray);
	}
	return newBoard;
}