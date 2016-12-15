import json, os

class level1Study:
    """
    Here's a docstring!
    """

    def __init__(self, xmlPath = None, schemaPath = os.getcwd() + '/levelone.schema'):

        with open(schemaPath) as f:
            d = json.JSONDecoder()
            self.schema = d.decode(f.read())

        if xmlPath == None:
            self.promptForInfo()
        else:
            self.parseStudyXML()

