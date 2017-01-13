import numpy
import json
import jsonschema
import mne
import uuid

class BaseObj(object):
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
        return json.dumps(self.__dict__)

    def validateSelf(self, schema):
        try:
            jsonschema.validate(self.__dict__, schema)
            return True
        except jsonschema.exceptions.ValidationError:
            return False

    def setUUID(self):
        self.UUID = uuid.uuid1().__str__()

class Contact(BaseObj):
    def __init__(self, firstName=None, lastName=None, phoneNumber=None, email=None):
        self.firstName = firstName
        self.lastName = lastName
        self.phoneNumber = phoneNumber
        self.email = email

class Event(BaseObj):
    def __init__(self, stimulusID, startTrigger, endTrigger, eventID, eventDescription):
        self.stimulusID = stimulusID
        self.startTrigger = startTrigger
        self.endTrigger = endTrigger
        self.eventID = eventID
        self.eventDescription = eventDescription

class Experimenter(BaseObj):
    def __init__(self, firstName, lastName, role, affiliation):
        self.firstName = firstName
        self.lastName = lastName
        self.role = role
        self.affiliation = affiliation

class License(BaseObj):
    def __init__(self, licenseType, licenseLocation):
        self.licenseType = licenseType
        self.licenseLocation = licenseLocation

class Publication(BaseObj):
    def __init__(self, citation, link):
        self.citation = citation
        self.link = link

class Recording(BaseObj):
    def __init__(self, fileLocation=None, eventIDs=None, subjectID=None, recordingParametersID=None, recordingID=None):
        self.fileLocation = fileLocation
        self.eventIDs = eventIDs
        self.subjectID = subjectID
        self.recordingParametersID = recordingParametersID
        self.recordingID = recordingID

class RecordingParameters(BaseObj):
    def __init__(self, samplingRate=None, startChannel=None, endChannel=None, referenceChannels=None, nonScalpChannels=None, label=None, recordingParametersID=None):
        self.samplingRate = samplingRate
        self.startChannel = startChannel
        self.endChannel = endChannel
        self.referenceChannels = referenceChannels
        self.nonScalpChannels = nonScalpChannels
        self.label = label
        self.recordingParametersID = recordingParametersID

class Stimulus(BaseObj):
    def __init__(self, fileLocation=None, eventID=None, stimulusType=None, stimulusDescription=None, stimulusID=None):
        self.fileLocation = fileLocation
        self.eventID = eventID
        self.stimulusType = stimulusType
        self.stimulusDescription = stimulusDescription
        self.stimulusID = stimulusID

class Subject(BaseObj):
    def __init__(self, subjectID=None, group=None, gender=None, yob=None, height=None, weight=None, handedness=None, vision=None, hearing=None, additionalInfo=None, channelLocations=None):
        self.subjectID= subjectID
        self.group = group
        self.gender = gender
        self.yob = yob
        self.height = height
        self.weight = weight
        self.handedness = handedness
        self.vision = vision
        self.hearing = hearing
        self.additionalInfo = additionalInfo
        self.channelLocations = channelLocations

def extractDesiredDataBDF(recording, event, padding=None):
    """
        Usage: extractDesiredData(storEEG.Recording, storEEG.Event)
            -- recording should be a storEEG.Recording object, raw data will be loaded from it
            -- event should be a storEEG.Event object, with startTrigger and endTrigger defined
            -- padding should be a 2-item tuple. Data will be returned from time (startTrigger-padding(0)) to time (endTrigger+padding(1))
        Returns: numpy ndarray containing requested data
        Notes:
            -- This function is for .bdf/.edf files ONLY
    """
    raw = mne.io.read_raw_edf(recording.fileLocation)
    events = mne.find_events(raw, stim_channel='STI 014')
    s = numpy.where(events==event.startTrigger)
    e = numpy.where(events==event.endTrigger)
    s = events[s[0], 0]
    e = events[e[0], 0]
    if(padding!=None):
        data, times = raw[:, s-padding[0]:e+padding[1]]
    else:
        data, times = raw[:, s:e]

    return data

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
        self.itemList = ['subjects', 'stimuli', 'recordingParameterSets', 'recordings', 'events', 'publications', 'experimenters', 'license', 'contacts']
        for key in kwargs.keys():
            self.setFromList(key, kwargs[key])

    def setFromList(self, attr, values):
        setattr(self, attr, {})
        for item in values:
            getattr(self, attr)[item.UUID] = item
