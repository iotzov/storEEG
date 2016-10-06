import shelve as shlv

class dataDB():

    """Main DB class, stores overall metadata as well as pointers to dataSet() folder locations"""

    def __init__(self):

        self.dbInfo = shlv.open('.meta_DB')      # Open main metadata file
        self.sets = dbInfo['sets']               # Import info about all data sets
        self.users = dbInfo['users']             # Import user & permissions info
        self.logInfo = [line.rstrip('\n') for line in open('filename')]       # Get info from changelog
        self.log = open(dbInfo['log'], 'a+t')         # Open changelog for adding new info
