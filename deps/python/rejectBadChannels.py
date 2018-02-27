import mne.io as mio
from glob import glob

badChannels = dict()

for file in glob('*.bdf'):

    tmp = mio.read_raw_edf(file)
    tmp.plot(block=True)

    badChannels[file] = tmp.info['bads']

print(badChannels)
