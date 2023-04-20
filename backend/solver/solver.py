import sys
from ortools.sat.python import cp_model
import random
import pickle


#Constants to be filled from front-end/weather from file
start_date = 90
end_date = 270
number_of_races = 20
number_of_teams = 20
teams = [f'team-{i}' for i in range(number_of_teams)]
weather = pickle.load(open('weather.pkl', 'wb'))
tracks = weather.keys()
tt_preference = {}
at_preference = {}

for i in range(len(teams)):
    tt_preference[teams[i]] = [random.randint(1,10) for j in range(len(tracks))]

for i in tracks:
    at_preference[i] = random.randint(1,10)


# Solver

class Scheduler:
    def __init__(self, start_date, end_date, tracks, teams, tt_preference, at_preference, weather) -> None:
        self.start_date = start_date
        self.end_date = end_date
        self.track_names = tracks
        self.team_names = teams
        self.tt_preference_list = tt_preference
        self.at_preference_list = at_preference
        self.weather_list = weather
    
    def create_variables(self):
        model: cp_model.CpModel = self.model
        tt_preference_list = self.tt_preference_list
        at_preference_list = self.at_preference_list
        weather_list = self.weather_list
        tt_preference = {}
        at_preference = {}
        weather = {}
        for i in self.team_names:
            tt_preference[i] = [model.NewIntVar(j, j, f'team-{i} track-{j}') for j in tt_preference_list[i]]
        for i in self.track_names:
            at_preference[i] = model.NewIntVar(at_preference_list[i], at_preference_list[i], f'audience track-{i}')
            weather[i] = [model.NewIntVar(weather_list[i][j], weather_list[i][j], f'weather-{i}-{j}') for j in range(len(weather_list[i]))]
        self.tt_preference = tt_preference
        self.at_preference = at_preference
        self.weather = weather
            
    def add_weather_score(self):
        weather_list = self.weather_list
        weather_score = []
        tracks_chosen = self.tracks_chosen
        tracks_day = self.tracks_day
        model = self.model
        for i in range(len(self.track_names)):
            weather_score.append(model.NewIntVar(-1000, 1000, f'weather-score-track-{i}'))
            model.AddElement(tracks_day[i], weather_list[self.track_names[i]], weather_score[i])
        self.weather_score = weather_score
        

    def add_track_preferences(self):
        tracks_day = []
        model: cp_model.CpModel = self.model
        tracks_chosen = []
        for i in range(len(self.track_names)):
            tracks_chosen.append(model.NewBoolVar(f'track-{i}'))
            tracks_day.append(model.NewIntVar(start_date - 1, end_date, f'track-day-{i}'))
            model.Add(tracks_day[i] >= start_date).OnlyEnforceIf(tracks_chosen[i])
            model.Add(tracks_day[i] == start_date - 1).OnlyEnforceIf(tracks_chosen[i].Not())
        
        for i in range(len(self.track_names)):
            for j in range(i+1, len(self.track_names)):
                model.Add(tracks_day[i] != tracks_day[j]).OnlyEnforceIf(tracks_chosen[i])
                model.Add(tracks_day[i] != tracks_day[j]).OnlyEnforceIf(tracks_chosen[j])

        model.Add(sum(tracks_chosen) == number_of_races)
        self.tracks_chosen = tracks_chosen
        self.tracks_day = tracks_day



    def score_and_maximize(self):
        tracks = self.track_names
        model = self.model
        tracks_chosen = self.tracks_chosen
        weather_score = self.weather_score
        tt_preference_list = self.tt_preference_list
        score_tracks = [model.NewIntVar(0, cp_model.INT32_MAX, f'score-track-{i}') for i in range(len(tracks))]
        weather_total_pref = 0
        for i in range(len(tracks)):
            t_pref = sum([tt_preference_list[j][i] for j in self.team_names]) + self.at_preference_list[self.track_names[i]]
            w_pref = model.NewIntVar(-1000, 100, f'pref for w {i}')
            model.Add(w_pref == weather_score[i]).OnlyEnforceIf(tracks_chosen[i])
            model.Add(w_pref == 0).OnlyEnforceIf(tracks_chosen[i].Not())
            model.Add(score_tracks[i] == t_pref).OnlyEnforceIf(tracks_chosen[i])
            model.Add(score_tracks[i] == 0).OnlyEnforceIf(tracks_chosen[i].Not())
            weather_total_pref += w_pref 
        model.Maximize(sum(score_tracks) + weather_total_pref)
            

    def solve(self):
        self.model = cp_model.CpModel()
        self.solver = cp_model.CpSolver()
        self.create_variables()
        self.add_track_preferences()
        self.add_weather_score()
        self.score_and_maximize()
        output = self.solver.Solve(self.model)
        if (output == cp_model.OPTIMAL or output == cp_model.FEASIBLE):
            soln = [(self.track_names[v], self.solver.Value(self.tracks_day[v])) for v in range(len(self.track_names)) if self.solver.Value(self.tracks_chosen[v]) == 1] 
            obj_val = self.solver.ObjectiveValue()
            soln.sort(key=lambda a: a[1])
            return soln, obj_val
        else:
            raise ValueError('Not possible!')


scheduler = Scheduler(start_date, end_date, tracks, teams, tt_preference, at_preference, weather)
print(scheduler.solve())

#print(weather)


#print("testing executing through node " + sys.argv[1])
#print("sending data back")
#sys.stdout.flush()
