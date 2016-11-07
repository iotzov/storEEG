# This class is intended to manage the database and serve as interpreter between the user and the database

class dataRepository(object):
    """docstring for dataRepository.

    Main repository class that tracks all of the studies that are added into it.
    Interfaces with the main database file and adds/modifies/deletes entries as necessary

    This class should only be instantiated once based on the database file that is provided
    If a database file does not exist yet, one will be created
    """
    def __init__(self, dbFile = None):
        self.arg = arg

class Study(object):
    """docstring for Study.

    The Study class houses a single study that is part of the dataRepository.
    One study contains a number of sessions, each of which is an instance of the Session class."""
    def __init__(self, arg):
        self.arg = arg

class Session(object):
    """docstring for Session.

    The Session class houses a single session that is part of a study.
    It holds the raw data file and information about stimuli/events for that session.
    Additionally, the Session class is responsible for ensuring the file structure is correct for its data."""
    def __init__(self, arg):
        self.arg = arg

        
