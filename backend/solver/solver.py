import sys
from ortools.sat.python import cp_model
import random
import pickle
import pandas as pd
from geopy.distance import geodesic
import sys
import json
import os
print("solving")
CURR_PATH = os.path.dirname(os.path.abspath(__file__))
MAX_RUNTIME = 50
INT_MIN = -100000
INT_MAX = 100000
NUMBER_OF_RACES = int(sys.argv[2])if len(sys.argv) >= 3 else 15
START_WEEK = int(sys.argv[1]) if len(sys.argv) >= 2 else 25
END_WEEK = START_WEEK + NUMBER_OF_RACES - 1
OPTIMUM_WEATHER = 25

with open(f'{CURR_PATH}/tt_preferences.json', 'r') as j:
        tt_preference_raw = json.loads(j.read())

with open(f'{CURR_PATH}/teams.json', 'r') as j:
    teams_raw = json.loads(j.read())

with open(f'{CURR_PATH}/at_preferences.json', 'r') as j:
    at_preference_raw = json.loads(j.read())

NUMBER_OF_TRACKS = len(at_preference_raw)

teams = ['temp']*len(teams_raw)
for i in teams_raw:
    teams[i['value']] = i['label']

tracks = list(tt_preference_raw[0])

tt_preference = {}
at_preference = {}
lat_lng = {}
print("solving")

for i in range(len(tt_preference_raw)):
    tt_preference[teams[i]] = [0]*NUMBER_OF_TRACKS
    for j in range(NUMBER_OF_TRACKS):
        tt_preference[teams[i]][tracks.index(tt_preference_raw[i][j])] = NUMBER_OF_TRACKS - j

for i in at_preference_raw.keys():
    at_preference[i] = at_preference_raw[i]['pref']
    lat_lng[i] = {'lat': at_preference_raw[i]['lat'], 'lng': at_preference_raw[i]['lng']}


weather_raw_temp = pickle.load(open(f'{CURR_PATH}/weather.pkl', 'rb'))

weather = {}
weather_raw = {}
for key, value in weather_raw_temp.items():
    weather[key] = []
    weather_raw[key]= []
    for i in range(1, 53):
        avg = sum(value[(i-1)*7:i*7])/7
        weather[key].append(-abs(int(avg) - OPTIMUM_WEATHER))
        weather_raw[key].append(avg)
    



