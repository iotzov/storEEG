import npyscreen as nps

class dataSetForm(nps.ActionForm):
    """Data entry form for the dataSet class
       Allows user to update data for existing sets or enter data for new sets
       Created and called by the mainMenu"""

       def create(self):
           self.value = None
           self.vName = self.add(nps.TitleText, name = "Data Set Name")
           self.vExperimenter = self.add(nps.TitleText, name = "Experimenter:")
           self.vPublications = self.add(nps.TitleText, name = "Publications:")
           self.vDate = self.add(nps.TitleDateCombo, name = "Date:")
           self.vStimTypes = self.add(nps.TitleMultiSelect, max_height=4,
                   value=[1,], name="Choose 1 or more stimulus types:",
                   values = ["Visual", "Audio", "Video", "Other"])
        def on_cancel(self):
            self.parentApp.switchFormPrevious()
        def on_ok(self): # This should edit/add the dataSet as appropriate
            pass

class mainMenu(nps.ActionForm):
    """Houses the main menu that the user can use to move around the program"""
    def onStart(self):
    # Needs work

class setDisplay(nps.FormMutt):
    MAIN_WIDGET_CLASS = dataList

    def beforeEditing(self):
        self.updateDisplayed()
    def updateDisplayed(self):
        self.wMain.values = self.parentApp.database.listAll()
        self.wMain.display()


