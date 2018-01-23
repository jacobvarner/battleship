# Battleship
A browser based game built with HTML, Sass, and JavaScript.

This game was intended to be as close of a replica to the Hasbro Battleship game as possible.

### Game Play
Both players (both the user and the computer) place their ships. The computer places each of theirs randomly and then the user is prompted to choose a location and orientation for each of their 5 ships.

Players then go back and forth taking turns to fire at locations on the map. If a ship is present, then the player is awarded a hit. The goal is to hit each ship enough times to sink it and ultimately sink all 5 of the opponent's ships.

### Design Decisions
I opted to build this game based around text input instead of clicking on locations mostly because I thought it resembled the actual game more where you would audibly relay your intended location to the opponent.

The opponent does everything randomly to make it easier on the player and to make the opponent resemble a computer. This is something that could be further developed to improve the opponent's skill.

Simple timeouts and implicit calls of the following functions were used instead of more desirable async/await functionality for simplicity. Handling functions that need to be synchronous could have been done better, but with my current knowledge and time constraint, the simpler methods were used instead.

There are built in delays for the opponent's turns to give the user time to see their results as well as make it feel more like they are playing an actual opponent instead of an instantaneous computer.

### Future Improvements
1. Improve the AI of the computer to play more like a human would. For example, after the opponent gets a hit, it would search around that hit in order to try and keep hitting the same ship instead of then picking another completely random location to fire.
2. Make the game play improved on a mobile device.
3. Optimize the code and adhere to more "best practices" by using current async/await technologies.
4. Add ability to choose how the user would like to play (ie, clicking locations instead of entering into the input field).
5. Add animations and further improve the look and feel of the UI during game play.
