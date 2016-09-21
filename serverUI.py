import npyscreen as nps

class dataSetEditForm(nps.ActionForm):
    """Data entry form for the dataSet class
       Allows user to update data for existing sets or enter data for new sets
       Created and called by the mainMenu"""

    def create(self):
        self.value = None
        self.vName = self.add(nps.TitleText, name = "Data Set Name")
        self.vExperimenter = self.add(nps.TitleText, name = "Experimenter:")
        self.vPublications = self.add(nps.TitleText, name = "Publications:")
        self.vDate = self.add(nps.TitleDateCombo, name = "Date:")
        self.vStimTypes = self.add(nps.TitleMultiSelect, max_height=-4,
            value=[1,], name="Choose 1 or more stimulus types (use spacebar to select/deselect):",
            values = ["Visual", "Audio", "Video", "Other"], scroll_exit=True)

    def on_cancel(self):
        self.parentApp.switchFormPrevious()

    def on_ok(self): # This should edit/add the dataSet as appropriate
        pass

class dataSetItem(nps.MultiLineAction):
    """Widget that is displayed in the add/edit screen. Corresponds to a single data set"""
    def __init__(self, *args, **keywords):
        super(dataSetItem, self).__init__(*args, **keywords)

    def displayValues(self, vl):
        return vl.getName()

    def actionHighlighted(self, act_on_this, keypress):
        self.parent.parentApp.getForm('EDITDATASET').value = act_on_this[0]
        self.parent.parentApp.switchForm('EDITDATASET')


class mainMenu(nps.ActionForm):
    """Houses the main menu that the user can use to move around the program"""
    def onStart(self):
        pass
    # Needs work

class setDisplay(nps.FormMutt):
    MAIN_WIDGET_CLASS = dataSetItem

    def beforeEditing(self):
        self.updateDisplayed()
        
    def updateDisplayed(self):
        self.wMain.values = self.parentApp.database.listAll()
        self.wMain.display()

class dataSetManager(nps.NPSAppManaged):
    def onStart(self):
        self.database = dataSet.dataDB()
        self.addForm("MAIN", mainMenu)
        self.addForm("EDITDATASET", dataSetEditForm)
        self.addForm("DISPLAYSETS", setDisplay)

