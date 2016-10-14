import shelve as shlv

class dataDB():

    """Main DB class, stores overall metadata as well as pointers to dataSet() folder locations"""

    def __init__(self):

        self.dbInfo = shlv.open('.meta_DB')      # Open main metadata file
        self.sets = dbInfo['sets']               # Import info about all data sets
        self.users = dbInfo['users']             # Import user & permissions info
        self.logInfo = [line.rstrip('\n') for line in open('filename')]       # Get info from changelog
        self.log = open(dbInfo['log'], 'a+t')         # Open changelog for adding new info

    def addSet(self, newSet): 
        """Add a set to the database"""
        pass

    def replaceSetData(self, setName, newData):
        """Replace metadata file of setName with newData"""
        pass

    def removeSet(self, setName):
        """Deletes setName from the DB. REQUIRES ELEVATED PERMISSIONS."""
        pass

    def getAllSetData(self):
        """Return dictionary of set names(keys) and metadata file locations(values)"""
        pass

class dataSet():

    """Houses a single data set and manages its folder and information"""

    def __init__(self):
        self.name = None
        self.date = None
        self.publications = None
        self.experimenter = None
        self.stimuli = None
