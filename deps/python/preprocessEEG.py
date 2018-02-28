import numpy as np
import numpy.linalg as lin
import scipy.signal as sig
import matplotlib.pyplot as plt
import mne

def preprocessEEG(eeg, fs, eogChannels=None, badChannels=None, hpCutoff=0.5, stdThresh=4):
    """

    Preprocess EEG data and return data that has been filtered with bad channels removed.

    Input:
       eeg          - ndarray of samples x channels (TxD)
       fs           - sampling rate in Hz
       eogChannels  - list/tuple of which channels in EEG are EOG (Default = None)
       badChannels  - list/tuple of channels in EEG to remove (Default = None)
       hpCutoff     - cutoff of the high-pass filter in Hz (Default = 0.5 Hz)
       stdThresh    - # of standard deviations to tolerate before marking sample outlier (Default = 4)

    """

    z, p, k = sig.butter(5, hpCutoff / fs * 2, 'highpass', output='zpk')

    sos = sig.zpk2sos(z, p, k)

    T, D = eeg.shape

    eeg = eeg - np.concatenate([eeg[[0], :] for i in range(T)]) # remove starting offset

    eeg = sig.sosfilt(sos, eeg) # apply high-pass filtering

    if eogChannels is not None:
        eeg = eeg - np.dot(eeg[:,eogChannels], lin.lstsq(eeg[:,eogChannels],eeg)[0]) # regress out EOG data
        eeg = np.delete(eeg, eogChannels, axis=1)

    # detect outliers > stdThresh
    stdThresh = stdThresh * np.std(eeg, 0)
    stdThresh = np.stack([stdThresh for _ in range(T)], axis=0)

    eeg[np.nonzero(np.abs(eeg)>stdThresh)] = 0 # remove outliers

    h = np.zeros(int(np.around(fs*0.04)))

    h[0] = 1

    eeg = sig.lfilter(h, 1, np.flipud(sig.lfilter(h, 1, np.flipud(eeg))))

    eeg[np.isnan(eeg)] = 0.0

    if badChannels is not None:
        eeg[:, badChannels] = 0   # zero out bad channels

    return eeg