# Solver
class Scheduler:
    def __init__(self, tracks, teams, tt_preference, at_preference, weather) -> None:
        self.track_names = tracks
        self.team_names = teams
        self.tt_preference_list = tt_preference
        self.at_preference_list = at_preference
        self.weather_list = weather
    

    def create_variables(self):
        model: cp_model.CpModel = self.model
        tt_preference_list = self.tt_preference_list
        at_preference_list = self.at_preference_list
        tt_preference = {}
        at_preference = {}
        distances = {}
        for i in self.team_names:
            tt_preference[i] = [model.NewIntVar(j, j, f'team-{i} track-{j}') for j in tt_preference_list[i]]
        for i in self.track_names:
            at_preference[i] = model.NewIntVar(at_preference_list[i], at_preference_list[i], f'audience track-{i}')
        for i in self.track_names:
            distances[i] = {}
            for j in self.track_names:
                if j != i:
                    temp = -int(geodesic((lat_lng[i]['lat'], lat_lng[i]['lng']), (lat_lng[j]['lat'], lat_lng[j]['lng'])).miles/100)
                    distances[i][j] = temp

        self.tt_preference = tt_preference
        self.at_preference = at_preference
        self.distances = distances
            
    def add_weather_score(self):
        weather_list = self.weather_list
        weather_score = []
        tracks_chosen = self.tracks_chosen
        tracks_day = self.tracks_day
        model = self.model
        for i in range(len(self.track_names)):
            weather_score.append(model.NewIntVar(INT_MIN, INT_MAX, f'weather-score-track-{i}'))
            model.AddElement(tracks_day[i], weather_list[self.track_names[i]], weather_score[i])
        self.weather_score = weather_score
        

    def add_distance_preferences(self):
        model = self.model
        distances = self.distances
        tracks_chosen = self.tracks_chosen
        tracks_day = self.tracks_day
        distance_total_pref = 0
        for i in range(len(tracks)):
            for j in range(i+1, len(tracks)):
                d_pref = model.NewIntVar(INT_MIN, INT_MAX, f'dist-pref {i}')
                consec_bool = model.NewBoolVar(f'bool consec - {i}-{j}')
                abs = model.NewIntVar(0, INT_MAX, f'abs-{i}-{j}')
                var = model.NewIntVar(INT_MIN, INT_MAX, f'temppp -{i} - {j}')
                model.Add(var == tracks_day[i] - tracks_day[j])
                model.AddAbsEquality(abs, var)
                model.Add(abs == 1).OnlyEnforceIf(consec_bool)
                model.Add(abs != 1).OnlyEnforceIf(consec_bool.Not())
                anding = model.NewBoolVar(f'dist-pref-andw tracks {i} -{j}')
                model.AddBoolAnd([tracks_chosen[i], tracks_chosen[j], consec_bool]).OnlyEnforceIf(anding)
                model.AddBoolOr([tracks_chosen[i].Not(), tracks_chosen[j].Not(), consec_bool.Not()]).OnlyEnforceIf(anding.Not())
                model.Add(d_pref == distances[tracks[i]][tracks[j]]).OnlyEnforceIf(anding)
                model.Add(d_pref == 0).OnlyEnforceIf(anding.Not())
                distance_total_pref += d_pref
                
        self.distance_total_pref = distance_total_pref


    def add_track_preferences(self):
        tracks_day = []
        model: cp_model.CpModel = self.model
        tracks_chosen = []
        for i in range(len(self.track_names)):
            tracks_chosen.append(model.NewBoolVar(f'track-{i}'))
            tracks_day.append(model.NewIntVar(START_WEEK - 1, END_WEEK, f'track-day-{i}'))
            model.Add(tracks_day[i] >= START_WEEK).OnlyEnforceIf(tracks_chosen[i])
            model.Add(tracks_day[i] == START_WEEK - 1).OnlyEnforceIf(tracks_chosen[i].Not())
        
        for i in range(len(self.track_names)):
            for j in range(i+1, len(self.track_names)):
                anding = model.NewBoolVar(f'no same track {i}-{j}')
                model.AddBoolAnd([tracks_chosen[i], tracks_chosen[j]]).OnlyEnforceIf(anding)
                model.AddBoolOr([tracks_chosen[i].Not(), tracks_chosen[j].Not()]).OnlyEnforceIf(anding.Not())
                model.Add(tracks_day[i] != tracks_day[j]).OnlyEnforceIf(anding)

        model.Add(sum(tracks_chosen) == NUMBER_OF_RACES)
        self.tracks_chosen = tracks_chosen
        self.tracks_day = tracks_day
        


    def score_and_maximize(self):
        tracks = self.track_names
        model = self.model
        distance_total_pref = self.distance_total_pref
        tracks_chosen = self.tracks_chosen
        weather_score = self.weather_score
        tt_preference_list = self.tt_preference_list
        solver = self.solver
        score_tracks_team = [model.NewIntVar(0, INT_MAX, f'score-track-team-{i}') for i in range(len(tracks))]
        score_tracks_audience = [model.NewIntVar(0, INT_MAX, f'score-track-audience-{i}') for i in range(len(tracks))]
        weather_total_pref = 0
        for i in range(len(tracks)):
            t_pref = sum([tt_preference_list[j][i] for j in self.team_names])
            a_pref = self.at_preference_list[self.track_names[i]]
            w_pref = model.NewIntVar(INT_MIN, INT_MAX, f'pref for w {i}')
            model.Add(w_pref == weather_score[i]).OnlyEnforceIf(tracks_chosen[i])
            model.Add(w_pref == 0).OnlyEnforceIf(tracks_chosen[i].Not())
            model.Add(score_tracks_team[i] == t_pref).OnlyEnforceIf(tracks_chosen[i])
            model.Add(score_tracks_team[i] == 0).OnlyEnforceIf(tracks_chosen[i].Not())
            model.Add(score_tracks_audience[i] == a_pref).OnlyEnforceIf(tracks_chosen[i])
            model.Add(score_tracks_audience[i] == 0).OnlyEnforceIf(tracks_chosen[i].Not())
            weather_total_pref += w_pref 
        
        self.weather_total_pref = weather_total_pref
        self.score_tracks_team = score_tracks_team
        self.score_tracks_audience = score_tracks_audience
            

    def solve(self):
        self.model = cp_model.CpModel()
        self.solver = cp_model.CpSolver()
        self.solver.parameters.max_time_in_seconds = MAX_RUNTIME
        self.create_variables()
        self.add_track_preferences()
        self.add_weather_score()
        self.add_distance_preferences()
        self.score_and_maximize()
        score_tracks_team = self.score_tracks_team
        score_tracks_audience = self.score_tracks_audience
        weather_total_pref = self.weather_total_pref
        distance_total_pref = self.distance_total_pref
        soln = {}
        score = 0

        self.model.Maximize(sum(score_tracks_audience))
        self.solver.Solve(self.model)
        score += self.solver.ObjectiveValue()
        print(score)
        self.model.Add(sum(score_tracks_audience) >= int(self.solver.Value(sum(score_tracks_audience))*0.8))

        self.model.Maximize(sum(score_tracks_team))
        self.solver.Solve(self.model)
        score += self.solver.ObjectiveValue()
        print(score)
        self.model.Add(sum(score_tracks_team) >= self.solver.Value(sum(score_tracks_team)))

        
        self.model.Maximize(weather_total_pref)
        self.solver.Solve(self.model)
        score += self.solver.ObjectiveValue()
        print(score)
        self.model.Add(weather_total_pref >= self.solver.Value(weather_total_pref))

        self.model.Maximize(distance_total_pref)
        output = self.solver.Solve(self.model)
        print(output)
        print(self.solver.ObjectiveValue())
        
        if (output == cp_model.OPTIMAL or output == cp_model.FEASIBLE):
            for v in range(len(self.track_names)):
                if self.solver.Value(self.tracks_chosen[v]) == 1:
                    soln[self.solver.Value(self.tracks_day[v])] = {"track": self.track_names[v], "weather": weather_raw[self.track_names[v]][self.solver.Value(self.tracks_day[v])]}
            keys = sorted(list(soln.keys()))
            for i in range(1, len(keys)):
                soln[keys[i]]['distance'] = self.distances[soln[keys[i]]['track']][soln[keys[i-1]]['track']]*-100
            for i in range(1, 53):
                if i not in keys:
                    soln[i] = {}
            soln["Score"] = self.solver.ObjectiveValue() + score
            with open(f'{CURR_PATH}/solution.json', 'w') as fp:
                json.dump(soln, fp)
            print("Solution written to file!")
        else:
            print("Not Possible or too little time")
            exit(1)


scheduler = Scheduler(tracks, teams, tt_preference, at_preference, weather)
scheduler.solve()
sys.stdout.flush()
exit(0)

