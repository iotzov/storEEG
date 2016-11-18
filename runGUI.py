import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk
import os
from dataSet import *

#class displaySetPage(
class gadroRep:
    
    """This class houses the GUI and integrates the data transfer between the GUI and the DB"""

    # Button click function definitions:

    def BrowseDataButtonClicked(self, button):
        self.currentBrowsePage = self.createBrowsePage()
        self.currentBrowsePage.show_all()

    def onDeleteMain(self, *args):
        Gtk.main_quit(*args)

    def onDeleteWindow(self, *args):
        args[0].hide()
        return True

    # Function below needs to be fleshed out
    def SearchButtonClicked(self, button):
        pass

    def OpenStimButtonNewFileClicked(self, button):
        """open window that shows currently known stim files and offers options to add new stim files"""
        self.StimFileDisplayWindow = self.builder.get_object("StimFileDisplayWindow")
        self.StimFileDisplayWindow.show_all()

    def populateNewStimWindow(self):
        """creates a new stim window with only add and exit buttons"""
        pass
    def OpenDataFileButtonNewFileClicked(self, button):
        """open window that shows currently known data files and offers options to add new data files"""
        self.newSetDataFiles=self.builder.get_object('DataFileDisplayWindow')
        self.newSetDataFiles.show_all()

    def HelpButtonClicked(self, button):
        self.HelpScreen = self.builder.get_object('HelpScreen')
        self.HelpScreen.show()

    def QuitButtonClicked(self, button):
        Gtk.main_quit()

    def AddNewButtonClicked(self, button):
        self.AddDataSet = self.builder.get_object('AddDataSet')
        self.AddDataSet.show_all()

    def testGetChildren(self, button):
        for x in button.get_parent().get_children():
            print(Gtk.Buildable.get_name(x))

    def FileChooserCancelButtonClicked(self, button):
        self.onDeleteWindow(button.get_toplevel())

    def FileChooserAddButtonClicked(self, button):
        print(button.get_toplevel().get_filenames())
        selected = button.get_toplevel().get_filenames()
        for x in selected:
            if(os.path.isdir(x)):
                self.updateStimChooserFolder(x)
            else:
                self.updateStimChooserFile(x)
        self.onDeleteWindow(button.get_toplevel())

    def destroyBrowse(self, *args):
        """Destroys old browse window when closed to lower required resources"""
        if(self.currentBrowsePage != None):
            self.currentBrowsePage.destroy()
            self.currentBrowsePage = None
            return True
        return False

    def clearAddDataWindow(self):
        """clears the AddDataSet window so none of the entries are filled if it is re-opened"""

    # Stim File Chooser window functions

    def CancelStimForm(self, button):
        button.get_toplevel().destroy()

    def SubmitSelectedStimForm(self, button):
        pass

    def RemoveSelectedStimFile(self, button):
        selected = self.StimFileDisplayWindow.get_selected_row()
        selected.destroy()

    def OpenFileChooserWindow(self, button):
        self.StimFileChooser = self.builder.get_object('StimFileChooser')
        self.StimFileChooser.show_all()

    def updateStimChooserFile(self, pathToSelected):
       pass 
    
    def updateStimChooserFolder(self, selected):
        files = [f for f in os.listdir(selected) if os.path.isfile(join(selected, f))]
        for f in files:
            self.updateStimChooserFile(f)


    # Data file chooser window functions

    def DataChooserAddClicked(self, button):
        pass

    def DataChooserCancelClicked(self, button):
        pass

    def OpenDataFileChooser(self, button):
        pass

    def RemoveDataFileClicked(self, button):
        pass

    def SubmitSelectedDataClicked(self, button):
        pass

    def CancelDataFormClicked(self, button):
        pass

    def __init__(self):
        self.builder = Gtk.Builder()
        self.builder.add_from_file('avogadroGUI.glade')

        self.builder.connect_signals(self)

        self.MainMenu = self.builder.get_object('MainMenu')
        self.MainMenu.show_all()
        self.stimFileChooser = self.builder.get_object('stimFileChooser')
        self.currentStimList = None
        self.db = dataDB()

    def createBrowsePage(self):
        browseWindow = Gtk.Window()
        nbook = Gtk.Notebook()
        browseWindow.add(nbook)
        browseWindow.resize(400,400)
        nbook.set_tab_pos(Gtk.PositionType(0))
        for dset in self.db.sets:
            temp = Gtk.Grid()
            temp.set_row_spacing(4)
            temp.insert_column(0)
            temp.insert_column(1)
            temp.insert_row(0)
            temp.insert_row(1)
            temp.insert_row(2)
            temp.insert_row(3)
            temp.insert_row(4)

            nbook.append_page(temp, Gtk.Label(dset.name))
            temp.attach(Gtk.Label('Date: '), 0,0,1,1)
            temp.attach(Gtk.Label('Publications: '), 0,1,1,1)
            temp.attach(Gtk.Label('Experimenter: '), 0,2,1,1)
            temp.attach(Gtk.Label('Stimuli: '), 0,3,1,1)

            temp.attach(Gtk.Label(dset.date), 1,0,1,1)
            temp.attach(Gtk.Label(dset.publications), 1,1,1,1)
            temp.attach(Gtk.Label(dset.experimenter), 1,2,1,1)
            temp.attach(Gtk.Label(dset.stimuli), 1,3,1,1)

            a = Gtk.Button('View data set files')
            b = Gtk.Button('View stimulus files')
            a.connect('clicked', self.ShowDataFiles)
            b.connect('clicked', self.ShowStimFiles)
            temp.attach(a, 0,4,1,1)
            temp.attach(b, 1,4,1,1)
        browseWindow.connect('delete-event', self.destroyBrowse)
        return browseWindow


    def ShowDataFiles(self, button):
        pass

    def ShowStimFiles(self, button):
        pass

if __name__ == "__main__":
    main = gadroRep()
    Gtk.main()
