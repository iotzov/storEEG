import numpy
import json
import jsonschema
import mne
import uuid
import copy

class BaseObj(object):

    def __init__(self, properties):
        self.properties = properties
        for key in properties:
            setattr(self, key, None)
        self.setUUID()
        self.getSchema()
        self.getAttrTypes()

    def getDict(self):
        return dict(zip(self.properties, [self.__dict__[x] for x in self.properties]))

    def updateFromDict(self, dictionary):
        """
            Usage: class.updateFromDict(dictionary) - sets attributes of class in dictionary.keys() to dictionary[key]
            Returns: Nothing
        """
        for key in dictionary:
            setattr(self, key, dictionary[key])

    def convertToJSON(self):
        """
            Usage: class.convertToJSON()
            Returns: String that is the JSON representation of all data in class
        """
        return json.dumps(dict(zip(self.properties, [self.__dict__[x] for x in self.properties])))

    def writeToJSON(self, filename):
        """
            Writes this object in JSON form to the file specified by `filename`
        """
        with open(filename, 'w') as f:
            json.dump(dict(zip(self.properties, [self.__dict__[x] for x in self.properties])), f)

    def loadFromJSON(self, filename):
        with open(filename) as f:
            data = json.load(f)
        for key in data.keys():
            setattr(self, key, data[key])

    def validateSelf(self):
        """
            Validates self against `schema`, returns True if valid, False if invalid.
        """
        d = dict(zip(self.properties, [self.__dict__[x] for x in self.properties]))
        try:
            jsonschema.validate(d, self.schema)
            return True
        except jsonschema.exceptions.ValidationError:
            return False

    def setUUID(self):
        """
            Sets the UUID of this object to one generated on the fly
        """
        self.UUID = uuid.uuid1().__str__()

    def inputAll(self):
        """
            Input all attributes for this object. Overwrites everything.

            Very primitive, needs a lot of improvement
        """
        for key in self.properties:
            userInput = input('Please input '+key+':')
            if 'number' in self.attrTypes[key]:
                userInput = int(userInput)
            if(getattr(self, key) is ''):
                setattr(self, key, None)
            else:
                setattr(self, key, userInput)

    def printAll(self):
        """
            Print all of the attributes in some random order.
        """
        for key in self.properties:
            print(key+':\n', getattr(self, key))

    def getAttrTypes(self):
        self.attrTypes = copy.deepcopy(self.schema['properties'])
        for key in self.properties:
            self.attrTypes[key] = self.attrTypes[key]['type']

    def getSchema(self):
        name = self.__class__.__name__
        name = '../json/'+name+'.json'
        with open(name) as f:
            self.schema = json.load(f)

class Contact(BaseObj):
    def __init__(self):
        BaseObj.__init__(self, ('firstName', 'lastName', 'phoneNumber', 'email'))

class Event(BaseObj):
    def __init__(self):
        BaseObj.__init__(self, ('stimulusID', 'startTrigger', 'endTrigger', 'eventID', 'eventDescription'))

class Experimenter(BaseObj):
    def __init__(self):
        BaseObj.__init__(self, ('firstName', 'lastName', 'role', 'affiliation'))

class License(BaseObj):
    def __init__(self):
        BaseObj.__init__(self, ('licenseType', 'licenseLocation'))

class Publication(BaseObj):
    def __init__(self):
        BaseObj.__init__(self, ('citation', 'link'))

class Recording(BaseObj):
    def __init__(self):
        BaseObj.__init__(self, ('fileLocation', 'eventIDs', 'subjectID', 'recordingParametersID', 'recordingID'))

class RecordingParameters(BaseObj):
    def __init__(self):
        BaseObj.__init__(self, ('samplingRate', 'startChannel', 'endChannel', 'referenceChannels', 'nonScalpChannels', 'label', 'recordingParametersID'))

class Stimulus(BaseObj):
    def __init__(self, ):
        BaseObj.__init__(self, ('fileLocation', 'eventID', 'stimulusType', 'stimulusDescription', 'stimulusID'))

class Subject(BaseObj):
    def __init__(self):
        BaseObj.__init__(self, ('subjectID', 'group', 'gender', 'yob', 'height', 'weight', 'handedness', 'vision', 'hearing', 'additionalInfo', 'channelLocations'))

class Study(BaseObj):
    """
        Main class that holds each study. Composed of attributes that are described in study.json
        Most attributes are dictionaries of previously defined classes, with keys being the object's UUID

        Usage example -- Study(subjects=list(storEEG.Subject), recordings=list(storEEG.Recording))
            -Names of arguments should be the same as array fields described in study.json
            -Values of arguments should be lists of the appropriate type of object.
            -E.g. To pass all of the Study's recording objects

    """
    def __init__(self, **kwargs):
        self.properties = ('subjects', 'stimuli', 'recordingParameterSets', 'recordings', 'events', 'publications', 'experimenters', 'license', 'contacts')
        self.setUUID()
        for key in kwargs.keys():
            self.setAttrFromList(key, kwargs[key])

        for prop in self.properties:
            if prop not in self.__dict__.keys():
                setattr(self, prop, dict())
        self.getSchema()

    def setPropertyFromList(self, attr, values):
        if 'license' in attr:
            setattr(self, attr, values)
            return
        setattr(self, attr, {})
        for item in values:
            getattr(self, attr)[item.UUID] = item

    def addNewItemToProperty(self, prop, newItem):
        getattr(self, prop)[newItem.UUID] = newItem

    def fillFromDict(self, dictionary):
        for key in dictionary.keys():
            self.setPropertyFromList(key, dictionary[key])

    def validateStudy(self):
        d = copy.deepcopy(self.__dict__)
        for key in self.properties:
            if 'license' not in key:
                d[key] = list(d[key].values())
        jsonschema.validate(d, self.schema)

    def extractDesiredDataBDF(recording, event, padding=None):
        """
            Usage: extractDesiredData(storEEG.Recording, storEEG.Event)
                -- recording should be the UUID of the desired Recording object, raw data will be loaded from it
                -- event should be the UUID of the desired Event object, with startTrigger and endTrigger defined
                -- padding should be a 2-item tuple. Data will be returned from time (startTrigger-padding(0)) to time (endTrigger+padding(1))
            Returns: numpy ndarray containing requested data
            Notes:
                -- This function is for .bdf/.edf files ONLY
        """
        raw = mne.io.read_raw_edf(recording.fileLocation)
        events = mne.find_events(raw)
        s = numpy.where(events==event.startTrigger)
        e = numpy.where(events==event.endTrigger)
        s = events[s[0], 0]
        e = events[e[0], 0]
        if(padding!=None):
            data, times = raw[:, s-padding[0]:e+padding[1]]
        else:
            data, times = raw[:, s:e]

        return data
