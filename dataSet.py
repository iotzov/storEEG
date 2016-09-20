import shelve

# f = shelve.open('/home/datastore/data/metadata.db')

class dataDB():
    def __init__(self):
#        self.sets = shelve.open('/home/datastore/data/meta.data')
        self.metaDataFile = ''

    def addSet(self, newSet):
        self.sets[newSet.name] = newSet
    def removeSet(self, setToDelete):
        pass
    def listAll():
        a = list(self.sets.keys())
        a.sort()
        return a

class dataSet():
    
    """Container class for data sets. Contains all relevant metadata
    for one data set, including path of relevant files, date, experimenter, etc."""

    # Class variables:
    # name: name of the data set
    # date: date or dates of the collection of data sets
    # files: list of paths to relevant files to this data set
    # experimenter: who performed the experiment 
    # publications: list of publications this data is involved in, 'None' if none
    # stimType: type of stimulus presented 
        # Possible values of stimType still need to be defined

    def __init__(self, name):
        self.name = name
        self.date = None
        self.files = []
        self.experimenter = None
        self.publications = []
        self.stimType = []
        answer = input("Do you wish to input data set information now? (y/n): ")
        if answer == 'y' or answer == 'Y':
            self.inputInfo()


    def inputInfo(self):
        self.date = input("Please enter a date for the data set (mm/dd/yyyy): ")
        self.experimenter = input("Please enter the name of the experimenter: ")
        self.inputPubs()
        print('Please enter the type of stimulus used in the experiment')
        print('V --> video')
        print('A --> audio')
        print('AV --> audio/video')
        print('AS --> audio/speech')
        print('If multiple stimulus types were used, please enter \'M\' \n')
        temp = input()
        if(temp == 'M'):
            while(True):
                print('Please enter the stimulus type (\'q\' to quit): ', end=' ')
                temp = input()
                if(temp == 'q'):
                    break
                else:
                    self.stimType.append(temp)
        else:
            self.stimType.append(temp)
        print('\n')


    def inputPubs(self):
        answer = input("Has this data been involved in any publications? (y/n)")
        if answer == 'y' or answer == 'Y':
            answer = input("Has this data set been involved in more than 1 publication? (y/n)")
            if answer == 'y' or answer == 'Y':
                while(True):
                    print('Please enter the name and date of the publication. Enter \'end\' to exit')
                    answer = input()
                    if answer == 'end':
                        break
                    self.publications.append(answer)
            else:
                self.publications.append(input('Please enter the name and date of the publication: '))

    def printInfo(self):
        # Print name and date
        print('Data set {0}'.format(self.name), end=' ')
        print(self.date)

        # Print experimenter
        print('Data gathered by {0}'.format(self.experimenter))

        # Print publications
        if(len(self.publications) == 0):
            print('This data has not been included in any publications')
        else:
            print('This data has been included in these publications:')
            for thing in self.publications:
                print(thing)

        # Print stimulus types
        print('Stimulus types used: ')
        for thing in self.stimType:
            print(thing)

    def changeName(self, newName):
        self.name = newName

    def changeDate(self, newDate):
        self.date = newDate

    def changeExperimenter(self, newExperimenter):
        self.experimenter = newExperimenter

    def changeStims(self, newStims):
        self.stimType = newStims

    def changeFiles(self, newFiles):
        self.files = newFiles

    def addFile(self, newFile):
        self.files.append(newFile)

    def promptFile(self):
        pass

class dataFile():
    """Why isn't this working?"""
    def __init__(self, filePath=None, stimType=None, subject=None, stimPath=None):
        self.filePath = filePath
        self.stimType = stimType
        self.subject = subject
        self.stimPath = stimPath
        
        if(self.filePath==None):
            self.promptForInfo()

    def getPath(self):
        return self.filePath
    def getStim(self):
        return self.stimType
    def newPath(self, path):
        self.filePath = path
    def newStim(self, stim):
        self.stimType = stim
    def getSubject(self):
        return self.subject
    def getStimPath(self):
        return self.stimPath
    
    def promptForInfo(self):
        self.filePath = input("Please enter the path of the data file: ")
        print('Please enter the type of stimulus used in the experiment')
        print('V --> video')
        print('A --> audio')
        print('AV --> audio/video')
        print('AS --> audio/speech')
        print('If multiple stimulus types were used, please enter \'M\' \n')
        temp = input()
        if(temp == 'M'):
            while(True):
                print('Please enter the stimulus type (\'q\' to quit): ', end=' ')
                temp = input()
                if(temp == 'q'):
                    break
                else:
                    self.stimType.append(temp)
        else:
            self.stimType = temp
        
        self.subject = input('Please enter the subject name or number: ')
        stimpath = input('Please enter the path to the stimulus file. If there are multiple please enter \'M\'')
        if(stimpath=='M'):
            self.stimPath = []
            while(True):
                temp=input('Please enter a file path (or enter q to exit loop): ')
                if(temp=='q'):
                    break
                else:
                    self.stimType.append(temp)
        else:
            self.stimType = stimpath
