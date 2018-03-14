#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Mar 13 15:04:57 2018

@author: ivan
"""

import mne
import numpy as np
import matplotlib.pyplot as plt
#import displayRaw
#from types import MethodType
import displayFunctions
import json

raw = mne.io.read_raw_edf('S23.bdf', stim_channel = -1, eog = range(64,70), preload=True)

#raw.displayRaw = MethodType(displayRaw.displayRaw, raw)
#raw.displayRaw()

#displayFunctions.displayRawMNE(raw)

f = open('channelsToDrop_biosemi64.txt')

channelsToDrop = [x.rstrip() for x in f.readlines()]

f.close()

raw.drop_channels(channelsToDrop)

print(raw)

with open('biosemi64_mapping.json','r') as x:
    mapping = json.load(x)
    x.close()

raw.rename_channels(mapping)

raw.set_montage(mne.channels.read_montage('biosemi64'))

print(raw)
print(raw.info)
#raw.plot_sensors()

raw.filter(0.5,None)
raw.plot()