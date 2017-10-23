import os
import sys
import json
import mne

mne.set_log_level('CRITICAL')

rec_uuid = sys.argv[1]

studies = json.load(open('studies.json'))

recordings = list()

for elm in studies:
    recordings.extend(elm['recordings'])

recording = next((item for item in recordings if item['uuid'] == rec_uuid), None)

data = mne.io.read_raw_edf(recording['file'])
locs = mne.channels.read_montage('biosemi64')

origNames = data.info['ch_names']

newNames = locs.ch_names
newNames = newNames[0:64]

data.rename_channels(dict(zip(origNames, newNames)))

data.set_montage(locs)
data.plot_sensors()

scalings = dict(eeg=35e-6)
color = dict(eeg='midnightblue')


data.plot(block=True, scalings=scalings, color=color)
