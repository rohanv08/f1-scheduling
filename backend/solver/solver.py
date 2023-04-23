import sys
from ortools.sat.python import cp_model
import random
import pickle
import pandas as pd
from geopy.distance import geodesic


MAX_RUNTIME = 120
INT_MIN = -10000
INT_MAX = 10000
#Constants to be filled from front-end/weather from file
NUMBER_OF_RACES = 10
START_WEEK = 1
END_WEEK = START_WEEK + NUMBER_OF_RACES
NUMBER_OF_TEAMS = 10
OPTIMUM_WEATHER = 23


teams = [f'team-{i}' for i in range(NUMBER_OF_TEAMS)]

#Weather
temp = pickle.load(open('./solver/weather.pkl', 'rb'))
tracks = list(temp.keys())
weather = {}
for key, value in temp.items():
    weather[key] = [-abs(int(i) - OPTIMUM_WEATHER) for i in value]
####
lat_lng = pd.read_csv('./solver/circuits.csv')
lat_lng = lat_lng[['location', 'lat', 'lng']]
lat_lng = lat_lng.drop_duplicates(subset='location')

print("Solving")

tt_preference = {}
at_preference = {}
for i in range(len(teams)):
    tt_preference[teams[i]] = [random.randint(1,10) for j in range(len(tracks))]

for i in tracks:
    at_preference[i] = random.randint(1,10)


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
                    temp = -int(geodesic((lat_lng[lat_lng['location'] == i]['lat'].item(), lat_lng[lat_lng['location'] == i]['lng'].item()), (lat_lng[lat_lng['location'] == j]['lat'].item(), lat_lng[lat_lng['location'] == j]['lng'].item())).miles/100)
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
        distances = self.distances
        tracks_chosen = self.tracks_chosen
        weather_score = self.weather_score
        tt_preference_list = self.tt_preference_list
        tracks_day = self.tracks_day
        score_tracks = [model.NewIntVar(0, INT_MAX, f'score-track-{i}') for i in range(len(tracks))]
        weather_total_pref = 0
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

        for i in range(len(tracks)):
            t_pref = sum([tt_preference_list[j][i] for j in self.team_names]) + self.at_preference_list[self.track_names[i]]
            w_pref = model.NewIntVar(INT_MIN, INT_MAX, f'pref for w {i}')
            model.Add(w_pref == weather_score[i]).OnlyEnforceIf(tracks_chosen[i])
            model.Add(w_pref == 0).OnlyEnforceIf(tracks_chosen[i].Not())
            model.Add(score_tracks[i] == t_pref).OnlyEnforceIf(tracks_chosen[i])
            model.Add(score_tracks[i] == 0).OnlyEnforceIf(tracks_chosen[i].Not())
            weather_total_pref += w_pref 

        model.Maximize(sum(score_tracks) + weather_total_pref + distance_total_pref)
            

    def solve(self):
        self.model = cp_model.CpModel()
        self.solver = cp_model.CpSolver()
        self.create_variables()
        self.add_track_preferences()
        self.add_weather_score()
        self.score_and_maximize()
        self.solver.parameters.max_time_in_seconds = MAX_RUNTIME
        output = self.solver.Solve(self.model)
        print(output)
        if (output == cp_model.OPTIMAL or output == cp_model.FEASIBLE):
            soln = [(self.track_names[v], self.solver.Value(self.tracks_day[v]), self.weather_list[self.track_names[v]][self.solver.Value(self.tracks_day[v])] + OPTIMUM_WEATHER, 0 if v == len(self.track_names) -1 else 
                     self.distances[self.track_names[v]][self.track_names[v+1]]*-100) for v in range(len(self.track_names)) if self.solver.Value(self.tracks_chosen[v]) == 1] 
            obj_val = self.solver.ObjectiveValue()
            soln.sort(key=lambda a: a[1])
            return soln, obj_val
        else:
            raise ValueError('Not possible!')


scheduler = Scheduler(tracks, teams, tt_preference, at_preference, weather)
print(scheduler.solve())
sys.stdout.flush()
