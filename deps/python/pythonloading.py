import mne

eogchannels = ['EXG1','EXG2','EXG3','EXG4','EXG5','EXG6','EXG7','EXG8']
rejectchannels = ['C1','C2','C3','C4','C5','C6','C7','C8','C9','C10','C11','C12','C13','C14','C15','C16','C17','C18','C19','C20','C21','C22','C23','C24','C25','C26','C27','C28','C29','C30','C31','C32','D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12','D13','D14','D15','D16','D17','D18','D19','D20','D21','D22','D23','D24','D25','D26','D27','D28','D29','D30','D31','D32','E1','E2','E3','E4','E5','E6','E7','E8','E9','E10','E11','E12','E13','E14','E15','E16','E17','E18','E19','E20','E21','E22','E23','E24','E25','E26','E27','E28','E29','E30','E31','E32','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','F13','F14','F15','F16','F17','F18','F19','F20','F21','F22','F23','F24','F25','F26','F27','F28','F29','F30','F31','F32','G1','G2','G3','G4','G5','G6','G7','G8','G9','G10','G11','G12','G13','G14','G15','G16','G17','G18','G19','G20','G21','G22','G23','G24','G25','G26','G27','G28','G29','G30','G31','G32']
stimchannel = -1

data=mne.io.read_raw_edf('Subject01.bdf', preload=True, stim_channel=-1, eog=range(64, 73))

locs = mne.channels.read_montage('biosemi64')

data.pick_types(eeg=True, meg=False, stim=True)

locs.ch_names = data.ch_names[0:64]

data.set_montage(locs)

data.plot_psd(fmin=1, fmax=100, average=False, n_overlap=50)

# to find all of the events in the RAW item data given that the stim_channel
# is the last channel (which it is in all of our data)
mne.find_events(data, stim_channel=data.ch_names[-1])

# find all events as above and only include those with id == 1
# include can be a list
mne.pick_events(mne.find_events(data, stim_channel=data.ch_names[-1]), include=1)
