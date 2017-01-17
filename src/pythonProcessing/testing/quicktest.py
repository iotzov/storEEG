import pprint
import storEEG

a1= storEEG.Event()
a2= storEEG.Contact()
a3= storEEG.Experimenter()
a4= storEEG.License()
a5= storEEG.Publication()
a6= storEEG.Recording()
a7= storEEG.RecordingParameters()
a8= storEEG.Stimulus()
a9= storEEG.Subject()

l = [a1, a2, a3, a4, a5, a6, a7, a8, a9]
loads = ['Event','Contact','Experimenter','License','Publication','Recording','RecordingParameters','Stimulus','Subject']
for i in range(len(loads)):
    l[i].loadFromJSON(loads[i])
    print(l[i].validateSelf())

#for item in l:
#    item.inputAll()
#    item.writeToJSON(item.__class__.__name__)

p = pprint.PrettyPrinter()

props = ('events', 'contacts', 'experimenters', 'license', 'publications', 'recordings', 'RecordingParameters', 'stimuli', 'subjects')
s = storEEG.Study()
d = dict(zip(props, l))

for key in d.keys():
    if 'license' not in key:
        d[key] = [d[key]]
print(d)

#p.pprint(dict(zip(props, l)))
s.fillFromDict(d)
print(s.validateStudy())
#for key in

#d = {'stimulusID': 'somethin', 'startTrigger': 233, 'endTrigger': 238, 'eventID': 'some event ID', 'eventDescription': 'some description'}
#a.updateFromDict(d)
