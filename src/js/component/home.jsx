import React from "react";

const Home = () => {

	let userTiles = [];
	const sideCoordinates = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
	for (let i = 0; i<11; i++){
		let tempArray = [];
		for (let j = 0; j<11; j++){
			if ((i == 0 || i == 10) && (j == 0 || j == 10)){
				tempArray.push({"posClass": "cornerTile", "xCoordinate": i, "yCoordinate": j, "tileText": ""});
			}
			else if((i == 0 || i == 10)){
				if (j == 1){
					tempArray.push({"posClass": "firstTopTile", "xCoordinate": i, "yCoordinate": j, "tileText": j});
				}
				else {
					tempArray.push({"posClass": "topTile", "xCoordinate": i, "yCoordinate": j, "tileText": j});
				}
			}
			else if(j == 0 || j == 10){
				if (i == 1){
					tempArray.push({"posClass": "firstSideTile", "xCoordinate": i, "yCoordinate": j, "tileText": sideCoordinates[i-1]});
				}
				else{
					tempArray.push({"posClass": "sideTile", "xCoordinate": i, "yCoordinate": j, "tileText": sideCoordinates[i-1]});
				}
			}
			else {
				tempArray.push({"posClass": "centerTile", "xCoordinate": i, "yCoordinate": j, "tileText": ""});
			}
		}
		userTiles.push(tempArray);
	}

	return (
		<div className="gameBoard">
			{userTiles.map(boardColumn => (
				boardColumn.map(tile => (
					<div className={tile.posClass}>{tile.tileText}</div>
				))
			))}
		</div>
	);
};

export default Home;
