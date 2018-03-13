import numpy as np
import matplotlib.pyplot as plt
import mne

def displayRawMNE(raw):
    """Display a scaled image of the Raw data using standard methods"""

    if not raw.preload:
        raw.load_data()

    print('EEG data shape: {0}'.format(raw._data.shape))
    raw._data = raw._data[0:63,:]

    D, T = raw._data.shape

    # plt.imshow(self._data[0:63,:], cmap=plt.cm.jet, extent=(0,T,0,D), origin='upper', aspect='auto')
    plt.imshow(raw._data, cmap=plt.cm.jet, extent=(0,T,0,D), origin='lower', aspect='auto')
