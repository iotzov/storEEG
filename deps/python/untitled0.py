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

raw = mne.io.read_raw_edf('S18.bdf', stim_channel = -1, eog = range(64,70), preload=True)

#raw.displayRaw = MethodType(displayRaw.displayRaw, raw)
#raw.displayRaw()

#displayFunctions.displayRawMNE(raw)

f = open('channelsToDrop_biosemi64.txt')

channelsToDrop = [x.rstrip() for x in f.readlines()]

f.close()

raw.drop_channels(channelsToDrop)