# F1 Scheduling
#### Rohan Verma and Arnav Aggarwal

#

## Running Instructions
1. Client (in the client folder)
> npm install

> npm start

2. Server (in the backend folder)
>npm install

>node app.js

## Constraints
1. Weather - The weather.pkl file containts daily weather for all 75 tracks. We consider perfect weather to be 25 Celsius and add a penalty of -abs(weather - 25) for each week. We convert daily weather to weekly weather by averaging the weather across that week.
2. Distance - The latitude and longitude information about each track is passed through the front end and we calculcate the distance (in miles) between two tracks using this information. For our penalty, we divide the distance by 100 (to make it comparable to other constraints) and multiply by -1 (since we're maximizing preference).
3. Audience Track Preferences - The audience track preferences range from 1-10 and are given through the front end.
4. Team Track Preferences - Each racing team ranks all 75 tracks from 1 - 75 and we assign a score of (NUMBER_OF_TRACKS - rank) to each track.

Note that we're maximzing overall preference here, however, since a globally optimum solution is a time and resource intensive process, we cap the solver solve time to 50 seconds, and first maximize the audience track + team track preference, then the weather and then the distance. Note that each optimization builds upon the last and each runs for a maximum of 50 seconds. The individual optimization also helps account for the different magnitude of variables.

## Output
A tentative schedule with day, track, weather during that day, distance traveled from the previous track to here, and an overall preference score.
