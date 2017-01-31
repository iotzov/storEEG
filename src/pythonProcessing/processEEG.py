import storEEG
import os
import mne
import glob
import time
import numpy
import scipy.io as sio

class StorProcessor(object):
    def __init__(self, pathToFiles):
        if os.path.exists(os.path.join(os.getcwd(), pathToFiles)):
            self.pathToFiles = os.path.join(os.getcwd(), pathToFiles)
            self.currentLocation = os.getcwd()
            os.chdir(self.pathToFiles)

            self.fileType = input('Please enter the file type (e.g. .bdf, .edf, .set): ')
            self.fileList = glob.glob('*' + self.fileType)
            self.getFileObjects()

            print('File objects created successfully!')
            print('Printing file info now')
            time.sleep(2)
            for item in self.fileObjs:
                print(item)
            i = input('Does this look correct? (y or n):')
            if 'y' in i:
                pass
            else:
                quit()

        else:
            print('Error: File directory not found')

    def getFileObjects(self):
        self.fileObjs = list()
        if '.bdf' in self.fileType or '.edf' in self.fileType:
            for file in self.fileList:
                self.fileObjs.append(mne.io.read_raw_edf(file))
        elif '.set' in self.fileType:
            for file in self.fileList:
                self.fileObjs.append(mne.io.read_raw_eeglab(file))
        os.system('cls' if os.name == 'nt' else 'clear')

    def readEvents(self):
        for item in self.fileObjs:
            item.info['events'] = mne.find_events(item)

    def getEpoch(self, raw, start, stop, pad):
        s = numpy.where(raw.info['events']==start)
        e = numpy.where(raw.info['events']==stop)
        if numpy.shape(s):
            s = s[0]
        if numpy.shape(e):
            e = e[0]
        s = raw.info['events'][s[0], 0]
        e = raw.info['events'][e[0], 0]
        if pad:
            data, times = raw[:, s-padding[0]:e+padding[1]]
        else:
            data, times = raw[:, s:e]
        return data

    def volumize(self):
        i = input('Does the desired epoch have consistent triggers accross channels? (y or n)')

        if 'y' in i:
            startTrig = int(input('Please input the start trigger: '))
            endTrig = int(input('Please input the end trigger: '))
            pad = input('Please input desired padding (empty for none): ')
            if pad:
                pad = int(pad)
            extracted = list()
            lens = list()
            for item in self.fileObjs:
                extracted.append(self.getEpoch(item, startTrig, endTrig, pad))
                lens.append(numpy.shape(extracted[-1])[1])
            minlen = min(lens)
            for idx, item in enumerate(extracted):
                extracted[idx] = extracted[idx][:,0:minlen]
            final = numpy.dstack(extracted)
            os.chdir(self.currentLocation)
            sio.savemat('EEG Volume', {'volume': final})
            os.chdir(self.pathToFiles)
        if 'n' in i:
            pad = input('Please input desired padding (empty for none): ')
            if pad:
                pad = int(pad)
            extracted = list()
            for item in self.fileObjs:
                print(item)
                startTrig = int(input('Please input the start trigger: '))
                endTrig = int(input('Please input the end trigger: '))
                extracted.append(self.getEpoch(item, startTrig, endTrig, pad))
            final = numpy.dstack(extracted)
            os.chdir(self.currentLocation)
            sio.savemat('EEG Volume', {'volume': final})
            os.chdir(self.pathToFiles)
