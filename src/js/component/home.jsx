import React, { useState, useEffect } from "react";

const Home = () => {

	const [userBoard, setUserBoard] = useState(CreateBoard());
	const [cpuBoard, setCpuBoard] = useState(CreateBoard());
	const [currentlyTargeted , setCurrentlyTargeted] = useState([0,0]);

	function handleTargeting (xCoord, yCoord){
		setCurrentlyTargeted([xCoord, yCoord]);
	}

	return (
		<div className="gameBoard">
			{userBoard.map(boardColumn => (
				boardColumn.map(tile => {
					if (tile.posClass === "centerTile"){
						return(
							<div 
								key={tile.key}
								className={`
									${tile.posClass} 
									${(tile.xCoordinate == currentlyTargeted[0] && tile.yCoordinate == currentlyTargeted[1]) ? "targetedTile" : "notTargetedTile"}`
								}
								onClick={() => handleTargeting(tile.xCoordinate, tile.yCoordinate)}
							>{tile.tileText}</div>
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
	);
};

export default Home;

function CreateBoard () {
	let newBoard= [];
	const sideCoordinates = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

	for (let i = 0; i<11; i++){ // i is x coordinate
		let tempArray = [];
		for (let j = 0; j<11; j++){ //j is y coordinate
			if ((i == 0 || i == 10) && (j == 0 || j == 10)){
				tempArray.push({"key": `${i}${j}`, "posClass": "cornerTile", "xCoordinate": i, "yCoordinate": j, "tileText": "", "ocuppied": false, "targeted": "notTargetedTile", "wasShotAt": false});
			}
			else if((i == 0 || i == 10)){
				if (j == 1){
					tempArray.push({"key": `${i}${j}`,"posClass": "firstTopTile", "xCoordinate": i, "yCoordinate": j, "tileText": j, "ocuppied": false, "targeted": "notTargetedTile", "wasShotAt": false});
				}
				else {
					tempArray.push({"key": `${i}${j}`,"posClass": "topTile", "xCoordinate": i, "yCoordinate": j, "tileText": j, "ocuppied": false, "targeted": "notTargetedTile", "wasShotAt": false});
				}
			}
			else if(j == 0 || j == 10){
				if (i == 1){
					tempArray.push({"key": `${i}${j}`,"posClass": "firstSideTile", "xCoordinate": i, "yCoordinate": j, "tileText": sideCoordinates[i-1], "ocuppied": false, "targeted": "notTargetedTile", "wasShotAt": false});
				}
				else{
					tempArray.push({"key": `${i}${j}`,"posClass": "sideTile", "xCoordinate": i, "yCoordinate": j, "tileText": sideCoordinates[i-1], "ocuppied": false, "targeted": "notTargetedTile", "wasShotAt": false});
				}
			}
			else {
				tempArray.push({"key": `${i}${j}`,"posClass": "centerTile", "xCoordinate": i, "yCoordinate": j, "tileText": "", "ocuppied": false, "targeted": "notTargetedTile", "wasShotAt": false});
			}
		}
		newBoard.push(tempArray);
	}
	return newBoard;
}