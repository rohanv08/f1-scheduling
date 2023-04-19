import sys
from ortools.sat.python import cp_model
import random
#Constants to be filled from front-end
start_date = 1
end_date = 30
number_of_races = 15
number_of_tracks = 100
number_of_teams = 10
tracks = [f'track-{i}' for i in range(number_of_tracks)]
teams = [f'team-{i}' for i in range(number_of_teams)]
tt_preference = {}
at_preference = {}

for i in range(len(teams)):
    tt_preference[teams[i]] = [random.randint(1,10) for j in range(len(tracks))]

for i in range(len(tracks)):
    at_preference[tracks[i]] = random.randint(1,10)


class Scheduler:
    def __init__(self, start_date, end_date, tracks, teams, tt_preference, at_preference) -> None:
        self.start_date = start_date
        self.end_date = end_date
        self.track_names = tracks
        self.team_names = teams
        self.tt_preference_list = tt_preference
        self.at_preference_list = at_preference
    
    def create_variables(self):
        model: cp_model.CpModel = self.model
        tt_preference_list = self.tt_preference_list
        at_preference_list = self.at_preference_list
        tt_preference = {}
        at_preference = {}
        for i in self.team_names:
            tt_preference[i] = [model.NewIntVar(j, j, f'team-{i} track-{j}') for j in tt_preference_list[i]]
        for i in self.track_names:
            at_preference[i] = model.NewIntVar(at_preference_list[i], at_preference_list[i], f'audience track-{i}')
        self.tt_preference = tt_preference
        self.at_preference = at_preference
            
    def add_weather_score():
        pass

    def add_track_preferences(self):
        tracks_day = []
        model: cp_model.CpModel = self.model
        tracks_chosen = []
        for i in range(len(self.track_names)):
            tracks_chosen.append(model.NewBoolVar(f'track-{i}'))
            tracks_day.append(model.NewIntVar(0, end_date, f'track-day-{i}'))
            model.Add(tracks_day[i] > 0).OnlyEnforceIf(tracks_chosen[i])
            model.Add(tracks_day[i] == 0).OnlyEnforceIf(tracks_chosen[i].Not())
        
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
        tt_preference_list = self.tt_preference_list
        score_tracks = [model.NewIntVar(0, cp_model.INT32_MAX, f'score-track-{i}') for i in range(len(tracks))]
        for i in range(len(tracks)):
            t_pref = sum([tt_preference_list[j][i] for j in self.team_names]) + self.at_preference_list[self.track_names[i]]
            model.Add(score_tracks[i] == t_pref).OnlyEnforceIf(tracks_chosen[i])
            model.Add(score_tracks[i] == 0).OnlyEnforceIf(tracks_chosen[i].Not())
        model.Maximize(sum(score_tracks))
            

    def solve(self):
        self.model = cp_model.CpModel()
        self.solver = cp_model.CpSolver()
        self.create_variables()
        self.add_track_preferences()
        self.score_and_maximize()
        if (self.solver.Solve(self.model) == cp_model.OPTIMAL):
            return [(v, self.solver.Value(self.tracks_day[v])) for v in range(len(self.track_names)) if self.solver.Value(self.tracks_chosen[v]) == 1], self.solver.ObjectiveValue()
        else:
            raise ValueError('Not possible!')


scheduler = Scheduler(start_date, end_date, tracks, teams, tt_preference, at_preference)
print(scheduler.solve())




#print("testing executing through node " + sys.argv[1])
#print("sending data back")
#sys.stdout.flush()
